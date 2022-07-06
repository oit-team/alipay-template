<template>
  <van-tabbar route>
    <van-tabbar-item name="home" icon="home-o" to="/">标签</van-tabbar-item>
    <van-tabbar-item name="setting" icon="setting-o" to="/about">标签</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'

export default {
  name: 'VcTabbar',

  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
}
</script>

<style scoped>

</style>
