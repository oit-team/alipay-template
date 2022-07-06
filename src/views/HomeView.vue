<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <Tabbar />
  </div>
</template>

<script>
import HelloWorld from '../components/business/HelloWorld'
import Tabbar from '@/components/business/Tabbar'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    Tabbar,
  },
}
</script>
