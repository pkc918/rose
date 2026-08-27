---
theme: z-blue
highlight: agate
title: mpc-plus 依赖注入架构设计
date: 2026-08-27
---

## 1. 设计目标

`mpc-plus` 是一个多平台小程序部署工具，需要同时支持：

- CLI 非交互式调用，适用于 CI/CD。
- TUI 交互式调用，适用于本地开发。
- 微信、抖音等多个底层平台。
- TypeScript 配置文件与 `defineConfig()` 类型提示。
- 平台按需组合。
- 后续扩展新平台时尽量不修改 Core。

整体调用链为：

```text
CLI ──→ Standard ──→ Core
TUI ──→ Standard ──→ Core

Standard 将 WeChat、Douyin 注入 Core

Core ──→ PlatformExecutor
             │
             ├── WeChat
             └── Douyin
```

依赖注入的重点是：

> Core 不主动导入微信或抖音，而是由 Standard 将平台实现传入 Core。

---

## 2. Monorepo 结构

```text
packages/
├── cli/
│   └── 非交互式命令入口
├── tui/
│   └── 交互式终端入口
├── core/
│   └── 配置、Release、调度、事件和结果融合
├── standard/
│   └── 默认平台组合与适配
├── wechat/
│   └── 微信底层能力
├── douyin/
│   └── 抖音底层能力
└── shared/
    └── 真正跨包复用的通用工具
```

包依赖关系：

```text
cli ─────────→ standard
tui ─────────→ standard

standard ────→ core
standard ────→ wechat
standard ────→ douyin

wechat ──────→ miniprogram-ci
douyin ──────→ tt-ide-cli
```

其中：

- `core` 不依赖 `wechat` 和 `douyin`。
- `wechat`、`douyin` 不依赖 `core`。
- `standard` 同时知道 Core 和具体平台，负责完成适配与注入。
- `cli`、`tui` 不知道底层有哪些平台。

---

## 3. 各包职责

### Core

Core 是统一业务层，负责：

- 查找并加载 `mpc.config.ts`。
- 解析项目根目录。
- 读取 `package.json` 版本。
- 获取 Git commit message。
- 合并命令参数和配置文件。
- 选择需要执行的平台。
- 创建平台执行器。
- 调用 `upload()`、`preview()`、`doctor()`。
- 聚合结果和统一事件。

### WeChat / Douyin

平台包只实现底层能力：

- 定义本平台配置类型。
- 校验本平台配置。
- 将调用参数转换为官方 SDK 参数。
- 调用官方 SDK。
- 返回平台原始结果。

平台包不知道：

- CLI 或 TUI。
- `mpc.config.ts` 如何加载。
- Core 如何调度平台。
- 其他平台是否存在。

### Standard

Standard 是默认组合层，负责：

- 将 Core 接口与平台底层 API 适配。
- 注册内置微信、抖音平台。
- 创建预配置的 Core 实例。
- 导出包含内置平台类型的 `defineConfig()`。

### CLI / TUI

CLI 和 TUI 只是不同的输入输出方式：

```text
CLI：命令参数 → Core API → 文本/JSON 输出
TUI：用户交互 → Core API → 界面状态更新
```

---

## 4. Core 定义平台协议

平台接口由 Core 定义，因为 Core 是这个接口的使用方。

```ts
// packages/core/src/platform.ts

export interface ReleaseInfo {
  version: string
  description: string
}

export type PlatformEvent =
  | {
      type: 'progress'
      message: string
      percentage?: number
    }
  | {
      type: 'log'
      level: 'info' | 'warn' | 'error'
      message: string
    }

export interface PlatformActionInput {
  release: ReleaseInfo
  signal?: AbortSignal
}

export interface PlatformExecutor {
  upload(
    input: PlatformActionInput,
  ): Promise<unknown>

  preview(
    input: PlatformActionInput,
  ): Promise<unknown>

  doctor(): Promise<DoctorCheck[]>
}

export interface PlatformDefinition<
  Name extends string = string,
  ConfigInput = unknown,
  Config = unknown,
> {
  name: Name

  schema: {
    parse(input: unknown): Config
  }

  create(options: {
    config: Config
    projectRoot: string
    emit(event: PlatformEvent): void
  }): PlatformExecutor

  /**
   * 仅用于提取 ConfigInput 类型，不参与运行。
   */
  readonly __configInput?: ConfigInput
}

export type PlatformRegistry = Record<
  string,
  PlatformDefinition
>
```

`PlatformDefinition` 表示一个平台具备三个阶段：

```text
原始配置
   ↓ schema.parse()
平台配置
   ↓ create()
PlatformExecutor
   ↓ upload()/preview()
执行结果
```

---

## 5. Core 的创建与执行

Core 接收平台 Registry，而不是直接导入微信、抖音。

```ts
// packages/core/src/create-mpc.ts

export interface CreateMpcOptions<
  Registry extends PlatformRegistry,
> {
  platforms: Registry

  cwd?: string
  configFile?: string

  onEvent?: (event: MpcEvent) => void
}

export async function createMpc<
  const Registry extends PlatformRegistry,
>(
  options: CreateMpcOptions<Registry>,
) {
  const loaded = await loadConfigFile({
    cwd: options.cwd ?? process.cwd(),
    configFile: options.configFile,
  })

  return new MpcRuntime({
    platforms: options.platforms,
    loaded,
    onEvent: options.onEvent,
  })
}
```

Core 的平台执行逻辑：

```ts
// packages/core/src/runtime.ts

class MpcRuntime<
  Registry extends PlatformRegistry,
> {
  constructor(
    private options: RuntimeOptions<Registry>,
  ) {}

  async upload(runOptions: RunOptions = {}) {
    return this.run('upload', runOptions)
  }

  async preview(runOptions: RunOptions = {}) {
    return this.run('preview', runOptions)
  }

  private async run(
    action: 'upload' | 'preview',
    runOptions: RunOptions,
  ) {
    const release = await resolveRelease({
      config: this.options.loaded.config.release,
      projectRoot:
        this.options.loaded.projectRoot,
      overrides: runOptions,
    })

    const selectedPlatforms =
      resolveSelectedPlatforms({
        config: this.options.loaded.config,
        requested: runOptions.platforms,
      })

    const results = []

    for (const name of selectedPlatforms) {
      const definition =
        this.options.platforms[name]

      if (!definition) {
        throw new Error(
          `Platform "${name}" is not registered`,
        )
      }

      const rawPlatformConfig =
        this.options.loaded.config
          .platforms[name]

      const platformConfig =
        definition.schema.parse(
          rawPlatformConfig,
        )

      const executor = definition.create({
        config: platformConfig,

        projectRoot:
          this.options.loaded.projectRoot,

        emit: event => {
          this.emit({
            type: 'platform:event',
            platform: name,
            event,
          })
        },
      })

      const result = await executor[action]({
        release,
        signal: runOptions.signal,
      })

      results.push({
        platform: name,
        result,
      })
    }

    return {
      action,
      release,
      results,
    }
  }
}
```

Core 只知道：

```ts
definition.schema.parse()
definition.create()
executor.upload()
executor.preview()
```

它不知道这些方法内部使用的具体平台 SDK。

---

## 6. 配置加载流程

配置文件：

```ts
import { defineConfig } from 'mpc'

export default defineConfig({
  project: {
    root: '.',
  },

  release: {
    version: 'package',
    description: 'git',
  },

  platforms: {
    wechat: {
      appid: process.env.WECHAT_APPID!,
      privateKey:
        process.env.WECHAT_PRIVATE_KEY!,
      output: './dist/mp-weixin',

      robot: 1,

      preview: {
        scene: 1011,
      },
    },

    douyin: {
      appid: process.env.DOUYIN_APPID!,
      token: process.env.DOUYIN_TOKEN!,
      output: './dist/mp-toutiao',

      upload: {
        channel: '1',
        sourcemap: true,
      },
    },
  },
})
```

Core 使用 `jiti` 等工具动态加载 TypeScript：

```ts
async function loadConfigFile(options) {
  const configPath = findConfigFile(
    options.cwd,
    options.configFile,
  )

  const jiti = createJiti(import.meta.url)

  const rawConfig =
    await jiti.import(configPath, {
      default: true,
    })

  const configDir = dirname(configPath)

  const baseConfig =
    baseConfigSchema.parse(rawConfig)

  return {
    config: baseConfig,
    configPath,
    configDir,

    projectRoot: resolve(
      configDir,
      baseConfig.project.root,
    ),
  }
}
```

配置数据流：

```text
mpc.config.ts
      ↓ 动态 import
RawConfig
      ↓ Core 校验公共配置
BaseConfig
      ↓ 选中具体平台
Platform RawConfig
      ↓ 平台 schema 校验
Platform Config
      ↓ 创建执行器
PlatformExecutor
      ↓
官方平台 SDK
```

---

## 7. 微信底层包

微信包提供独立的底层 API，不依赖 Core。

```ts
// packages/wechat/src/client.ts

export interface CreateWechatOptions {
  appid: string
  privateKey: string
  robot?: number
}

export interface WechatUploadInput {
  projectPath: string
  version: string
  description: string
  upload?: WechatUploadOptions

  onProgress?: (
    progress: WechatProgress,
  ) => void
}

export function createWechat(
  options: CreateWechatOptions,
) {
  return {
    async upload(input: WechatUploadInput) {
      const ci =
        await import('miniprogram-ci')

      const privateKeyPath =
        await resolvePrivateKey(
          options.privateKey,
        )

      const project = new ci.Project({
        appid: options.appid,
        projectPath: input.projectPath,
        privateKeyPath,
      })

      return ci.upload({
        project,
        robot: options.robot,
        version: input.version,
        desc: input.description,
        setting: input.upload?.setting,

        onProgressUpdate(progress) {
          input.onProgress?.(
            normalizeProgress(progress),
          )
        },
      })
    },

    async preview() {
      // 调用 miniprogram-ci.preview()
    },

    async doctor() {
      // 检查私钥和项目路径
      return []
    },
  }
}
```

微信包完成：

```text
Wechat 公共调用参数
        ↓
miniprogram-ci 参数
        ↓
官方 SDK
```

---

## 8. Standard 中的微信适配器

Standard 将 Core 数据转换为微信包需要的数据。

```ts
// packages/standard/src/platforms/wechat.ts

import type {
  PlatformDefinition,
} from '@mpc-plus/core'

import {
  createWechat,
  wechatConfigSchema,
  type WechatConfigInput,
  type WechatConfig,
} from '@mpc-plus/wechat'

export const wechatDefinition = {
  name: 'wechat',

  schema: wechatConfigSchema,

  create({
    config,
    projectRoot,
    emit,
  }) {
    const client = createWechat({
      appid: config.appid,
      privateKey: config.privateKey,
      robot: config.robot,
    })

    return {
      async upload({ release }) {
        return client.upload({
          projectPath: resolve(
            projectRoot,
            config.output,
          ),

          version: release.version,

          description:
            release.description,

          upload: config.upload,

          onProgress(progress) {
            emit({
              type: 'progress',
              message: progress.message,
              percentage: progress.percentage,
            })
          },
        })
      },

      async preview({ release }) {
        return client.preview({
          projectPath: resolve(
            projectRoot,
            config.output,
          ),

          description:
            release.description,

          preview: config.preview,
        })
      },

      async doctor() {
        return client.doctor()
      },
    }
  },
} satisfies PlatformDefinition<
  'wechat',
  WechatConfigInput,
  WechatConfig
>
```

这一层的数据转换为：

```text
Core 业务数据
    ↓
Standard WeChat Adapter
    ↓
Wechat 底层 API 数据
    ↓
miniprogram-ci 数据
```

---

## 9. Standard 注册平台

```ts
// packages/standard/src/platforms.ts

import {
  wechatDefinition,
} from './platforms/wechat.js'

import {
  douyinDefinition,
} from './platforms/douyin.js'

export const standardPlatforms = {
  wechat: wechatDefinition,
  douyin: douyinDefinition,
} as const
```

创建标准实例：

```ts
// packages/standard/src/create-standard-mpc.ts

import {
  createMpc,
} from '@mpc-plus/core'

import {
  standardPlatforms,
} from './platforms.js'

export function createStandardMpc(
  options = {},
) {
  return createMpc({
    ...options,
    platforms: standardPlatforms,
  })
}
```

这里是实际发生依赖注入的位置：

```ts
createMpc({
  platforms: {
    wechat: wechatDefinition,
    douyin: douyinDefinition,
  },
})
```

---

## 10. defineConfig 类型推导

`defineConfig()` 的配置类型应该从平台注册表推导。

```ts
type PlatformConfigInput<
  Definition,
> = Definition extends PlatformDefinition<
  string,
  infer ConfigInput,
  unknown
>
  ? ConfigInput
  : never

export type MpcConfigInput<
  Registry extends PlatformRegistry,
> = {
  project?: {
    root?: string
  }

  release?: {
    version?: 'package' | string
    description?: 'git' | string
  }

  platforms: {
    [Name in keyof Registry]?:
      PlatformConfigInput<Registry[Name]>
  }
}
```

Standard 根据默认平台生成 `defineConfig`：

```ts
// packages/standard/src/config.ts

type StandardConfigInput =
  MpcConfigInput<
    typeof standardPlatforms
  >

export function defineConfig<
  const Config extends StandardConfigInput,
>(
  config: Config,
): Config {
  return config
}
```

`defineConfig()` 运行时没有额外行为：

```ts
defineConfig(config) === config
```

它主要提供：

- 配置字段补全。
- 平台配置类型检查。
- 字面量类型保留。
- 微信、抖音配置关联。
- 未注册平台错误提示。

---

## 11. CLI 和 TUI

CLI 只处理命令参数：

```ts
const mpc = await createStandardMpc({
  cwd: args.cwd,
  configFile: args.config,
  onEvent: createCliReporter(args),
})

await mpc.upload({
  platforms: args.platforms,
  version: args.version,
  description: args.description,
})
```

TUI 只处理交互状态：

```ts
const mpc = await createStandardMpc({
  cwd: process.cwd(),

  onEvent(event) {
    dispatch({
      type: 'MPC_EVENT',
      event,
    })
  },
})

await mpc.upload({
  platforms: selectedPlatforms,
})
```

两者使用相同 Core，不会重复实现部署逻辑。

---

## 12. Shared 的使用原则

`shared` 只存放确实被多个包复用、且没有明确业务所有者的内容，例如：

```text
shared/
├── fs/
│   ├── path-exists.ts
│   └── temporary-file.ts
├── error/
│   └── serialize-error.ts
└── types/
    ├── awaitable.ts
    └── maybe-promise.ts
```

以下内容不建议放进 Shared：

```text
PlatformDefinition
MpcConfig
ReleaseConfig
PlatformRegistry
MpcEvent
```

这些属于 Core 业务，应由 Core 定义。

如果未来需要开放第三方平台插件，再考虑将 `PlatformDefinition` 从 Core 提取为独立的 `contracts` 包。

---

## 13. 最终执行流程

以 `mpc upload wechat` 为例：

```text
1. CLI 解析命令参数
2. CLI 调用 createStandardMpc()
3. Standard 将微信、抖音注入 Core
4. Core 查找并加载 mpc.config.ts
5. Core 解析 project.root
6. Core 从 package.json 解析 version
7. Core 从 Git 解析 description
8. Core 选择 wechatDefinition
9. WeChat schema 校验微信配置
10. Standard 创建 WeChatExecutor
11. Core 调用 executor.upload()
12. Standard 将 Core 数据转换为 WeChat API 参数
13. WeChat 调用 miniprogram-ci
14. WeChat 进度通过 Standard 转成 Core 事件
15. CLI 或 TUI 消费 Core 事件
16. Core 聚合并返回最终结果
```

核心设计可以概括为：

```text
Core 定义协议和调度流程
Platform 包提供独立底层能力
Standard 完成适配和依赖注入
CLI/TUI 只消费统一 Core API
```

这种架构既保留了默认使用方式的简单性，也为后续新增平台、自定义平台组合、单元测试和按需加载提供了扩展空间。