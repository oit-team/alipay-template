<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { encrypt } from '@/utils/crypto'

const emit = defineEmits(['logout'])

const showDrawer = ref(false)

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  oldPassWord: '',
  newPassWord: '',
  checkPass: '',
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  }
  else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value)
        return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '')
    callback(new Error('请再次输入新密码'))

  else if (value !== ruleForm.newPassWord)
    callback(new Error('两次输入不一致！'))

  else
    callback()
}

const rules = reactive<FormRules>({
  newPassWord: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  oldPassWord: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
})

const open = () => {
  showDrawer.value = true
}

// 修改密码
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl)
    return
  formEl.validate(async (valid) => {
    if (valid) {
      await ElMessageBox.confirm('确定修改吗', '提示')
      const { oldPassWord, newPassWord } = ruleForm

      await axios.post('/system/user/updatePassWord', {
        oldPassWord: encrypt(oldPassWord),
        newPassWord: encrypt(newPassWord),
      })

      ElMessage.success('修改成功,请重新登录')
      showDrawer.value = false
      emit('logout')
    }
    else {
      ElMessage.error('失败')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl)
    return
  formEl.resetFields()
}

defineExpose({
  open,
})
</script>

<template>
  <ElDrawer
    v-model="showDrawer"
    direction="rtl"
    title="修改密码"
  >
    <div class="h-full flex flex-col p-4 justify-between box-border">
      <ElForm
        ref="ruleFormRef"
        class="demo-ruleForm"
        :hide-required-asterisk="true"
        label-width="80px"
        :model="ruleForm"
        :rules="rules"
        status-icon
      >
        <ElFormItem label="旧密码" prop="oldPassWord">
          <ElInput v-model.number="ruleForm.oldPassWord" type="password" />
        </ElFormItem>
        <ElFormItem label="新密码" prop="newPassWord">
          <ElInput v-model="ruleForm.newPassWord" autocomplete="off" type="password" />
        </ElFormItem>
        <ElFormItem label="确认密码" prop="checkPass">
          <ElInput
            v-model="ruleForm.checkPass"
            autocomplete="off"
            type="password"
          />
        </ElFormItem>
        <ElFormItem>
          <ElButton
            type="primary"
            @click="submitForm(ruleFormRef)"
          >
            确认
          </ElButton>
          <ElButton @click="resetForm(ruleFormRef)">
            重置
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </ElDrawer>
</template>

<style lang="scss" scoped>

</style>
