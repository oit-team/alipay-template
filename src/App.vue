<template>
  <div id="app">
    <BetterView :tabs="['Home', 'About']" />
  </div>
</template>

<script>
import { BetterView } from '@oit/vue-components'

export default {
  components: {
    BetterView,
  },
}
</script>

<style lang="scss">
</style>
