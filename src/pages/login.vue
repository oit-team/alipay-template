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
      'title': '用户名',
      'required': true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
      },
    },
    passWord: {
      'type': 'string',
      'title': '密码',
      'required': true,
      'x-decorator': 'FormItem',
      'x-component': 'Password',
      'x-component-props': {
      },
    },
    checkCode: {
      'type': 'string',
      'title': '验证码',
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
  <div class="grid place-content-center h-full ">
    <ElCard class="w-780px box-border login ">
      <div class="flex justify-between">
        <div class="h-full w-1/2" />
        <div class="h-[45vh] w-1/2 p-2 bg-white flex flex-col justify-center items-center">
          <div class="mb-4 text-[#4860be] text-3xl">
            浪 汛 车 行
          </div>
          <FormProvider :form="form">
            <FormLayout label-col="5">
              <SchemaField :schema="schema" />
              <FormButtonGroup align-form-item class="w-full">
                <Submit @submit="onSubmit">
                  登录
                </Submit>
              </FormButtonGroup>
            </FormLayout>
          </FormProvider>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.login{
  background: center / contain no-repeat url("../../public/image/login-bg.jpg");
}
</style>
