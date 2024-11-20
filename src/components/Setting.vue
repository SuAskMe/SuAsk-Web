<template>
  <BaseInfo> </BaseInfo>

  <Password> </Password>

  <MyStyle> </MyStyle>

</template>

<script>
import BaseInfo from './setting/BaseInfo.vue';
import Password from './setting/Password.vue';
import MyStyle from './setting/MyStyle.vue';

export default {
    components: {
        Password,
        BaseInfo,
        MyStyle
    }
}
</script>