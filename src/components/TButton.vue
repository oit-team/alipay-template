<script setup lang="tsx">
import { ElButton } from 'element-plus'
import type { ButtonProps } from 'element-plus'

interface Props extends Partial<ButtonProps> {
  icon?: ButtonProps['icon']
}

const props = defineProps<Props>()

// 声明公共类型图标
const iconType: Record<string, string> = {
  // 添加
  add: 'i-material-symbols:add-circle',
  // 编辑
  edit: 'i-mdi:edit-circle',
  // 删除
  delete: '',
  // 导入
  import: 'i-raphael:import',
  // 导出
  export: '',
  // 申请
  apply: 'i-ic:baseline-add-task',
  // 授权
  authorize: 'i-mdi:user-check',
}

const isIconify = (icon: any) => {
  return typeof icon === 'string' && icon.startsWith('i-')
}

const IconRender = () => {
  const icon = iconType[props.icon as any] ?? props.icon

  return isIconify(icon)
    ? <div class={icon}></div>
    : icon
}
</script>

<script lang="tsx">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <ElButton v-bind="$attrs" class="t-button" link>
    <template v-if="props.icon" #icon>
      <IconRender />
    </template>
    <slot />
  </ElButton>
</template>

<style lang="scss">
.t-button {
  .el-icon {
    font-size: 1.1em;
  }
}
</style>
