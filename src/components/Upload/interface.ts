import type Upload from './Upload.vue'
// import type { UploadFile } from 'element-plus'

export type UploadInstance = InstanceType<typeof Upload>

declare module 'element-plus' {
  interface UploadFile {
    type?: string
  }
}
