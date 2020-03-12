<template>
  <div class="dashboard-container">
<!--    <div class="dashboard-text">name: {{ username }}</div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import StorageDB from '@/utils/storageDB'

export default {
  name: 'HomePage',
  computed: {
    ...mapGetters([
      'name'
    ]),
    username() {
      return '123'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
