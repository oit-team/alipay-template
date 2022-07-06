<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link to="/test">跳转页面</router-link>
    <Tabbar />
  </div>
</template>

<script>
import Tabbar from '@/components/business/Tabbar'

export default {
  components: {
    Tabbar,
  },
}
</script>
