<route lang="yaml">
meta:
  layout: 'null'
  noAuth: true
</route>

<script setup lang="tsx">
import { connect, createSchemaField } from '@formily/vue'
import { ElImage, ElInput } from 'element-plus'
import { FormItem, Input, Password } from '@formily/element-plus'
import { setToken } from '@/utils/auth'
import { encrypt } from '@/utils/crypto'

const router = useRouter()

const CheckCode = connect(
  defineComponent({
    setup(props, { attrs }) {
      const { data, execute } = useAxios('/system/login/checkCodeImg', {
        responseType: 'blob',
      })
      const img = useObjectUrl(data)

      return () => (
        <div class="flex">
          <ElInput
            modelValue={attrs.value as any}
            onInput={attrs.onChange as any}
            placeholder="请输入验证码"
            class="flex-1 mr-2"
          />
          <ElImage src={img.value} class="h-30px" onClick={execute}/>
        </div>
      )
    },
  }),
)

const form = createForm({
  validateFirst: true,
})

const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
    Password,
    CheckCode,
  },
})

const schema = {
  type: 'object',
  properties: {
    userName: {
      'type': 'string',
      'required': true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '用户名',
      },
    },
    passWord: {
      'type': 'string',
      'required': true,
      'x-decorator': 'FormItem',
      'x-component': 'Password',
      'x-component-props': {
        placeholder: '密码',
      },
    },
    checkCode: {
      'type': 'string',
      'required': true,
      'x-decorator': 'FormItem',
      'x-component': 'CheckCode',
      'x-component-props': {
      },
    },
  },
}

const onSubmit = async (form: any) => {
  const { data } = await axios.post('/system/login/userLogin', {
    ...form,
    passWord: encrypt(form.passWord),
  })
  setToken(data.accessToken)
  router.push('/')
}
</script>

<template>
  <div class="grid place-content-center h-full login">
    <ElCard class="w-350px p-8 rounded-lg">
      <div class="mb-4 text-[#6083cb] text-xl text-center w-full">
        浪汛汽车租赁系统
      </div>
      <div class="border-red border-bottom h-1" />
      <FormProvider :form="form">
        <FormLayout label-col="0">
          <SchemaField :schema="schema" />
          <FormButtonGroup align-form-item class="w-full">
            <Submit class="w-full" @submit="onSubmit">
              登录
            </Submit>
          </FormButtonGroup>
        </FormLayout>
      </FormProvider>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.login{
  background: center / cover no-repeat url("../../public/image/login-bg.jpg");
}

.formily-element-plus-space-item{
  width: 100%;
}
.formily-element-plus-space-align-center{
  width: 100%;
}
.formily-element-plus-form-item-label-align-right > .formily-element-plus-form-item-label{
  display: none;
}
</style>
