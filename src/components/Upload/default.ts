import { FileChunk } from '@/components/Upload'
import { useUserStore } from '@/store/user'

const fileTypes = {
  1: ['image/'],
  2: ['video/'],
}

interface UploadData {
  file: File
  [key: string]: any
}

export function transformRequest(data: UploadData) {
  const { profile } = useUserStore()
  const { file } = data
  const type = file.type

  for (const [key, types] of Object.entries(fileTypes)) {
    if (types.some(v => type.includes(v))) {
      data.fileType = key
      break
    }
  }

  data.fileType ??= 3

  if (file instanceof FileChunk) {
    Object.assign(data, {
      totalSize: file.raw.size,
      startPos: file.start,
      endPos: file.end,
      noThumb: file.end === file.raw.size ? 0 : 101,
    })
  }
  else {
    Object.assign(data, {
      totalSize: file.size,
    })
  }

  return {
    ...data,
    userId: profile?.userId,
    fname: file.name,
  }
}
