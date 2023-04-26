import type { ExtractPropTypes } from 'vue'
import type Upload from './Upload.vue'

export type UploadInstance = InstanceType<typeof Upload>
export type UploadProps = ExtractPropTypes<UploadInstance['$props']>

declare module 'element-plus' {
  interface UploadFile {
    type?: string
  }
}
