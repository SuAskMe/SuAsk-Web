# 如何使用 Vue Router

**看这个之前请先阅读[官方文档](https://router.vuejs.org/zh/introduction.html)**

## 添加新的路由

> [!IMPORTANT]
> 
> 仅当你需要在根路由时才需要干这一步，例如 `suask.me/home` 才是根路由，`suask.me/yyy/xxx` 的 `xxx` 是子节点路由，需要在 `yyy.ts` 文件中添加 `children`，而不是新建文件

当你需要添加路由时，请在 `router/routes/modules` 文件夹内创建你的路由组件，例如 `home.ts` 就是主页面的相关路由

你的路由组件 `xxx.ts`

```typescript
export const HomeRoute: AppRouteRecordRaw = {
  // 中间填充内容
};
```

写完之后需要在 `router/routes/index.ts` 中引入你的路由组件

```typescript
export const basicRoutes = [
  // 你的新增路由在这
  HomeRoute,
  LoginRoute,
  TestRoute,
  RootRoot,
  PageNotFound,
];
```

## 格式需求

```typescript
export interface AppRouteRecordRaw extends RouteMeta {
  name: string; // 名称，必需且不能重复
  path: string; // 路径，必须且不能重复
  meta: RouteMeta; // 路由元，必须
  component?: Component | string; // 路由绑定的组件
  components?: Component; // 路由绑定的组件
  children?: AppRouteRecordRaw[]; // 子路由
  fullPath?: string; // 完整路径
}
```

具体可以参考 `home.ts` 文件，里面有详细内容

`meta` 路由元中需要包含 `title`，以显示你的标题
```typescript
meta: {
    title: '114514'
}
```

## 定义 `props`

我已经在 `home/` 路由的子路由中定义了两个 `props`
```typescript
props: {
    user: 'student', // 用户等级，分别为 `student` `teacher` `admin`
    deviceType: isMobile() ? 'phone' : 'desktop', // 自动判断设备类型
},
```
当你想要使用时，只需要在子组件 `defineProps` 即可开箱即用
```vue
<template>
    {{ userType }}
</template>

<script setup lang='ts'>
const props = defineProps({
    userType: String,
    deviceType: String,
})
</script>

<style lang="scss" scoped>
  
</style>
```
> [!IMPORTANT]
>
> Vue 的 `props` 无法跨组件传递，如果你想传子组件的子组件，需要嵌套传递或者使用 Vue 的 [`依赖注入`](https://cn.vuejs.org/guide/components/provide-inject.html)
> 
> 嵌套传递可以参考 `layout/home/WebHome.vue` 的内容

---

也许你需要定义 `props` 来控制自己的组件

例如 `home.ts`
```typescript
{
    path: 'setting',
    name: 'Setting',
    meta: {
        title: '设置'
    },
    components: {
        default: Setting,
        sidebar: Sidebar,
        // header: Header,
        footer: PhoneMainFooter
    },
    props: {
        // header: { isQuestionPage: false },
        footer: { isQuestionPage: false },
    }
},
```

我在这里自定义了一个 `isQuestionPage` 的 `props`，插入到 `footer` 组件中，使其判断是不是需要下面的输入框

`footer` 组件(隐去了不需要的内容)
```vue
<template>
 <div v-if="props.isQuestionPage">
   
 </div>
</template>

<script setup lang='ts'>
const props = defineProps({
    isQuestionPage: Boolean // 在这里接收props
})
</script>

<style scoped lang="scss">
</style>
```
