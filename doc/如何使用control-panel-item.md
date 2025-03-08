# 如何使用 control-panel-item

这个东西就是电脑侧边栏和手机底部导航栏的那个“按钮”

## 基础用法

直接在`vue`中使用

```html
<div>
  <control-panel-item
    id="stu-ask-all"
    icon="group"
    text="问大家"
    :clicked="selectedItem == 'stu-ask-all'"
    @updateSelected="updateSelected"
    jump-to-path="ask-all"
  />
</div>
```

## API

| 参数名     | 描述                 | 类型    | 默认值 |
| ---------- | -------------------- | ------- | ------ |
| id         | 控制面板的id         | string  | -      |
| icon       | 图标(与svg-icon相同) | string  | -      |
| size       | 图标大小             | string  | -      |
| text       | 内容                 | string  | -      |
| clicked    | 是否被选中           | boolean | -      |
| jumpToPath | 点击后跳转的路径     | string  | -      |

