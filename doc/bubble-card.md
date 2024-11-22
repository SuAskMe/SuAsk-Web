## bubble-card 系列

包含三个组件

* **bubble-answer**: 问题回复气泡
* **bubble-question**: 问大家界面的问题气泡（应该仅在问大家界面使用）
* **bubble-basic-question**: 通用问题气泡，用于个人历史提问，提问详情页等等

<mark>必读：类型后面带 `!` 的是必要属性，带 `?` 的是可选属性</mark>

### bubble-answer 回复气泡

**样例**

```html
<bubble-answer
:is-mine="true"
:avatar="avatar"
:nick-name="'Jacko'"
:text="text"
:like-count="200"        
:is-liked="isLiked"
:time-stamp="1628822400000"
:quote="{ text, author}"
:image-urls="images"
:bubble-key="key"
:click-avatar="navigateToUserIndex"
:click-like="addLike" 
:click-quote="scrollToQuote"></bubble-answer>
```

#### API

| 参数名       | 描述                       | 类型                          | 默认值 | 备注                                                         |
| ------------ | -------------------------- | ----------------------------- | ------ | ------------------------------------------------------------ |
| is-mine      | 表示这条回答是不是我发出的 | boolean!                      | false  |                                                              |
| avatar       | 头像链接                   | string!                       | 无     | 推荐使用本地缓存，而不是直接使用后端获取的url                |
| nick-name    | 用户昵称                   | string!                       | 无     |                                                              |
| text         | 正文                       | string!                       | 无     |                                                              |
| like-count   | 点赞数                     | number!                       | 无     |                                                              |
| time-stamp   | 时间戳                     | number!                       | 无     | 直接传后端返回的时间戳即可，组件会自动格式化为相应的时间来展示 |
| is-liked     | 是否已点赞                 | boolean?                      | false  | 点赞完记得更改为true                                         |
| quote        | 引用的信息                 | {text:string, author:string}? | 无     | text为正文，author为作者昵称                                 |
| image-urls   | 图片链接                   | string[]?                     | 无     | 最多支持9张，超过不会显示，推荐使用本地缓存，而不是直接使用后端获取的url |
| bubble-key   | 自定义key值                | any？                         | 无     | 仅在绑定函数的时候作为参数使用（后面有讲解）                 |
| click-avatar | 点击头像事件               | (key: any)=>void?             | 无     | bubble-key中所传入的值会在调用该函数时作为key参数传入        |
| click-like   | 点赞事件                   | (key: any)=>void?             | 无     | bubble-key中所传入的值会在调用该函数时作为key参数传入        |
| click-quote  | 点击引用事件               | (key: any)=>void?             | 无     | bubble-key中所传入的值会在调用该函数时作为key参数传入        |

#### 讲解

为了方便我们能够快速获取到当前组件信息的索引（如数组下标等），我在这里提供了`bubble-key:any`属性，这个属性不会造成任何的影响，只会作为参数传入你的事件函数之中。

至于在函数中使用与否都只看你需不需要，而为了方便实现更复杂的功能，我将其类型设置为`any`，当然这个类型是由使用者自己定义的，并且通常两者代码的位置相隔很近，所以不会造成理解上困难，你甚至可以将一个回调函数传入其中，并在处理完对应的逻辑之后再调用这个回调函数。

**以click-like为例**

```vue
<script setup lang="ts">
import bubbleAnswer from "@/components/bubble-card/bubble-answer/bubble-answer.vue";
const nickname = ...
...
const isLiked = ref(false)
const keyObj = {id: ...}
const addLike = (key: typeof keyObj)=>{
    todo: 向后端发起点赞请求
    isLiked.value = true
}
</script>

<template>
	<bubble-answer
		:is-mine="true"
		:avatar="avatar"
		:nick-name="'Jacko'"
		:text="text"
		:like-count="200"        
		:is-liked="isLiked"
		:time-stamp="1628822400000"
		:quote="{ text, author}"
		:image-urls="images"
		:bubble-key="keyObj"
		:click-avatar="navigateToUserIndex"
		:click-like="addLike" 
		:click-quote="scrollToQuote">
    </bubble-answer>
</template>
```

---

### bubble-question 问题气泡（特化）

**样例**

```html
<bubble-question
	:title="title"
    :text="text"
    :views="views"
    :time-stamp="1628822400000"
    :image-urls="urls"
    :answer-num="answerNum"
    :avatars="avatars"
    :is-favourite="false"
    :click-card="navigateToDetail"
    :click-favourite="addFavourite">
</bubble-question>
```

#### API

| 参数名          | 描述                                   | 类型              | 默认值 | 备注                                                         |
| --------------- | -------------------------------------- | ----------------- | ------ | ------------------------------------------------------------ |
| title           | 标题                                   | string!           | 无     |                                                              |
| text            | 正文                                   | string!           | 无     |                                                              |
| views           | 浏览量                                 | number!           | 无     |                                                              |
| time-stamp      | 时间戳                                 | number!           | 无     | 直接传后端返回的时间戳即可，组件会自动格式化为相应的时间来展示 |
| image-urls      | 图片链接                               | string[]?         | 无     | 最多支持9张，超过不会显示，推荐使用本地缓存，而不是直接使用后端获取的url |
| answer-num      | 回答的数量                             | number?           | 0      |                                                              |
| avatars         | 头像链接                               | string[]?         | 无     | 没有限定数量，但不建议超过5张，推荐使用本地缓存，而不是直接使用后端获取的url |
| is-favourite    | 是否已收藏                             | boolean           | false  | 收藏完记得改为true                                           |
| bubble-key      | 自定义key值                            | any？             | 无     | 仅在绑定函数的时候作为参数使用（后面有讲解）                 |
| click-card      | 点击问题事件（指定为跳转到问题详情页） | (key: any)=>void? | 无     | bubble-key中所传入的值会在调用该函数时作为key参数传入        |
| click-favourite | 收藏事件                               | (key: any)=>void? | 无     | bubble-key中所传入的值会在调用该函数时作为key参数传入        |

#### 讲解

参照 `bubble-answer` 组件，不多赘述

---

### bubble-card 通用气泡

**由于已有的问题气泡功能已经太过于复杂，为了单个组件的易用性，我特地将原来的问题气泡抽取一个框架出来，继续开发一个通用的气泡**

**样例**

```html
<bubble-card 
	:title="title" 
   	:text="text" 
    :views="views"
    :time-stamp="ts"
    :has-news="hasNews"
    :show-pin="showPin"
    :is-pinned="isPinned"
    :image-urls="urls"
    :bubble-key="key"
    :click-card="..."
    :click-pin="...">
</bubble-card>    
```

#### API

| 参数名     | 描述                                   | 类型              | 默认值 | 备注                                                         |
| ---------- | -------------------------------------- | ----------------- | ------ | ------------------------------------------------------------ |
| title      | 标题                                   | string!           | 无     |                                                              |
| text       | 正文                                   | string!           | 无     |                                                              |
| views      | 浏览量                                 | number!           | 无     |                                                              |
| time-stamp | 时间戳                                 | number!           | 无     | 直接传后端返回的时间戳即可，组件会自动格式化为相应的时间来展示 |
| has-news   | 是否有新消息                           | boolean?          | false  | 在标题左边会出现一个蓝点                                     |
| show-pin   | 是否展示置顶图标                       | boolean?          | false  | 在右上方出现一个图钉                                         |
| is-pinned  | 是否已经置顶                           | boolean?          | false  | 是否已经置顶                                                 |
| image-urls | 图片链接                               | string[]?         | 无     | 最多支持9张，超过不会显示，推荐使用本地缓存，而不是直接使用后端获取的url |
| bubble-key | 自定义key值                            | any？             | 无     | 仅在绑定函数的时候作为参数使用（后面有讲解）                 |
| click-card | 点击问题事件（指定为跳转到问题详情页） | (key: any)=>void? | 无     | bubble-key中所传入的值会在调用该函数时作为key参数传入        |
| click-pin  | 置顶事件                               | (key: any)=>void? | 无     | bubble-key中所传入的值会在调用该函数时作为key参数            |

#### 讲解

参照 `bubble-answer` 组件，不多赘述