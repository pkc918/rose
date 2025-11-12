---
theme: z-blue
highlight: agate
title: test
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

- [`provideLocal`](https://vueuse.org/shared/provideLocal/)-extended `provide` with ability to call `injectLocal` to obtain the value in the same component

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
