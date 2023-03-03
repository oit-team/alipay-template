<route lang="yaml">
meta:
  layout: 'null'
</route>

<script setup lang="tsx">
import { createForm } from '@formily/core'
import { connect, createSchemaField } from '@formily/vue'
import { Form, FormButtonGroup, FormItem, Input, Password, Submit } from '@formily/element-plus'
import { ElImage, ElInput } from 'element-plus'
import { useAxios } from '@vueuse/integrations/useAxios'
import axios from 'axios'
import { setToken } from '@/utils/auth'
import { encrypt } from '@/utils/crypto'

const router = useRouter()

const CheckCode = connect(
  defineComponent({
    setup(props, { attrs }) {
      const { data, execute } = useAxios('/system/login/checkCodeImg', {
        responseType: 'blob',
      })
      const img = computed(() => data.value ? window.URL.createObjectURL(data.value) : '')

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
  setToken(data.body.accessToken)
  router.push('/')
}
</script>

<template>
  <div class="grid place-content-center h-full">
    <ElCard class="w-400px">
      <Form :form="form" label-col="5">
        <SchemaField :schema="schema" />
        <FormButtonGroup align-form-item>
          <Submit @submit="onSubmit">
            登录
          </Submit>
        </FormButtonGroup>
      </Form>
    </ElCard>
  </div>
</template>
