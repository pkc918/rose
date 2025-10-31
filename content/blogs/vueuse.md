---
theme: z-blue
highlight: agate
title: 学习VueUse
date: 2025-10-23
---
### 前言

本文章在于理解熟练State菜单下的所有相关`hooks`，之所以写这篇文章，只是想要更多的`pr`，输出即是最好的学习。

### State

在State下目前共有`15`个`hooks`提供使用：
- [`createGlobalState`](https://vueuse.org/shared/createGlobalState/)-keep states in the global scope to be reusable across Vue instances

- [`createInjectionState`](https://vueuse.org/shared/createInjectionState/)-create global state that can be injected into components

- [`createSharedComposable`](https://vueuse.org/shared/createSharedComposable/)-make a composable function usable with multiple Vue instances

- [`injectLocal`](https://vueuse.org/shared/injectLocal/)-extended `inject` with ability to call `provideLocal` to provide the value in the same component

- [`provideLocal`](https://vueuse.org/shared/provideLocal/)-extended `provide` with ability to call `injectLocal` to obtain the value in the same component

- [`useAsyncState`](https://vueuse.org/core/useAsyncState/)-reactive async state

- [`useDebouncedRefHistory`](https://vueuse.org/core/useDebouncedRefHistory/)-shorthand for `useRefHistory` with debounced filter

- [`useLastChanged`](https://vueuse.org/shared/useLastChanged/)-records the timestamp of the last change

- [`useLocalStorage`](https://vueuse.org/core/useLocalStorage/)-reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

- [`useManualRefHistory`](https://vueuse.org/core/useManualRefHistory/)-manually track the change history of a ref when the using calls `commit()`

- [`useRefHistory`](https://vueuse.org/core/useRefHistory/)-track the change history of a ref

- [`useSessionStorage`](https://vueuse.org/core/useSessionStorage/)-reactive [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

- [`useStorage`](https://vueuse.org/core/useStorage/)-create a reactive ref that can be used to access & modify [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) or [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

- [`useStorageAsync`](https://vueuse.org/core/useStorageAsync/)-reactive Storage in with async support

- [`useThrottledRefHistory`](https://vueuse.org/core/useThrottledRefHistory/)-shorthand for `useRefHistory` with throttled filter
### 1. createGlobalState

保持全局范围的数据状态，使其可以在任意vue实例中使用

想知道他如何使用，以及使用他有什么样的功能，最好的方式就是查看`单元测试`
```ts
import { describe, expect, it } from 'vitest'
import { computed, ref } from 'vue-demi'
import { createGlobalState } from '.'
import { useSetup } from '../../.test'

describe('createGlobalState', () => {
  it('should work after dispose 1', async () => {
    const useGlobalState = createGlobalState(() => {
      const counter = ref(1)
      const doubled = computed(() => counter.value * 2)

      return {
        counter,
        doubled,
      }
    })
    const { counter, doubled } = useGlobalState()

    const vm = useSetup(() => {
      const { counter, doubled } = useGlobalState()

      expect(counter.value).toBe(1)
      expect(doubled.value).toBe(2)

      return {
        counter,
        doubled,
      }
    })
    counter.value = 2

    expect(counter.value).toBe(2)
    expect(doubled.value).toBe(4)

    vm.unmount()

    counter.value = 3
    expect(counter.value).toBe(3)
    expect(doubled.value).toBe(6)
  })
})
```
看完这个单侧，大致可以得到的信息：
- 使用 `createGlobalState` 函数会返回一个函数`useGlobalState`
- 执行`useGlobalState`函数，会返回`createGlobalState`函数的参数的返回值
- `createGLobalState`的参数函数里的返回值是全局的

接下来，看看它的实现
```ts
import type { AnyFn } from '../utils'
import { effectScope } from 'vue-demi'

/**
 * Keep states in the global scope to be reusable across Vue instances. * * @see https://vueuse.org/createGlobalState
 * @param stateFactory A factory function to create the state
 */
export function createGlobalState<Fn extends AnyFn>(
  stateFactory: Fn,
): Fn {
  let initialized = false
  let state: any
  const scope = effectScope(true)

  return ((...args: any[]) => {
    if (!initialized) {
      state = scope.run(() => stateFactory(...args))!
      initialized = true
    }
    return state
  }) as Fn
}
```

- createGlobalState 接受一个函数作为参数
- 内部创建一个 scope，也就是创建了单独的作用域
- 里面 return 一个函数，就是 useGlobalState 函数，当它执行后，会判断是否是初始化，如果是初始化，那就直接返回独立作用域中已有的 state，如果不是，那就执行 run 创建，也就是执行 createGlobalState 的参数函数
### 2.createInjectionState

创建一个可以注入到组件的全局状态

要想看如何使用，还是要看单测，该文件单测过长，只挑一部分看，感兴趣的可以去这里查看完整的: [createInjectionState](https://github.com/vueuse/vueuse/blob/main/packages/shared/createInjectionState/index.test.ts)

```ts
it('should work for simple nested component', async () => {
  const [useProvideCountState, useCountState] = createInjectionState((initialValue: number) => {
    const count = ref(initialValue)
    return count
  })

  let count: Ref<number> | undefined

  const ChildComponent = defineComponent({
    setup() {
      count = useCountState()

      return () => h('div')
    },
  })
  const RootComponent = defineComponent({
    setup() {
      useProvideCountState(114514)

      return () => h(ChildComponent)
    },
  })
  const vm = mount(RootComponent)
  await nextTick()

  expect(count?.value).toBe(114514)
  vm.unmount()
})
```

- createInjectionState 参数是一个函数，函数的返回值就是提供给后代组建使用的值
- createInjectionState 返回一个数组，数组有两个 hooks，分别是 useProvideCountState 和 useCountState
- useProvideCountState 中的参数，就是 initialValue 的初始值
- useCountState 的返回值就是 return count
- useProvideCountState 在父级组件中使用，提供数据，在后代组件中使用 useCountState 注入提供的数据使用

当然要想知道它的细节实现，还得看源码(防止看的头晕，删除了类型)

```ts
import type { InjectionKey } from 'vue-demi'
import { injectLocal } from '../injectLocal'
import { provideLocal } from '../provideLocal'

export interface CreateInjectionStateOptions<Return> {
  /**
   * Custom injectionKey for InjectionState
   */
  injectionKey?: string | InjectionKey<Return>
  /*
   * Default value for the InjectionState
   */
  defaultValue?: Return
}

/**
 * Create global state that can be injected into components. * * @see https://vueuse.org/createInjectionState
 *
 */
export function createInjectionState(
  composable,
  options,
) {
  const key = options?.injectionKey || Symbol(composable.name || 'InjectionState')
  const defaultValue = options?.defaultValue
  const useProvidingState = (...args: Arguments) => {
    const state = composable(...args)
    provideLocal(key, state)
    return state
  }
  const useInjectedState = () => injectLocal(key, defaultValue)
  return [useProvidingState, useInjectedState]
}
```
- 可以看到，createInjectionState 是可以接收两个参数，一个函数，一个options，当 options 拥有 defaultValue 值的时候，它会注入一个数据在当前组件，并赋有默认值 defaultValue
- 内部可以看到 useProvidingState 函数的接收值就是传值给了 createInjectionState 接收的第一个参数函数的参数了，也就是前面提到的 initialValue
- 这里重要的代码其实就是 provideLocal 和 injectLocal 两个函数，大致就是 provide 和 inject 效果，详细代码可以查看：[injectLocal](https://github.com/vueuse/vueuse/blob/main/packages/shared/injectLocal/index.ts) [provideLocal](https://github.com/vueuse/vueuse/blob/main/packages/shared/provideLocal/index.ts)
### 3. createSharedComposable

创建一个可在多个 Vue 实例中使用的可组合函数。

没有单测，看源码吧

```ts
import type { EffectScope } from 'vue-demi'
import type { AnyFn } from '../utils'
import { effectScope } from 'vue-demi'
import { tryOnScopeDispose } from '../tryOnScopeDispose'

/**
 * Make a composable function usable with multiple Vue instances. * * @see https://vueuse.org/createSharedComposable
 */
export function createSharedComposable<Fn extends AnyFn>(composable: Fn): Fn {
  let subscribers = 0
  let state: ReturnType<Fn> | undefined
  let scope: EffectScope | undefined

  const dispose = () => {
    subscribers -= 1
    if (scope && subscribers <= 0) {
      scope.stop()
      state = undefined
      scope = undefined
    }
  }
  return <Fn>((...args) => {
    subscribers += 1
    if (!state) {
      scope = effectScope(true)
      state = scope.run(() => composable(...args))
    }
    tryOnScopeDispose(dispose)
    return state
  })
}
```
- tryOnScopeDispose 当你组件不在需要时，执行清理所有副作用
- createSharedComposable 接收一个函数，并且返回一个函数，且使用必报方式，让初始化只有一次，后续调用函数，都是共用一个 state

文档的基础使用方式：
```ts
import { createSharedComposable, useMouse } from '@vueuse/core'

const useSharedMouse = createSharedComposable(useMouse)
// CompA.vue
const { x, y } = useSharedMouse()
// CompB.vue - 将重用先前的状态，不会注册新的事件监听器
const { x, y } = useSharedMouse()
```
x，y是 useMouse 返回的值。

### 4.injectLocal & provideLocal

扩展了 inject，能够调用 provideLocal 在同一组件中提供值
扩展了 provide，能够使其通过调用 injectLocal 在同一组件中获取值

单测：
```ts
it('should work for nested component', async () => {
  const CountKey: InjectionKey<number> | string = Symbol('count')
  let count: number | undefined
  const ChildComponent = defineComponent({
    setup() {
      count = injectLocal(CountKey)

      return () => h('div')
    },
  })
  const RootComponent = defineComponent({
    setup() {
      provideLocal(CountKey, 2333)

      return () => h(ChildComponent)
    },
  })
  const vm = mount(RootComponent)
  await nextTick()

  expect(count).toBe(2333)
  vm.unmount()
})
```

- 只是扩展了 provide 和 inject 的功能，但是使用方式上还是相同的
查看源码

```ts
// injectLocal

import { getCurrentInstance, inject } from 'vue-demi'
import { localProvidedStateMap } from '../provideLocal/map'

/**
 * On the basis of `inject`, it is allowed to directly call inject to obtain the value after call provide in the same component. *
 * @example
 * ```ts
 * injectLocal('MyInjectionKey', 1) * const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
 * ```
 */
// @ts-expect-error overloads are not compatible
export const injectLocal: typeof inject = (...args) => {
  const key = args[0] as string | symbol
  const instance = getCurrentInstance()?.proxy
  if (instance == null)
    throw new Error('injectLocal must be called in setup')

  if (localProvidedStateMap.has(instance) && key in localProvidedStateMap.get(instance)!)
    return localProvidedStateMap.get(instance)![key]

  // @ts-expect-error overloads are not compatible
  return inject(...args)
}
```

- vueuse 自己维护了一个StateMap，当传入一个key值的时候，且key值是在当前组件实例中的属性时，直接返回内部维护的值，如果不是通过 vueuse 设置的值，不在 StateMap 中，那就返回 inject 内的值

```ts
import { getCurrentInstance, provide } from 'vue-demi'
import { localProvidedStateMap } from './map'

/**
 * On the basis of `provide`, it is allowed to directly call inject to obtain the value after call provide in the same component. * * @example
 * ```ts
 * provideLocal('MyInjectionKey', 1)
 * const injectedValue = injectLocal('MyInjectionKey')
 * // injectedValue === 1 * ```
 */
export const provideLocal: typeof provide = (key, value) => {
  const instance = getCurrentInstance()?.proxy
  if (instance == null)
    throw new Error('provideLocal must be called in setup')

  if (!localProvidedStateMap.has(instance))
    localProvidedStateMap.set(instance, Object.create(null))

  const localProvidedState = localProvidedStateMap.get(instance)!
  // @ts-expect-error allow InjectionKey as key
  localProvidedState[key] = value
  provide(key, value)
}
```

- 在内部维护了一个StateMap，当使用这个api进行provide的时候，先存一份在 StateMap 中，再继续使用 provide 存储在组件实例上
### 5.useAsyncState

响应式同步状态

单元测试（一部分）
```ts
import { promiseTimeout } from '@vueuse/shared'
import { describe, expect, it, vi } from 'vitest'
import { useAsyncState } from '.'

describe('useAsyncState', () => {
  it('should be defined', () => {
    expect(useAsyncState).toBeDefined()
  })

  const p1 = (num = 1) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(num)
      }, 50)
    })
  }

  const p2 = async (id?: string) => {
    if (!id)
      throw new Error('error')
    return id
  }

  it('should work', async () => {
    const { execute, state } = useAsyncState(p1, 0)
    expect(state.value).toBe(0)
    await execute(0, 2)
    expect(state.value).toBe(2)
  })

  it('should work with onError', async () => {
    const onError = vi.fn()
    const { execute } = useAsyncState(p2, '0', { onError, immediate: false })
    await execute()
    expect(onError).toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(new Error('error'))
  })
})
```

- useAsyncState拥有两个参数，第一个参数可以是一个返回Promise的函数，第二个参数是一个值，这个值真是第一个参数函数中的参数的初始值
- useAsyncState返回值是一个对象，对象里面有execute函数和state，state的初始值，就是useAsyncState的第二个值，通过execute异步修改state值，state的值也更新了

详细实现还需要看源码实现（删除了类型实现，代码太多）：
```ts
import type { Ref, UnwrapRef } from 'vue-demi'
import { noop, promiseTimeout, until } from '@vueuse/shared'
import { ref, shallowRef } from 'vue-demi'

export function useAsyncState<Data, Params extends any[] = [], Shallow extends boolean = true>(
  promise: Promise<Data> | ((...args: Params) => Promise<Data>),
  initialState: Data,
  options?: UseAsyncStateOptions<Shallow, Data>,
): UseAsyncStateReturn<Data, Params, Shallow> {
  const {
    immediate = true,
    delay = 0,
    onError = noop,
    onSuccess = noop,
    resetOnExecute = true,
    shallow = true,
    throwError,
  } = options ?? {}
  const state = shallow ? shallowRef(initialState) : ref(initialState)
  const isReady = ref(false)
  const isLoading = ref(false)
  const error = shallowRef<unknown | undefined>(undefined)

  async function execute(delay = 0, ...args: any[]) {
    if (resetOnExecute)
      state.value = initialState
    error.value = undefined
    isReady.value = false
    isLoading.value = true

    if (delay > 0)
      await promiseTimeout(delay)

    const _promise = typeof promise === 'function'
      ? promise(...args as Params)
      : promise

    try {
      const data = await _promise
      state.value = data
      isReady.value = true
      onSuccess(data)
    }
    catch (e) {
      error.value = e
      onError(e)
      if (throwError)
        throw e
    }
    finally {
      isLoading.value = false
    }

    return state.value as Data
  }

  if (immediate)
    execute(delay)

  const shell: UseAsyncStateReturnBase<Data, Params, Shallow> = {
    state: state as Shallow extends true ? Ref<Data> : Ref<UnwrapRef<Data>>,
    isReady,
    isLoading,
    error,
    execute,
  }
  function waitUntilIsLoaded() {
    return new Promise<UseAsyncStateReturnBase<Data, Params, Shallow>>((resolve, reject) => {
      until(isLoading).toBe(false).then(() => resolve(shell)).catch(reject)
    })
  }
  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilIsLoaded()
        .then(onFulfilled, onRejected)
    },
  }
}
```

- useAsyncState 接收3个参数，分别是promise，initialState，options
- options中可以设置shallow，用于设置state是使用shallowRef或者ref
- useAsyncState返回了state, isReady, isLoading, error, execute和then函数，且then函数成功后，拿到的数据 resolve({state, isReady, isLoading, error, execute})
- execute函数接收的第一个参数是delay，当它大于0的时候进行await等待promise返回，最后将用户传入的promise的返回值复制给state，onSuccess是通过options传递进来的函数，promise成功后，会调用onSuccess，将返回值通过 onSuccess返回一份
### 6.useDebouncedRefHistory

具有防抖过滤器的`useRefHistory`的简写

单测
```ts
import { promiseTimeout } from '@vueuse/shared'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue-demi'
import { useDebouncedRefHistory } from '.'

describe('useDebouncedRefHistory', () => {
  it('once the ref\'s value has changed and some time has passed, ensure the snapshot is updated', async () => {
    const v = ref(0)

    const { history } = useDebouncedRefHistory(v, { debounce: 10 })
    v.value = 100
    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    await promiseTimeout(20)

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(100)
  })
  it('when debounce is undefined', async () => {
    const v = ref(0)

    const { history } = useDebouncedRefHistory(v, { deep: false })

    v.value = 100

    await nextTick()

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(100)
  })
})
```

- useDebounceRefHistory 接收两个参数，一个是源头值，一个是配置options
- debounce设置毫秒，当下一次操作与上一次操作的时间超过debounce时，才记录历史
详细实现
```ts
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import type { UseRefHistoryOptions, UseRefHistoryReturn } from '../useRefHistory'
import { debounceFilter } from '@vueuse/shared'
import { useRefHistory } from '../useRefHistory'

/**
 * Shorthand for [useRefHistory](https://vueuse.org/useRefHistory) with debounce filter.
 * @see https://vueuse.org/useDebouncedRefHistory
 * @param source
 * @param options
 */
export function useDebouncedRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: Omit<UseRefHistoryOptions<Raw, Serialized>, 'eventFilter'> & { debounce?: MaybeRefOrGetter<number> } = {},
): UseRefHistoryReturn<Raw, Serialized> {
  const filter = options.debounce ? debounceFilter(options.debounce) : undefined
  const history = useRefHistory(source, { ...options, eventFilter: filter })

  return {
    ...history,
  }
}
```

- debounceFilter 大致就是判断是否创建了定时器，如果创建了定时器，直接清除，重新创建，如果没有创建，那就创建一个定时器，当到达时间后会执行一个 resolve
- useRefHistory 跟踪 ref 的变化历史，还提供了撤销和重做功能。
### 7.useLastChanged

记录最后一次改变的时间戳

改 hooks 没有单测，直接看实现
```ts
import type { Ref, WatchOptions, WatchSource } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import { timestamp } from '../utils'

export interface UseLastChangedOptions<
  Immediate extends boolean,
  InitialValue extends number | null | undefined = undefined,
> extends WatchOptions<Immediate> {
  initialValue?: InitialValue
}

/**
 * Records the timestamp of the last change * * @see https://vueuse.org/useLastChanged
 */
export function useLastChanged(source: WatchSource, options?: UseLastChangedOptions<false>): Ref<number | null>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<true> | UseLastChangedOptions<boolean, number>): Ref<number>
export function useLastChanged(source: WatchSource, options: UseLastChangedOptions<boolean, any> = {}): Ref<number | null> | Ref<number> {
  const ms = ref<number | null>(options.initialValue ?? null)

  watch(
    source,
    () => ms.value = timestamp(),
    options,
  )
  return ms
}
```

- 封装了一层 watch，options提供一个initialValue作为内部 ms 时间戳的初始值
- 监听用户传的 source 数据，当source数据改变时，出发监听，同时修改 ms 的值为当前时间戳，最后返回了这个 ms ref对象

### 8.useLocalStorage & useSessionStorage

响应式LocalStorage & 响应式SessionStorage

该 hooks 没有单测，直接查看源码
```ts
import type { MaybeRefOrGetter, RemovableRef } from '@vueuse/shared'
import type { UseStorageOptions } from '../useStorage'
import { defaultWindow } from '../_configurable'
import { useStorage } from '../useStorage'

export function useLocalStorage(key: string, initialValue: MaybeRefOrGetter<string>, options?: UseStorageOptions<string>): RemovableRef<string>
export function useLocalStorage(key: string, initialValue: MaybeRefOrGetter<boolean>, options?: UseStorageOptions<boolean>): RemovableRef<boolean>
export function useLocalStorage(key: string, initialValue: MaybeRefOrGetter<number>, options?: UseStorageOptions<number>): RemovableRef<number>
export function useLocalStorage<T>(key: string, initialValue: MaybeRefOrGetter<T>, options?: UseStorageOptions<T>): RemovableRef<T>
export function useLocalStorage<T = unknown>(key: string, initialValue: MaybeRefOrGetter<null>, options?: UseStorageOptions<T>): RemovableRef<T>

/**
 * Reactive LocalStorage. * * @see https://vueuse.org/useLocalStorage
 * @param key
 * @param initialValue
 * @param options
 */
export function useLocalStorage<T extends(string | number | boolean | object | null)>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {},
): RemovableRef<any> {
  const { window = defaultWindow } = options
  return useStorage(key, initialValue, window?.localStorage, options)
}
```
- 先不用管 useStorage 具体实现，大致能猜出，使用 key value存储，但是响应式的，useStorage 内部做了处理，useLocalStorage 就是在其记录上，限定了使用 localStorage

### 9.useManualRefHistory

手动跟踪 ref 的变化历史，当使用者调用 `commit()` 时，也提供了撤销和重做功能。

单元测试
```ts
import { describe, expect, it } from 'vitest'
import { isReactive, ref } from 'vue-demi'
import { useManualRefHistory } from '.'

describe('useManualRefHistory', () => {
  it('should record', () => {
    const v = ref(0)
    const { history, commit } = useManualRefHistory(v)

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    v.value = 2
    commit()

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(2)
    expect(history.value[1].snapshot).toBe(0)
  })
  it('should be able to undo and redo', () => {
    const v = ref(0)
    const { commit, undo, redo, clear, canUndo, canRedo, history, last } = useManualRefHistory(v)

    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)

    v.value = 2
    commit()
    v.value = 3
    commit()
    v.value = 4
    commit()

    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(false)

    expect(v.value).toBe(4)
    expect(history.value.length).toBe(4)
    expect(last.value.snapshot).toBe(4)
    undo()

    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(true)

    expect(v.value).toBe(3)
    expect(last.value.snapshot).toBe(3)
    undo()
    expect(v.value).toBe(2)
    expect(last.value.snapshot).toBe(2)
    redo()
    expect(v.value).toBe(3)
    expect(last.value.snapshot).toBe(3)
    redo()
    expect(v.value).toBe(4)
    expect(last.value.snapshot).toBe(4)

    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(false)

    redo()
    expect(v.value).toBe(4)
    expect(last.value.snapshot).toBe(4)

    clear()
    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)
  })
})
```
- useManualRefHistory 返回了 n 多个函数和ref对象
- 目测好像所有的操作都是交给了用户，所有的函数，都是暴露给用户的操作

查看源码
```ts
import type { Ref } from 'vue-demi'
import type { CloneFn } from '../useCloned'
import { timestamp } from '@vueuse/shared'
import { computed, markRaw, ref } from 'vue-demi'
import { cloneFnJSON } from '../useCloned'

export interface UseRefHistoryRecord<T> {
  snapshot: T
  timestamp: number
}

export interface UseManualRefHistoryOptions<Raw, Serialized = Raw> {
  /**
   * Maximum number of history to be kept. Default to unlimited.
   */ capacity?: number
  /**
   * Clone when taking a snapshot, shortcut for dump: JSON.parse(JSON.stringify(value)).   * Default to false   *   * @default false
   */ clone?: boolean | CloneFn<Raw>
  /**
   * Serialize data into the history
   */ dump?: (v: Raw) => Serialized
  /**
   * Deserialize data from the history
   */ parse?: (v: Serialized) => Raw

  /**
   * set data source
   */ setSource?: (source: Ref<Raw>, v: Raw) => void
}

export interface UseManualRefHistoryReturn<Raw, Serialized> {
  /**
   * Bypassed tracking ref from the argument
   */
  source: Ref<Raw>

  /**
   * An array of history records for undo, newest comes to first
   */

  history: Ref<UseRefHistoryRecord<Serialized>[]>

  /**
   * Last history point, source can be different if paused
   */
  last: Ref<UseRefHistoryRecord<Serialized>>

  /**
   * Same as {@link UseManualRefHistoryReturn.history | history}
   */
  undoStack: Ref<UseRefHistoryRecord<Serialized>[]>

  /**
   * Records array for redo
   */
  redoStack: Ref<UseRefHistoryRecord<Serialized>[]>

  /**
   * A ref representing if undo is possible (non empty undoStack)
   */
  canUndo: Ref<boolean>

  /**
   * A ref representing if redo is possible (non empty redoStack)
   */
  canRedo: Ref<boolean>

  /**
   * Undo changes
   */
  undo: () => void

  /**
   * Redo changes
   */
  redo: () => void

  /**
   * Clear all the history
   */
  clear: () => void

  /**
   * Create a new history record
   */
  commit: () => void

  /**
   * Reset ref's value with latest history
   */
  reset: () => void
}

function fnBypass<F, T>(v: F) {
  return v as unknown as T
}
function fnSetSource<F>(source: Ref<F>, value: F) {
  return source.value = value
}

type FnCloneOrBypass<F, T> = (v: F) => T

function defaultDump<R, S>(clone?: boolean | CloneFn<R>) {
  return (clone
    ? typeof clone === 'function'
      ? clone
      : cloneFnJSON
    : fnBypass
  ) as unknown as FnCloneOrBypass<R, S>
}

function defaultParse<R, S>(clone?: boolean | CloneFn<R>) {
  return (clone
    ? typeof clone === 'function'
      ? clone
      : cloneFnJSON
    : fnBypass
  ) as unknown as FnCloneOrBypass<S, R>
}

/**
 * Track the change history of a ref, also provides undo and redo functionality. * * @see https://vueuse.org/useManualRefHistory
 * @param source
 * @param options
 */
export function useManualRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: UseManualRefHistoryOptions<Raw, Serialized> = {},
): UseManualRefHistoryReturn<Raw, Serialized> {
  const {
    clone = false,
    dump = defaultDump<Raw, Serialized>(clone),
    parse = defaultParse<Raw, Serialized>(clone),
    setSource = fnSetSource,
  } = options

  function _createHistoryRecord(): UseRefHistoryRecord<Serialized> {
    return markRaw({
      snapshot: dump(source.value),
      timestamp: timestamp(),
    })
  }
  const last: Ref<UseRefHistoryRecord<Serialized>> = ref(_createHistoryRecord()) as Ref<UseRefHistoryRecord<Serialized>>

  const undoStack: Ref<UseRefHistoryRecord<Serialized>[]> = ref([])
  const redoStack: Ref<UseRefHistoryRecord<Serialized>[]> = ref([])

  const _setSource = (record: UseRefHistoryRecord<Serialized>) => {
    setSource(source, parse(record.snapshot))
    last.value = record
  }

  const commit = () => {
    undoStack.value.unshift(last.value)
    last.value = _createHistoryRecord()

    if (options.capacity && undoStack.value.length > options.capacity)
      undoStack.value.splice(options.capacity, Number.POSITIVE_INFINITY)
    if (redoStack.value.length)
      redoStack.value.splice(0, redoStack.value.length)
  }
  const clear = () => {
    undoStack.value.splice(0, undoStack.value.length)
    redoStack.value.splice(0, redoStack.value.length)
  }
  const undo = () => {
    const state = undoStack.value.shift()

    if (state) {
      redoStack.value.unshift(last.value)
      _setSource(state)
    }
  }
  const redo = () => {
    const state = redoStack.value.shift()

    if (state) {
      undoStack.value.unshift(last.value)
      _setSource(state)
    }
  }
  const reset = () => {
    _setSource(last.value)
  }
  const history = computed(() => [last.value, ...undoStack.value])

  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)

  return {
    source,
    undoStack,
    redoStack,
    last,
    history,
    canUndo,
    canRedo,

    clear,
    commit,
    reset,
    undo,
    redo,
  }
}
```
- 从源码可以看到，内部似乎并没有做过多的操作，把所有的操作权都给了用户
- 作用不一一细说了

### 10.useRefHistory

跟踪 ref 的变化历史，还提供了撤销和重做功能。

单元测试
```ts
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue-demi'
import { useRefHistory } from '.'

describe('useRefHistory - sync', () => {
  it('sync: should record', () => {
    const v = ref(0)
    const { history } = useRefHistory(v, { flush: 'sync' })

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    v.value = 2

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(2)
    expect(history.value[1].snapshot).toBe(0)
  })
  it('sync: should be able to undo and redo', () => {
    const v = ref(0)
    const { undo, redo, clear, canUndo, canRedo, history, last } = useRefHistory(v, { flush: 'sync' })

    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)

    v.value = 2
    v.value = 3
    v.value = 4

    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(false)

    expect(v.value).toBe(4)
    expect(history.value.length).toBe(4)
    expect(last.value.snapshot).toBe(4)
    undo()

    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(true)

    expect(v.value).toBe(3)
    expect(last.value.snapshot).toBe(3)
    undo()
    expect(v.value).toBe(2)
    expect(last.value.snapshot).toBe(2)
    redo()
    expect(v.value).toBe(3)
    expect(last.value.snapshot).toBe(3)
    redo()
    expect(v.value).toBe(4)
    expect(last.value.snapshot).toBe(4)

    expect(canUndo.value).toBe(true)
    expect(canRedo.value).toBe(false)

    redo()
    expect(v.value).toBe(4)
    expect(last.value.snapshot).toBe(4)

    clear()
    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)
  })
})
```

- 所有操作权几乎提供给了用户，直接看实现吧

源码

```ts
import type { ConfigurableEventFilter, Fn } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import type { CloneFn } from '../useCloned'
import type { UseManualRefHistoryReturn } from '../useManualRefHistory'
import { pausableFilter, watchIgnorable } from '@vueuse/shared'
import { useManualRefHistory } from '../useManualRefHistory'

export interface UseRefHistoryOptions<Raw, Serialized = Raw> extends ConfigurableEventFilter {
  /**
   * Watch for deep changes, default to false   *   * When set to true, it will also create clones for values store in the history   *   * @default false
   */ deep?: boolean

  /**
   * The flush option allows for greater control over the timing of a history point, default to 'pre'   *   * Possible values: 'pre', 'post', 'sync'   * It works in the same way as the flush option in watch and watch effect in vue reactivity   *   * @default 'pre'
   */ flush?: 'pre' | 'post' | 'sync'

  /**
   * Maximum number of history to be kept. Default to unlimited.
   */ capacity?: number

  /**
   * Clone when taking a snapshot, shortcut for dump: JSON.parse(JSON.stringify(value)).   * Default to false   *   * @default false
   */ clone?: boolean | CloneFn<Raw>
  /**
   * Serialize data into the history
   */ dump?: (v: Raw) => Serialized
  /**
   * Deserialize data from the history
   */ parse?: (v: Serialized) => Raw
}

export interface UseRefHistoryReturn<Raw, Serialized> extends UseManualRefHistoryReturn<Raw, Serialized> {
  /**
   * A ref representing if the tracking is enabled
   */ isTracking: Ref<boolean>

  /**
   * Pause change tracking
   */ pause: () => void

  /**
   * Resume change tracking   *   * @param [commit] if true, a history record will be create after resuming
   */ resume: (commit?: boolean) => void

  /**
   * A sugar for auto pause and auto resuming within a function scope   *   * @param fn
   */
  batch: (fn: (cancel: Fn) => void) => void

  /**
   * Clear the data and stop the watch
   */ dispose: () => void
}

/**
 * Track the change history of a ref, also provides undo and redo functionality. * * @see https://vueuse.org/useRefHistory
 * @param source
 * @param options
 */
export function useRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: UseRefHistoryOptions<Raw, Serialized> = {},
): UseRefHistoryReturn<Raw, Serialized> {
  const {
    deep = false,
    flush = 'pre',
    eventFilter,
  } = options

  const {
    eventFilter: composedFilter,
    pause,
    resume: resumeTracking,
    isActive: isTracking,
  } = pausableFilter(eventFilter)

  const {
    ignoreUpdates,
    ignorePrevAsyncUpdates,
    stop,
  } = watchIgnorable(
    source,
    commit,
    { deep, flush, eventFilter: composedFilter },
  )
  function setSource(source: Ref<Raw>, value: Raw) {
    // Support changes that are done after the last history operation
    // examples:    //   undo, modify    //   undo, undo, modify    // If there were already changes in the state, they will be ignored    // examples:    //   modify, undo    //   undo, modify, undo    ignorePrevAsyncUpdates()

    ignoreUpdates(() => {
      source.value = value
    })
  }
  const manualHistory = useManualRefHistory(source, { ...options, clone: options.clone || deep, setSource })

  const { clear, commit: manualCommit } = manualHistory

  function commit() {
    // This guard only applies for flush 'pre' and 'post'
    // If the user triggers a commit manually, then reset the watcher    // so we do not trigger an extra commit in the async watcher    ignorePrevAsyncUpdates()

    manualCommit()
  }
  function resume(commitNow?: boolean) {
    resumeTracking()
    if (commitNow)
      commit()
  }
  function batch(fn: (cancel: Fn) => void) {
    let canceled = false

    const cancel = () => canceled = true

    ignoreUpdates(() => {
      fn(cancel)
    })
    if (!canceled)
      commit()
  }
  function dispose() {
    stop()
    clear()
  } return {
    ...manualHistory,
    isTracking,
    pause,
    resume,
    commit,
    batch,
    dispose,
  }
}
```

- 没啥好说的，看源码吧，更直观

### 11.useStorage

创建一个响应式引用，用于访问和修改 [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 或 [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)。

默认情况下使用 localStorage，其他存储源可以通过第三个参数指定。

单元测试（部分代码，剩下就是对不同数据类型存储处理）
```ts
import { debounceFilter, promiseTimeout } from '@vueuse/shared'
import { defineComponent, isVue3, nextTick, ref, toRaw } from 'vue-demi'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, nextTwoTick, useSetup } from '../../.test'
import { StorageSerializers, customStorageEventName, useStorage } from '.'

const KEY = 'custom-key'

vi.mock('../ssr-handlers', () => ({
  getSSRHandler: vi.fn().mockImplementationOnce((_, cb) => () => cb()).mockImplementationOnce(() => () => {
    throw new Error('getDefaultStorage error')
  }),}))

describe('useStorage', () => {
  console.error = vi.fn()
  const storageState = new Map<string, string | number | undefined>()
  const storageMock = {
    getItem: vi.fn(x => storageState.get(x)),
    setItem: vi.fn((x, v) => storageState.set(x, v)),
    removeItem: vi.fn(x => storageState.delete(x)),
    clear: vi.fn(() => storageState.clear()),
  }  const storage = storageMock as any as Storage

  beforeEach(() => {
    localStorage.clear()
    storageState.clear()
    storageMock.setItem.mockClear()
    storageMock.getItem.mockClear()
    storageMock.removeItem.mockClear()
  })
  it('export module', () => {
    expect(useStorage).toBeDefined()
    expect(StorageSerializers).toBeDefined()
  })
  it('string', async () => {
    const vm = useSetup(() => {
      const ref = useStorage(KEY, 'a', storage)

      return {
        ref,
      }    })
    expect(vm.ref).toBe('a')
    expect(storage.setItem).toBeCalledWith(KEY, 'a')

    vm.ref = 'b'
    await nextTwoTick()

    expect(vm.ref).toBe('b')
    expect(storage.setItem).toBeCalledWith(KEY, 'b')
  })
})
```

- 大概就是，key value和选择存储方式，核心点在于他实现响应式，大概就是监听修改，然后更新 storage，不知道是不是，看看源码吧
源码

```ts
import { nextTick, ref, shallowRef } from 'vue-demi'
import type { Awaitable, ConfigurableEventFilter, ConfigurableFlush, MaybeRefOrGetter, RemovableRef } from '@vueuse/shared'
import { pausableWatch, toValue, tryOnMounted } from '@vueuse/shared'
import type { StorageLike } from '../ssr-handlers'
import { getSSRHandler } from '../ssr-handlers'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import { guessSerializerType } from './guess'

export interface Serializer<T> {
  read: (raw: string) => T
  write: (value: T) => string
}

export interface SerializerAsync<T> {
  read: (raw: string) => Awaitable<T>
  write: (value: T) => Awaitable<string>
}

export const StorageSerializers: Record<'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date', Serializer<any>> = {
  boolean: {
    read: (v: any) => v === 'true',
    write: (v: any) => String(v),
  },  object: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },  number: {
    read: (v: any) => Number.parseFloat(v),
    write: (v: any) => String(v),
  },  any: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },  string: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from((v as Map<any, any>).entries())),
  },  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from(v as Set<any>)),
  },  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },}

export const customStorageEventName = 'vueuse-storage'

export interface StorageEventLike {
  storageArea: StorageLike | null
  key: StorageEvent['key']
  oldValue: StorageEvent['oldValue']
  newValue: StorageEvent['newValue']
}

export interface UseStorageOptions<T> extends ConfigurableEventFilter, ConfigurableWindow, ConfigurableFlush {
  /**
   * Watch for deep changes   *   * @default true
   */
   deep?: boolean

  /**
   * Listen to storage changes, useful for multiple tabs application   *   * @default true
   */
   listenToStorageChanges?: boolean

  /**
   * Write the default value to the storage when it does not exist   *   * @default true
   */
   writeDefaults?: boolean

  /**
   * Merge the default value with the value read from the storage.   *   * When setting it to true, it will perform a **shallow merge** for objects.   * You can pass a function to perform custom merge (e.g. deep merge), for example:   *   * @default false
   */
   mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)

  /**
   * Custom data serialization   */
   serializer?: Serializer<T>

  /**
   * On error callback   *   * Default log error to `console.error`   */
   onError?: (error: unknown) => void

  /**
   * Use shallow ref as reference   *   * @default false
   */
   shallow?: boolean

  /**
   * Wait for the component to be mounted before reading the storage.   *   * @default false
   */
   initOnMounted?: boolean
}

export function useStorage(key: string, defaults: MaybeRefOrGetter<string>, storage?: StorageLike, options?: UseStorageOptions<string>): RemovableRef<string>
export function useStorage(key: string, defaults: MaybeRefOrGetter<boolean>, storage?: StorageLike, options?: UseStorageOptions<boolean>): RemovableRef<boolean>
export function useStorage(key: string, defaults: MaybeRefOrGetter<number>, storage?: StorageLike, options?: UseStorageOptions<number>): RemovableRef<number>
export function useStorage<T>(key: string, defaults: MaybeRefOrGetter<T>, storage?: StorageLike, options?: UseStorageOptions<T>): RemovableRef<T>
export function useStorage<T = unknown>(key: string, defaults: MaybeRefOrGetter<null>, storage?: StorageLike, options?: UseStorageOptions<T>): RemovableRef<T>

/**
 * Reactive LocalStorage/SessionStorage. * * @see https://vueuse.org/useStorage
 */
export function useStorage<T extends(string | number | boolean | object | null)>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage: StorageLike | undefined,
  options: UseStorageOptions<T> = {},
): RemovableRef<T> {
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e)
    },    initOnMounted,
  } = options

  const data = (shallow ? shallowRef : ref)(typeof defaults === 'function' ? defaults() : defaults) as RemovableRef<T>

  if (!storage) {
    try {
      storage = getSSRHandler('getDefaultStorage', () => defaultWindow?.localStorage)()
    }    catch (e) {
      onError(e)
    }  }
  if (!storage)
    return data

  const rawInit: T = toValue(defaults)
  const type = guessSerializerType<T>(rawInit)
  const serializer = options.serializer ?? StorageSerializers[type]

  const { pause: pauseWatch, resume: resumeWatch } = pausableWatch(
    data,
    () => write(data.value),
    { flush, deep, eventFilter },
  )
  if (window && listenToStorageChanges) {
    tryOnMounted(() => {
      // this should be fine since we are in a mounted hook
      useEventListener(window, 'storage', update)
      useEventListener(window, customStorageEventName, updateFromCustomEvent)
      if (initOnMounted)
        update()
    })  }
  // avoid reading immediately to avoid hydration mismatch when doing SSR
  if (!initOnMounted)
    update()

  function dispatchWriteEvent(oldValue: string | null, newValue: string | null) {
    // send custom event to communicate within same page
    // importantly this should _not_ be a StorageEvent since those cannot    // be constructed with a non-built-in storage area    if (window) {
      window.dispatchEvent(new CustomEvent<StorageEventLike>(customStorageEventName, {
        detail: {
          key,
          oldValue,
          newValue,
          storageArea: storage!,
        },      }))    }  }
  function write(v: unknown) {
    try {
      const oldValue = storage!.getItem(key)

      if (v == null) {
        dispatchWriteEvent(oldValue, null)
        storage!.removeItem(key)
      }      else {
        const serialized = serializer.write(v as any)
        if (oldValue !== serialized) {
          storage!.setItem(key, serialized)
          dispatchWriteEvent(oldValue, serialized)
        }      }    }    catch (e) {
      onError(e)
    }  }
  function read(event?: StorageEventLike) {
    const rawValue = event
      ? event.newValue
      : storage!.getItem(key)

    if (rawValue == null) {
      if (writeDefaults && rawInit != null)
        storage!.setItem(key, serializer.write(rawInit))
      return rawInit
    }
    else if (!event && mergeDefaults) {
      const value = serializer.read(rawValue)
      if (typeof mergeDefaults === 'function')
        return mergeDefaults(value, rawInit)
      else if (type === 'object' && !Array.isArray(value))
        return { ...rawInit as any, ...value }
      return value
    }
    else if (typeof rawValue !== 'string') {
      return rawValue
    }
    else {
      return serializer.read(rawValue)
    }  }
  function update(event?: StorageEventLike) {
    if (event && event.storageArea !== storage)
      return

    if (event && event.key == null) {
      data.value = rawInit
      return
    }

    if (event && event.key !== key)
      return

    pauseWatch()
    try {
      if (event?.newValue !== serializer.write(data.value))
        data.value = read(event)
    }    catch (e) {
      onError(e)
    }    finally {
      // use nextTick to avoid infinite loop
      if (event)
        nextTick(resumeWatch)
      else
        resumeWatch()
    }  }
  function updateFromCustomEvent(event: CustomEvent<StorageEventLike>) {
    update(event.detail)
  }
  return data
}
```

- 不出所料哈，大概就是包装了一层 ref，或者 shallowRef，当每次调用了 updated后都会执行一次 resumeWatch，啥效果不太知道
- 在这里使用了 window.dispatchEvent 更新了 storage 里的数据 [storage_event](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/storage_event)

### 12.useStorageAsync

具有异步支持的响应式 Storage。

没有单元测试，看源码

```ts
import type { MaybeRefOrGetter, RemovableRef } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import type { StorageLikeAsync } from '../ssr-handlers'
import type { SerializerAsync, UseStorageOptions } from '../useStorage'
import { toValue, watchWithFilter } from '@vueuse/shared'
import { ref, shallowRef } from 'vue-demi'
import { defaultWindow } from '../_configurable'
import { getSSRHandler } from '../ssr-handlers'
import { useEventListener } from '../useEventListener'
import { StorageSerializers } from '../useStorage'
import { guessSerializerType } from '../useStorage/guess'

export interface UseStorageAsyncOptions<T> extends Omit<UseStorageOptions<T>, 'serializer'> {
  /**
   * Custom data serialization
   */ serializer?: SerializerAsync<T>
}

export function useStorageAsync(key: string, initialValue: MaybeRefOrGetter<string>, storage?: StorageLikeAsync, options?: UseStorageAsyncOptions<string>): RemovableRef<string>
export function useStorageAsync(key: string, initialValue: MaybeRefOrGetter<boolean>, storage?: StorageLikeAsync, options?: UseStorageAsyncOptions<boolean>): RemovableRef<boolean>
export function useStorageAsync(key: string, initialValue: MaybeRefOrGetter<number>, storage?: StorageLikeAsync, options?: UseStorageAsyncOptions<number>): RemovableRef<number>
export function useStorageAsync<T>(key: string, initialValue: MaybeRefOrGetter<T>, storage?: StorageLikeAsync, options?: UseStorageAsyncOptions<T>): RemovableRef<T>
export function useStorageAsync<T = unknown>(key: string, initialValue: MaybeRefOrGetter<null>, storage?: StorageLikeAsync, options?: UseStorageAsyncOptions<T>): RemovableRef<T>

/**
 * Reactive Storage in with async support. * * @see https://vueuse.org/useStorageAsync
 * @param key
 * @param initialValue
 * @param storage
 * @param options
 */
export function useStorageAsync<T extends(string | number | boolean | object | null)>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  storage: StorageLikeAsync | undefined,
  options: UseStorageAsyncOptions<T> = {},
): RemovableRef<T> {
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e)
    },
  } = options

  const rawInit: T = toValue(initialValue)
  const type = guessSerializerType<T>(rawInit)

  const data = (shallow ? shallowRef : ref)(initialValue) as Ref<T>
  const serializer = options.serializer ?? StorageSerializers[type]

  if (!storage) {
    try {
      storage = getSSRHandler('getDefaultStorageAsync', () => defaultWindow?.localStorage)()
    }
    catch (e) {
      onError(e)
    }
  }
  async function read(event?: StorageEvent) {
    if (!storage || (event && event.key !== key))
      return

    try {
      const rawValue = event ? event.newValue : await storage.getItem(key)
      if (rawValue == null) {
        data.value = rawInit
        if (writeDefaults && rawInit !== null)
          await storage.setItem(key, await serializer.write(rawInit))
      }
      else if (mergeDefaults) {
        const value = await serializer.read(rawValue)
        if (typeof mergeDefaults === 'function')
          data.value = mergeDefaults(value, rawInit)
        else if (type === 'object' && !Array.isArray(value))
          data.value = { ...(rawInit as any), ...value }
        else data.value = value
      }
      else {
        data.value = await serializer.read(rawValue)
      }
    }
    catch (e) {
      onError(e)
    }
  }
  read()

  if (window && listenToStorageChanges)
    useEventListener(window, 'storage', e => Promise.resolve().then(() => read(e)))

  if (storage) {
    watchWithFilter(
      data,
      async () => {
        try {
          if (data.value == null)
            await storage!.removeItem(key)
          else
            await storage!.setItem(key, await serializer.write(data.value))
        }
        catch (e) {
          onError(e)
        }
      },
      {
        flush,
        deep,
        eventFilter,
      },
    )
  }
  return data as RemovableRef<T>
}
```

- 使用了异步来更新 storage

### 13.useThrottledRefHistory

带有节流过滤器的 [`useRefHistory`](https://vueuse.pages.dev/core/useRefHistory/) 的简写。

单元测试
```ts
import { promiseTimeout } from '@vueuse/shared'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue-demi'
import { useThrottledRefHistory } from '.'

describe('useThrottledRefHistory - sync', () => {
  it('take first snapshot right after data was changed and second after given time', async () => {
    const ms = 10
    const v = ref(0)

    const { history } = useThrottledRefHistory(v, { throttle: ms })

    expect(history.value.length).toBe(1)
    expect(history.value[0].snapshot).toBe(0)

    v.value = 100

    await promiseTimeout(ms * 3)

    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(100)

    v.value = 200
    v.value = 300
    v.value = 400

    await promiseTimeout(ms * 3)

    expect(history.value.length).toBe(3)
    expect(history.value[0].snapshot).toBe(400)
  })
})
```

- 就是给 useRefHistory 加上了一个节流功能，和上方 `useDebounceRefHistory` 类似
源码
```ts
import type { MaybeRef } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import type { UseRefHistoryOptions, UseRefHistoryReturn } from '../useRefHistory'
import { throttleFilter } from '@vueuse/shared'
import { useRefHistory } from '../useRefHistory'

export type UseThrottledRefHistoryOptions<Raw, Serialized = Raw> = Omit<UseRefHistoryOptions<Raw, Serialized>, 'eventFilter'> & { throttle?: MaybeRef<number>, trailing?: boolean }

export type UseThrottledRefHistoryReturn<Raw, Serialized = Raw> = UseRefHistoryReturn<Raw, Serialized>

/**
 * Shorthand for [useRefHistory](https://vueuse.org/useRefHistory) with throttled filter.
 * @see https://vueuse.org/useThrottledRefHistory
 * @param source
 * @param options
 */
export function useThrottledRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: UseThrottledRefHistoryOptions<Raw, Serialized> = {},
): UseThrottledRefHistoryReturn<Raw, Serialized> {
  const { throttle = 200, trailing = true } = options
  const filter = throttleFilter(throttle, trailing)
  const history = useRefHistory(source, { ...options, eventFilter: filter })

  return {
    ...history,
  }
}
```
