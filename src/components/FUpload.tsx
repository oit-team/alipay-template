import { connect, mapProps, useField } from '@formily/vue'
import { Upload } from './Upload'
import type { Field } from '@formily/core'
import type { UploadFile, UploadProps, UploadUserFile } from 'element-plus'
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
      type: [Object, String, Array] as PropType<UploadProps['fileList'] | string | string[]>,
    },
    format: {
      type: [String, Boolean] as PropType<'url' | false>,
      default: 'url',
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
    const isStringArray = (value?: any): value is string[] => {
      return Array.isArray(value) && value?.every(item => typeof item === 'string')
    }
    const fileListRef = ref<UploadFile[]>([])
    const fileListProvide = computed<UploadUserFile[]>(() => {
      return (
        props.format && (typeof props.fileList === 'string' || isStringArray(props.fileList))
          ? transformToUploadFiles(props.fileList)
          : props.fileList as UploadUserFile[]
      ) ?? []
    })
    const fileListFormated = computed(() => {
      return props.format
        ? transformUploadData(fileListRef.value, props.format)
        : fileListRef.value
    })

    const onChange = attrs.onChange as Fn
    const onError = attrs.onError as Fn

    watch(() => props.fileList, () => {
      fileListRef.value = fileListProvide.value as UploadFile[]
    }, { immediate: true })

    watch(fileListRef, (fileList) => {
      console.log(fileList)
      const successful = fileList?.every?.(file => file.status === 'success')
      if (successful) {
        fieldRef.value.feedbacks = []
        console.log(fileListFormated.value)
        onChange?.(fileListFormated.value)
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
      <Upload {...data} file-list={fileListRef} />
    )
  },
})

export const FUpload = connect(
  UploadWrapper,
  mapProps({ readOnly: 'readonly', value: 'fileList' }),
)

export default FUpload
