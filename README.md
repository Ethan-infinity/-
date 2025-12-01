# 线性代数可视化学习平台

一个基于 Vue 3 和 Vite 构建的交互式线性代数学习平台，通过直观的可视化帮助理解抽象的数学概念。

## 项目简介

本项目旨在通过交互式可视化的方式，让线性代数的学习变得更加直观和有趣。我们告别传统的公式推导，通过图形化的方式展示向量、矩阵、特征值等核心概念的几何意义。

### 主要特色

- 🎨 **交互式可视化**：通过图形直观展示数学概念
- 📱 **响应式设计**：支持多种设备和屏幕尺寸
- 🚀 **现代化技术栈**：基于 Vue 3 和 Vite 构建
- 🎯 **模块化学习**：涵盖线性代数核心知识点

### 学习模块

- **向量**：探索向量的加减法、数乘及其几何意义
- **矩阵**：理解矩阵变换、乘法及其对空间的影响
- **行列式**：可视化行列式作为面积或体积的缩放因子
- **线性方程组**：观察直线与平面的交点，理解解的结构
- **特征值与特征向量**：发现变换中的不变量与主方向
- **二次型**：通过图形理解二次型的正定性与标准形
- **知识图谱**：查看各知识点之间的内在联系

此模板应有助于您使用 Vue 3 和 Vite 开始开发。

## 推荐的 IDE 设置

[VS Code](https://code.visualstudio.com/) + [Vue (官方)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（并禁用 Vetur）。

## 推荐的浏览器设置

- 基于 Chromium 的浏览器（Chrome、Edge、Brave 等）：
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [在 Chrome DevTools 中启用自定义对象格式化器](http://bit.ly/object-formatters)
- Firefox：
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [在 Firefox DevTools 中启用自定义对象格式化器](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## TypeScript 中 `.vue` 导入的类型支持

TypeScript 默认无法处理 `.vue` 导入的类型信息，因此我们使用 `vue-tsc` 替换 `tsc` 进行类型检查。在编辑器中，我们需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 使 TypeScript 语言服务能够识别 `.vue` 类型。

## 自定义配置

请参阅 [Vite 配置参考](https://vite.dev/config/)。

## 项目设置

```sh
npm install
```

### 开发环境下的编译和热重载

```sh
npm run dev
```

### 生产环境下的类型检查、编译和最小化

```sh
npm run build
```

### 使用 [ESLint](https://eslint.org/) 进行代码检查

```sh
npm run lint
