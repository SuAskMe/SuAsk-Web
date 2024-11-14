# 如何使用 Icon 小组件

在 `template` 内直接引入即可

## 基础用法

### 在 Vue 中引入

```html
<svg-icon icon="test" size="24" color="black" filled></svg-icon>
```

![alt text](../src/assets/icons/test.svg)

### API

`<svg-icon\>`Props

| 参数名 | 描述                             | 类型             | 默认值 |
| ------ | -------------------------------- | ---------------- | ------ |
| icon   | 图标名称                         | string           | -      |
| size   | 图标大小                         | number \| string | -      |
| color  | 图标颜色                         | string           | black  |
| filled | 图标为线性还是面性（是否被填充） | boolean          | false  |

## 进阶用法

### 导入图标

将下载好的 `.svg` 文件放入 `.\src\assets\icons` 中，如果有线性面性的区别请在面性图标后面加上 `-fill` ，例如 `bookmark-fill.svg` `bookmark.svg`
运行 `tools` 文件夹下的 `format_svg.py` 即可导入
