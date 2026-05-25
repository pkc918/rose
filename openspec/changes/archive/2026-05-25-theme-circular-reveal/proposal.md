## Why

当前 light/dark 主题切换使用 CSS `transition` 做整体渐变，但左侧导航栏（sidebar）和右侧内容区是独立 DOM 元素，各自的 transition 触发时间有微秒级差异，导致视觉上出现"左右割裂、一半一半"的体验。需要替换为从按钮处向外扩散的圆形揭示动画，提供更流畅、沉浸的主题切换体验。

## What Changes

- 移除当前全局 `transition: background-color 0.3s ease, color 0.3s ease` 的渐变方案
- 在 NavBar 的主题切换按钮点击时，捕获按钮屏幕坐标作为动画原点
- 使用一个全屏 Teleport overlay，通过 `clip-path: circle()` 动画实现从按钮向外扩散的圆形揭示效果
- 动画期间暂时禁用常规 CSS transition，避免两种效果叠加冲突
- 动画完成后移除 overlay，页面以新主题正常呈现

## Capabilities

### New Capabilities

- `theme-reveal-animation`: 主题切换时从按钮处向外扩散的圆形 clip-path 动画，替代当前的 CSS transition 渐变

### Modified Capabilities

<!-- None - no existing spec changes needed -->

## Impact

- `app/components/NavBar.vue` — 主要改动：添加动画逻辑、Teleport overlay、事件坐标捕获
- `app/assets/css/main.css` — 移除 `body` 上的 CSS transition，添加 overlay 的 keyframe 动画
