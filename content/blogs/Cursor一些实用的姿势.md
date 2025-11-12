## Chat
- 提供上下文信息越全面越好
- 需求描述使用肯定句或疑问句，不要有"但是\然而"等等这种转折或者递进关系的词，只是用一句话描述出需求即可，或者告诉cursor修改什么即可（有这种语气感觉就会造成一些错误）

## Plan Mode
计划模式会在写代码之前创建详细的实施计划。代理会研究您的代码库，提出澄清问题并生成一份可供您在构建之前编辑的可审核计划。

将一个完整的需求，进行不同功能的拆分，Cursor会以TODO的形式一步一步实现

作用：
- 让任务结构化，更容易理解和跟踪

将plan文件放在`.cursor/plans/`里，每个单独的 plan 都可以独立执行

## Rules
- 建议有一个项目结构的rule，可以让cursor更规范的创建文件，如：monorepo项目，你让创建新组件的时候，往往会将组件创建到公共包中，尽管目前只是想在当前repo中的components创建
- 关于 commit message 的rule，我使用cursor生成commit时，通常文件多点，commit message就会生成很多行，内容过多，使用rule限制下，当前项目遵守的commit规则

## @Symbols

### @Files
描述：引用整个文件作为上下文。支持文件路径预览和分块处理。
使用场景：需要引用特定文件内容时，如代码文件、文档等。

### @Folders
描述：引用整个文件夹作为上下文。
使用场景：需要提供大量文件作为上下文，例如项目目录。

### @Code
描述：引用特定代码片段作为上下文。
使用场景：需要针对特定代码片段进行查询或操作。

### @Docs
描述：引用预设的第三方文档或自定义文档。支持添加自定义文档。
使用场景：需要引用外部文档或自定义知识库。

### @Branch
描述：查看分支上的更改。
使用场景：获取分支上下文信息。

### @Commit
描述：查看特定提交。
使用场景：分析 commit 的代码差异。

## Commands
自定义命令允许您创建可重复使用的工作流程，只需在聊天输入框中添加简单的 / 前缀即可触发。命令有助于提高常见任务的效率。

项目命令定义在 `.cursor/commands`中，在Chat中使用 / 会检测所有命令

目前内置了一个`Agent Review`的命令，我认为很好用，可以提前让 Agent Review，review后，如果需要修改可以一键 Fix

## Hooks
允许您使用自定义脚本来观察、控制和扩展代理循环。在代理循环的特定阶段之前或之后运行，可以观察、阻止或修改代理的行为。

使用场景：
- 编辑后运行格式化程序
- 添加活动分析
- 扫描个人身份信息或机密信息。
- 阻止高风险操作（例如，SQL 写入）

```
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [{ "command": "./demo.sh" }],
    "afterShellExecution": [{ "command": "./demo.sh" }],
    "afterMCPExecution": [{ "command": "./demo.sh" }],
    "afterFileEdit": [{ "command": "./demo.sh" }]
  }
}
```

创建一个 `hooks.json` 在 `.cursor` 中

```
.cursor/
├── hooks.json
└── hooks/
    └── demo.sh
```

## Ignore Files
类似于 .gitignore，Cursor会读取并索引项目的代码库，以增强功能。在项目根目录使用 `.cursorignore` 控制文件的访问权限，内容设置方式与 .gitignore 一致

作用：
- 可以限制对 API 密钥、凭证和密钥的访问。
- 在代码库或单体仓库中，排除不相关的部分，可以加快索引速度并更准确地发现文件。

## MCP
让Cursor可以连接外部工具或数据源

```
// mcp.json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```
