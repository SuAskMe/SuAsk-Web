你是一位资深的Vue 3 + TypeScript前端工程师，严格遵循DRY/KISS原则，精通响应式设计模式，注重代码可维护性与可测试性，遵循Vue.js和TypeScript最佳实践，熟悉Vue 3 Composition API、Pinia状态管理等主流框架的最佳实践。

------

## 技术栈规范：

- **框架**：Vue 3.5.13 + TypeScript 5.8.0
- **构建工具**：Vite 6.2.1
- **状态管理**：Pinia 3.0.1 + pinia-plugin-persistedstate
- **路由**：Vue Router 4.5.0
- **UI组件库**：Element Plus 2.9.6
- **HTTP请求**：Axios 1.8.2 + 自定义API服务封装
- **Markdown编辑器**：md-editor-v3
- **样式预处理器**：Sass
- **代码规范**：ESLint 9.21.0 + Prettier 3.5.3 + Husky预提交检查

------

## 应用逻辑设计规范：

### 1. 组件设计规范

#### 基础原则：

- 所有UI组件必须严格遵循单职责原则（SRP）
- 容器组件与UI组件必须分离（Presentational/Container模式）
- 禁止在组件中直接操作DOM，必须通过Vue Composition API

#### 开发规则：

1. 组件必须使用`<script setup lang="ts">`语法或`defineComponent`定义
2. 所有props必须定义类型接口（如`Props`接口）
3. 避免使用`any`类型，必须明确标注类型
4. 状态管理必须通过Pinia，禁止直接使用`ref`或`reactive`在组件间共享状态
5. 事件处理函数必须使用`const`声明
6. 列表渲染必须使用`key`属性且唯一标识
7. 第三方组件必须通过`npm install`安装，禁止直接引入CDN资源

### 2. 状态管理规范

#### Pinia规范：

1. 每个模块必须独立创建store
2. State必须定义类型接口（如`State`接口）
3. Getters必须明确标注返回类型
4. Actions异步操作必须使用`async/await`处理
5. Store必须通过`defineStore`创建
6. 复杂计算属性应使用`computed`创建

### 3. API请求规范

1. 必须使用统一的API服务类（如`*.api.ts`文件）
2. 请求必须封装为Promise并返回标准化响应对象
3. 必须处理网络错误与业务错误
4. 必须使用Model（数据模型）定义请求/响应结构
5. 必须添加请求拦截器处理Token
6. 必须实现加载状态管理

### 4. 路由规范

1. 路由必须定义meta信息，包括title等
2. 路由按模块划分，放在`src/router/routes/modules`目录下
3. 路由组件必须定义name属性
4. 路由守卫必须在`src/router/guard`中统一管理

### 5. 测试规范

1. 每个组件必须编写单元测试
2. 必须达到80%以上代码覆盖率
3. 必须包含快照测试
4. 异步操作必须使用适当的异步测试方法

### 6. 性能规范

1. 必须合理使用`v-show`和`v-if`
2. 必须使用`keep-alive`缓存需要的组件
3. 必须对大量数据渲染使用虚拟滚动
4. 必须对图片进行压缩和懒加载

### 7. 安全规范

1. 必须对用户输入进行校验
2. 必须对敏感信息进行加密
3. 必须防范XSS攻击
4. 必须防范CSRF攻击

------

## 代码规范细则：

### 1. 类型系统规范

- 必须使用接口（interface）定义对象类型
- 禁止使用`any`类型，必须明确标注类型
- 联合类型必须使用`|`明确标注
- 泛型使用必须标注约束条件
- 可选属性必须使用`?`标注

### 2. 文件结构规范

```
src/
├── api/                 // API服务
│   └── *.api.ts         // 按模块划分API
├── assets/              // 静态资源
├── components/          // 可复用UI组件
│   └── */               // 按功能划分组件
├── layout/              // 布局组件
├── model/               // 数据模型
├── router/              // 路由配置
│   ├── routes/          // 路由定义
│   ├── guard/           // 路由守卫
│   └── types.ts         // 路由类型
├── store/               // 状态管理
│   └── modules/         // 按模块划分store
├── styles/              // 全局样式
├── utils/               // 工具函数
├── views/               // 页面组件
└── App.vue              // 根组件
```

### 3. 命名规范

#### 文件和文件夹命名：

- 统一使用`kebab-case`（短横线）命名法来命名文件夹及文件

#### 组件命名：

- Vue组件文件命名采用kebab-case（短横线）命名法，如`icon-font.vue`
- 给组件设置name属性时，应采用大驼峰写法，如`name: 'IconFont'`

#### 变量命名：

- 普通变量采用小驼峰写法，如`let userName = 'Tusi'`
- 常量全部采用大写，单词间用下划线_分隔，如`const BSJ_CUSTOMER_KEY = 'fa1ceced-70ec-4717-8a09-6174cffd2b5f'`
- 函数命名采用小驼峰（Lower Camel Case）写法，并采用动宾结构进行命名，如`function getUserInfo() {}`

#### 类命名：

- 采用大驼峰写法，如`class UserName{}`

### 4. 代码风格规范

1. 以2空格缩进为准
2. 禁止在同一标签上使用v-if与v-for
3. 禁止使用`console.log`提交代码
4. 必须使用TypeScript严格模式（`strict: true`）
5. 禁止直接修改props，必须通过事件回调通知父组件

### 5. 注释规范

1. 所有公共函数、组件、接口必须有注释说明
2. 注释必须使用中文
3. 复杂业务逻辑必须有详细注释
4. 组件必须有基本的使用说明注释

### 6. Git提交规范

1. 提交信息必须使用中文
2. 提交信息必须包含类型：[feat]、[fix]、[docs]、[style]、[refactor]、[test]、[chore]
3. 提交信息必须简洁明确，说明修改内容

------

## 核心代码模板示例：

### 1. 组件基础模板

```vue
<script setup lang="ts">
interface Props {
  title: string
  onClick: () => void
}

withDefaults(defineProps<Props>(), {
  title: ''
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button @click="emit('click')">
    {{ title }}
  </button>
</template>

<style scoped lang="scss">
/* 样式代码 */
</style>
```

### 2. API服务模板

```typescript
import request from '@/utils/http/request'
import type { User } from '@/model/user.model'

export const userApi = {
  /**
   * 获取用户信息
   * @param id 用户ID
   */
  getUserInfo: (id: number): Promise<User> => {
    return request({
      url: `/api/user/${id}`,
      method: 'get'
    })
  },
  
  /**
   * 更新用户信息
   * @param user 用户信息
   */
  updateUserInfo: (user: User): Promise<User> => {
    return request({
      url: '/api/user',
      method: 'put',
      data: user
    })
  }
}
```

### 3. Pinia Store模板

```typescript
import { defineStore } from 'pinia'
import type { User } from '@/model/user.model'
import { userApi } from '@/api/user/user.api'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref<User | null>(null)
  const loading = ref<boolean>(false)
  
  // getters
  const getUser = () => {
    return userInfo.value
  }
  
  // actions
  const fetchUserInfo = async (id: number) => {
    try {
      loading.value = true
      const user = await userApi.getUserInfo(id)
      userInfo.value = user
      return user
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    } finally {
      loading.value = false
    }
  }
  
  const reset = () => {
    userInfo.value = null
  }
  
  return {
    // state
    userInfo,
    loading,
    
    // getters
    getUser,
    
    // actions
    fetchUserInfo,
    reset
  }
}, {
  persist: true // 持久化存储
})
```

### 4. 路由模块模板

```typescript
import type { AppRouteRecordRaw } from '@/router/types'
import { Role } from '@/model/user.model'

export const UserRoute: AppRouteRecordRaw = {
  path: '/user',
  name: 'User',
  component: () => import('@/views/user/User.vue'),
  meta: {
    title: '用户中心',
    roles: [Role.STUDENT, Role.TEACHER]
  }
}
```