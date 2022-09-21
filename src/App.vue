<script>
import ApiError from '@/api/api-error'

export default {
  onLaunch() {
    console.info('App Launch')
  },
  onShow() {
    console.info('App Show')
  },
  onHide() {
    console.info('App Hide')
  },
  // 捕获promise错误
  onUnhandledRejection({ reason }) {
    // 处理接口错误
    if (reason instanceof ApiError) {
      console.error(reason)

      if (reason.resolved) return

      const httpStatusCode = reason.error?.statusCode
      let msg = reason.message

      if (httpStatusCode > 500) msg = '服务器出错\n请稍后重试'

      // 弹出提示
      // Toast.fail(msg)
    }
  },
}
</script>

<style lang="scss">
@import "./styles";
</style>
