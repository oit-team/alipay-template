import { connect, mapProps, useField } from '@formily/vue'
import { Upload } from './Upload'
import type { Field } from '@formily/core'
import type { UploadFile, UploadProps } from 'element-plus'

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
      type: Array as PropType<UploadProps['fileList']>,
    },
  },
  emits: ['change'],
  setup(props, { attrs, emit }) {
    const fieldRef = useField<Field>()
    const setFeedBack = (error?: Error) => {
      const message = props.errorAdaptor(error)

      fieldRef.value.setFeedback({
        type: 'error',
        code: 'UploadError',
        messages: message ? [message] : [],
      })
    }

    watch(() => props.fileList, (fileList) => {
      const successful = fileList?.every(file => file.status === 'success')
      if (successful)
        fieldRef.value.feedbacks = []
      else
        setFeedBack(new Error('请等待文件上传完成'))
    }, { deep: true })

    type Fn = (...args: any[]) => any

    const data = {
      ...attrs,
      fileList: props.fileList,
      onChange(file: UploadFile, fileList: UploadFile[]) {
        (attrs.onChange as Fn)?.(file, fileList)
        emit('change', fileList)
      },
      onRemove(file: UploadFile, fileList: UploadFile[]) {
        (attrs.onRemove as Fn)?.(file, fileList)
        emit('change', fileList)
      },
      onError(error: Error, file: UploadFile, fileList: UploadFile[]) {
        (attrs.onError as Fn)?.(error, file, fileList)
        setFeedBack(error)
      },
    }

    return () => (
      <Upload {...data} />
    )
  },
})

export const FUpload = connect(
  UploadWrapper,
  mapProps({ readOnly: 'readonly', value: 'fileList' }),
)

export default FUpload
