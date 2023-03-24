import type Upload from './Upload.vue'

export type UploadInstance = InstanceType<typeof Upload>

declare module 'element-plus' {
  interface UploadFile {
    type?: string
  }
}
