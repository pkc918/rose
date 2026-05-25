## 1. CSS 清理

- [x] 1.1 移除 `main.css` 中 `body` 上的 `transition: background-color 0.3s ease, color 0.3s ease`

## 2. 双向圆形揭示动画实现

- [x] 2.1 坐标捕获逻辑（`getBoundingClientRect` 获取按钮中心）
- [x] 2.2 `isAnimating` ref 锁防止快速双击
- [x] 2.3 Teleport overlay（`position: fixed; z-index: 9999`），始终白色背景
- [x] 2.4 `@keyframes circle-expand`（`circle(0)` → `circle(150vmax)`）和 `circle-shrink`（`circle(150vmax)` → `circle(0)`）两个方向动画
- [x] 2.5 Light → Dark: 先切 theme 到 dark，overlay 用 shrink 动画收缩到按钮
- [x] 2.6 Dark → Light: overlay 用 expand 动画从按钮扩散，animationend 时再切 theme 到 light

## 3. 验证

- [ ] 3.1 `pnpm dev` 启动后在桌面端浏览器测试 light→dark（白色收缩到按钮）和 dark→light（白色从按钮扩散）
- [ ] 3.2 在移动端视口（或 DevTools 模拟）测试底部导航按钮的动画原点是否正确
- [ ] 3.3 快速双击 toggle 按钮确认无闪烁或重复动画
