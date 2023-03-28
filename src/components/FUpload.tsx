import { connect, mapProps, useField } from '@formily/vue'
import { autorun } from '@formily/reactive'
import { Upload } from './Upload'
import type { Field } from '@formily/core'
import type { UploadFile, UploadProps } from 'element-plus'
import { transformToUploadFiles, transformUploadData } from '@/utils/actions'

const UploadWrapper = defineComponent({
  name: 'FUpload',
  inheritAttrs: false,
  props: {
    textContent: {
      type: String,
      default: '',
    },
    errorAdaptor: {
      type: Function,
      default(error?: ErrorEvent) {
        return error?.message || ''
      },
    },
    fileList: {
      type: [String, Array] as PropType<UploadProps['fileList'] | string | string[]>,
    },
    format: String as PropType<'url'>,
  },
  emits: ['change'],
  setup(props, { attrs, emit }) {
    const fieldRef = useField<Field>()
    const fileListRef = ref<UploadFile[]>()

    const setFeedBack = (error?: Error) => {
      const message = props.errorAdaptor(error)

      fieldRef.value.setFeedback({
        type: 'error',
        code: 'UploadError',
        messages: message ? [message] : [],
      })
    }

    const fileListFormated = computed(() => {
      return props.format
        ? transformUploadData(fileListRef.value!, props.format)
        : fileListRef.value
    })

    autorun(() => {
      fileListRef.value = props.format
        ? transformToUploadFiles(fieldRef.value.initialValue) as UploadFile[]
        : fieldRef.value.initialValue
    })

    const onChange = attrs.onChange as Fn
    const onError = attrs.onError as Fn

    watch(fileListRef, (fileList) => {
      const successful = fileList?.every?.(file => file.status === 'success')
      if (successful) {
        fieldRef.value.feedbacks = []
        onChange?.(fileListFormated.value)
        emit('change', fileListFormated.value)
      }
      else {
        setFeedBack(new Error('请等待文件上传完成'))
      }
    }, { deep: true })

    type Fn = (...args: any[]) => any

    const data = {
      ...attrs,
      onChange(file: UploadFile, fileList: UploadFile[]) {
        fileListRef.value = fileList
      },
      onRemove(file: UploadFile, fileList: UploadFile[]) {
        fileListRef.value = fileList
      },
      onError(error: Error, file: UploadFile, fileList: UploadFile[]) {
        fileListRef.value = fileList
        onError?.(error, file, fileList)
        setFeedBack(error)
      },
    }

    return () => (
      <Upload {...data} file-list={fileListRef.value} />
    )
  },
})

export const FUpload = connect(
  UploadWrapper,
  mapProps({ readOnly: 'readonly', value: 'fileList' }),
)

export default FUpload
