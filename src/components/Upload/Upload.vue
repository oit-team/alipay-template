<script lang="ts" setup>
import { UploadAjaxError } from 'element-plus/es/components/upload/src/ajax'
import { AxiosError } from 'axios'
import { ElIcon } from 'element-plus'
import { Check, Delete, Document, Plus } from '@element-plus/icons-vue'
import mime from 'mime'
import { abort, upload } from './upload'
import { transformRequest } from './default'
import type { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios'
import type { UploadProps as ElUploadProps, UploadFile, UploadFiles, UploadInstance, UploadRawFile, UploadRequestOptions } from 'element-plus'

interface UploadProps extends Partial<ElUploadProps> {
  fileList?: ElUploadProps['fileList']
  action?: ElUploadProps['action']
  listType?: ElUploadProps['listType']
  limit?: ElUploadProps['limit']
  chunkSize?: number
  transformRequest?: AxiosRequestTransformer
  transformResponse?: AxiosResponseTransformer
}

const props = withDefaults(defineProps<UploadProps>(), {
  listType: 'picture-card',
  action: '/system/file/uploadFile',
  chunkSize: 1024 * 5,
  limit: 9,
  transformRequest: () => transformRequest,
})
const emit = defineEmits(['update:fileList'])
const fileList = useVModel(props, 'fileList', emit)
const uploadRef = ref<UploadInstance>()

function httpRequest(options: UploadRequestOptions) {
  return upload({
    ...options,
    onError: (e) => {
      abort(options.file)
      if (e instanceof AxiosError) {
        const err = new UploadAjaxError(
          e.message,
          e.status!,
          e.config!.method!,
          e.config!.url!,
        )
        options.onError(err)
      }
      else {
        options.onError(e as any)
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

function getFileType(file: UploadFile) {
  return file.type
  || file.raw?.type
  || (file.raw?.name && mime.getType(file.raw.name))
  || (file.url && mime.getType(file.url))
}

function matchType(file: UploadFile, type: string) {
  const fileType = getFileType(file)
  return fileType && fileType.startsWith(type)
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

// TODO: 预览
// function handlePictureCardPreview(file: UploadFile) {
// }

// TODO: 上传前处理
// function handleBeforeUpload(rawFile: UploadRawFile) {
// }

onMounted(() => {
  const instance = getCurrentInstance()
  const el = instance?.proxy?.$el as HTMLElement
  // 超出上传数据限制时隐藏上传按钮
  if (props.listType === 'picture-card') {
    const uploadCard = el?.querySelector('.el-upload--picture-card') as HTMLElement
    watch(() => props.fileList?.length, async (fileCount) => {
      if (!uploadCard)
        return
      uploadCard.style.display = fileCount! >= props.limit ? 'none' : ''
    }, { immediate: true })
  }
})

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
    :action="action"
    class="vc-upload"
    :http-request="httpRequest"
    :limit="limit"
    :list-type="listType"
    :on-remove="onRemove"
  >
    <slot>
      <template v-if="listType === 'picture-card'">
        <ElIcon>
          <Plus />
        </ElIcon>
      </template>
    </slot>
    <template #file="{ file }">
      <slot v-bind="{ file }" name="file" />

      <template v-if="listType === 'picture-card'">
        <template v-if="matchType(file, 'image')">
          <img alt="" class="el-upload-list__item-thumbnail" :src="file.url">
        </template>
        <template v-else>
          <ElIcon size="50">
            <Document />
          </ElIcon>
          <div class="el-upload-list__item-file-name">
            {{ file.name }}
          </div>
        </template>
        <div v-if="file.status === 'success'" class="el-upload-list__item-status-label">
          <ElIcon class="el-icon--upload-success el-icon--check">
            <Check />
          </ElIcon>
        </div>
        <ElProgress
          v-if="file.status === 'uploading'"
          :percentage="Number(file.percentage)"
          :show-text="false"
          :stroke-width="6"
          style="top: 92%;"
        />
        <span class="el-upload-list__item-actions">
          <!-- <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <ElIcon><ZoomIn /></ElIcon>
            </span> -->
          <span
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <ElIcon><Delete /></ElIcon>
          </span>
        </span>
      </template>
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
      display: inline-grid;
      justify-items: center;
      place-content: center;
      gap: 10px;
      margin: 0;
    }

    .el-upload-list__item-file-name {
      width: 90%;
    }
  }
}
</style>
