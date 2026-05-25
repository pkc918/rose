## Context

当前项目使用 `@nuxtjs/color-mode`（`classSuffix: ''`）管理主题，在 `<html>` 上添加/移除 `.dark` class 来切换。颜色样式依赖 `dark:` variant（UnoCSS attributify 模式）和 `main.css` 中的 `.dark` 选择器。现有过渡效果是 `main.css` 中 `body` 上的 CSS `transition: background-color 0.3s ease, color 0.3s ease`。

这个方案在 sidebar + content 的 grid 布局下存在固有的视觉割裂问题：两侧各自独立的 transition 触发时机有微秒级差异，无法保证同步。

## Goals / Non-Goals

**Goals:**
- 主题切换时，从点击按钮处向外扩散圆形动画，视觉连续统一
- 动画覆盖包括 sidebar NavBar 和 content 区域在内的整个视口
- 移动端（底部导航按钮）和桌面端（左侧导航按钮）都正确工作
- 所有主流浏览器兼容（不依赖 View Transitions API）

**Non-Goals:**
- 不修改 @nuxtjs/color-mode 的配置或行为
- 不改变现有 CSS 变量的颜色值或 dark/light 的样式规则
- 不添加新的依赖包

## Decisions

### 1. 使用 clip-path circle 动画 + Teleport overlay

**选此方案**而非 View Transitions API 的原因：
- View Transitions API 在 Firefox/Safari 上不支持（2026年仍只有 Chromium 系支持）
- `clip-path: circle()` 在所有现代浏览器中都有良好支持
- 手动 overlay 可以精确控制动画时机和坐标

### 2. Overlay 色彩策略：用旧 theme 背景色覆盖

流程：
1. 用户点击 → 捕获按钮坐标
2. 创建 overlay（背景色 = 旧 theme 的 `--bg-primary`）
3. 切换 `colorMode.preference`（页面内容已是新 theme）
4. overlay 从 `circle(0)` 扩散到 `circle(150vmax)`，逐步"揭开"下方的新 theme
5. 动画结束 → 移除 overlay

等效理解：overlay 是旧 theme 颜色的"遮罩"，从按钮处向外被"擦除"，露出新 theme。

### 3. 动画参数

- **时长**：500ms（`ease-out`），结尾略微减速增强自然感
- **起始半径**：按钮大小 ~24px（`circle(24px)`），避免起点过于尖锐
- **终点半径**：`150vmax`（保证覆盖屏幕对角线）
- **z-index**：9999，确保覆盖所有内容

### 4. 动画期间禁用 CSS transition

`main.css` 中的 `body { transition: background-color 0.3s ease, color 0.3s ease }` 需移除或改为更精确的选择器。否则主题 class 切换后，body 的背景色 transition 会和 overlay 动画同时触发，造成颜色"闪烁"。

### 5. 实现位置：在 NavBar.vue 中内聚

动画逻辑写在 `NavBar.vue` 的 `toggleTheme` 中，因为：
- 按钮在 NavBar 中，坐标捕获最直接
- Teleport overlay 到 `<body>`，不存在定位问题
- 逻辑内聚，改动范围小

## Risks / Trade-offs

- **快速双击**：通过 `isAnimating` ref 锁防止同一动画期间再次触发
- **`clip-path` 性能**：现代浏览器对 clip-path 有 GPU 加速，500ms 动画不会造成掉帧。确保 overlay 使用 `will-change: clip-path` 或 `transform: translateZ(0)` 启动合成层
- **高 DPI/超宽屏**：`150vmax` 保证覆盖。极端宽高比（如 32:9）也已足够
