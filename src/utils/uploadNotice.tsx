import { ElDrawer, ElNotification, ElProgress, ElTag } from 'element-plus'
import { useIntervalFn } from '@vueuse/core'
import { transformResponsePush } from './helper'

const NoticeContent = defineComponent({
  props: {
    importIndex: String,
  },
  setup(props) {
    const showErrorMsg = ref(false)

    const { data, execute, error } = useAxios('/driverServer/excel/getImportProgress', {
      data: {
        importIndex: props.importIndex,
      },
      transformResponse: transformResponsePush(data => data?.result),
    })

    const { pause } = useIntervalFn(execute, 3000)
    watch(error, (err) => {
      err && pause()
    })
    watch(data, (data) => {
      data.processedPercentage === 100 && pause()
    })

    return () => (
      <>
        {
          error.value
            ? '导入失败'
            : data.value?.processedPercentage !== 100
              ? <ElProgress percentage={data.value?.processedPercentage}/>
              : <div class="flex gap-2">
                  <ElTag type="success">新增：{data.value?.addCount}条</ElTag>
                  <ElTag>更新：{data.value?.upDateCount}条</ElTag>
                  <ElTag class="cursor-pointer" type="danger" onClick={() => showErrorMsg.value = true}>失败：{data.value?.failureCount}条</ElTag>
                </div>
        }
        <ElDrawer title="错误日志" v-model={showErrorMsg.value}>
          <ul class="flex flex-col gap-2 p-3">
            {data.value?.errorMsg.map((item: any) => <li>第{item.rows}行：{item.errorMsg}</li>)}
          </ul>
        </ElDrawer>
      </>
    )
  },
})

interface Options {
  title: string
}

export function uploadNotice(importIndex: string, options?: Options) {
  const { title = '导入进度' } = options || {}

  ElNotification({
    title,
    message: <NoticeContent
      importIndex={importIndex}
    />,
    duration: 0,
  })
}
