<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view>
      <text class="title text-red-500">
        {{ title }}
      </text>
      <button @click="test()">
        测试
      </button>
    </view>
  </view>
</template>

<script>
import { login } from '@/api/account'

export default {
  data() {
    return {
      title: 'Hello',
    }
  },
  methods: {
    test() {
      login({
        username: 'viewuser1',
        password: 'viewuser123',
        cid: 1,
      }).then((res) => {
        console.log(res)
      })
    },
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
}
</style>
