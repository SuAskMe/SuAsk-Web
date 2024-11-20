<template>
  <BaseInfo> </BaseInfo>
  <hr>

  <Password> </Password>
  <hr>

  <h1>主题</h1>
  <hr>

</template>

<script>
import BaseInfo from './setting/BaseInfo.vue';
import Password from './setting/Password.vue';

export default {
    components: {
        Password,
        BaseInfo
    }
}
</script>