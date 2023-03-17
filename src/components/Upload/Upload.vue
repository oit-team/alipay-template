<script lang="ts" setup>
import { UploadAjaxError } from 'element-plus/es/components/upload/src/ajax'
import { AxiosError } from 'axios'
import { ElIcon } from 'element-plus'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { abort, upload } from './upload'
import type { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios'
import type { UploadProps as ElUploadProps, UploadFile, UploadFiles, UploadInstance, UploadRawFile, UploadRequestOptions } from 'element-plus'

interface UploadProps extends Partial<ElUploadProps> {
  chunkSize?: number
  transformRequest?: AxiosRequestTransformer
  transformResponse?: AxiosResponseTransformer
}

const props = defineProps<UploadProps>()
const uploadRef = ref<UploadInstance>()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

function httpRequest(options: UploadRequestOptions) {
  return upload({
    ...options,
    onError: (e) => {
      if (e instanceof AxiosError) {
        const err = new UploadAjaxError(
          e.message,
          e.status!,
          e.config!.method!,
          e.config!.url!,
        )
        abort(options.file)
        options.onError(err)
      }
      else {
        console.error(e)
      }
    },
    onProgress: (e) => {
      const evt = new ProgressEvent('progress', {
        loaded: e.loaded,
        total: e.total,
        lengthComputable: true,
      })
      options.onProgress?.(Object.assign(evt, {
        percent: Math.min((e.progress ?? 0) * 100, 100),
      }))
    },
    onSuccess: options.onSuccess,
    chunkSize: props.chunkSize,
    transformRequest: props.transformRequest,
    transformResponse: props.transformResponse,
  })
}

function onRemove(uploadFile: UploadFile, uploadFiles: UploadFiles) {
  uploadFile.raw && abort(uploadFile.raw)
  return props.onRemove?.(uploadFile, uploadFiles)
}

function handlePictureCardPreview(file: UploadFile) {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const keys = ['handleRemove', 'handleStart', 'clearFiles', 'submit'] as const

const exposes = keys.reduce((cur, next) => {
  // @ts-ignore
  cur[next] = (...args) => uploadRef.value?.[next](...args)
  return cur
}, {} as Pick<UploadInstance, typeof keys[number]>)

function handleRemove(file: UploadFile | UploadRawFile, rawFile?: UploadRawFile) {
  uploadRef.value?.handleRemove(file, rawFile)
}

defineExpose({
  abort,
  ...exposes,
})
</script>

<template>
  <ElUpload
    v-bind="$attrs"
    ref="uploadRef"
    v-model:file-list="fileList"
    class="vc-upload"
    :http-request="httpRequest"
    :on-remove="onRemove"
  >
    <slot v-if="$attrs['list-type'] === 'picture-card'">
      <ElIcon><Plus /></ElIcon>
    </slot>

    <template #file="{ file }">
      <div>
        <img alt="" class="el-upload-list__item-thumbnail" :src="file.url">
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <ElIcon><ZoomIn /></ElIcon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <ElIcon><Delete /></ElIcon>
          </span>
        </span>
      </div>
    </template>
  </ElUpload>
</template>

<style lang="scss">
.vc-upload {
  .el-upload-list--picture-card {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .el-upload-list__item {
      margin: 0;
    }
  }
}
</style>
