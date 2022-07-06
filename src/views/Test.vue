<template>
  <div>
    <router-link to="/">返回</router-link>
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from '../components/business/HelloWorld'

export default {
  name: 'Test',

  components: {
    HelloWorld,
  },
}
</script>

<style scoped>

</style>
