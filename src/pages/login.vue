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
import { useUserStore } from '@/store/user'

const router = useRouter()

const CheckCode = connect(
  defineComponent({
    setup(props, { attrs }) {
      const { data, execute } = useAxios('/system/login/checkCodeImg', {
        responseType: 'blob',
      })
      const img = useObjectUrl(data)

      return () => (
        <div class="flex w-full">
          <ElInput
            modelValue={attrs.value as any}
            onInput={attrs.onChange as any}
            placeholder="请输入验证码"
            class="flex-1 mr-2"
          />
          <ElImage src={img.value} class="h-40px" onClick={execute}/>
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
  const { clearUserProfile } = useUserStore()
  clearUserProfile()
  router.push('/')
}
</script>

<template>
  <div class="grid place-content-center w-full h-full">
    <div class="w-[60vw] min-w-[900px] h-[70vh] min-h-[500px] rounded-lg card-shadow">
      <div class="w-full h-full flex justify-between items-center">
        <div class="flex-1 h-full login border-r-1 border-[#e1e3da]" />
        <div class="w-1/2 px-24 m-4 box-border py-[5rem] rounded-lg">
          <div class="mb-4 text-[#456bdb] text-2xl w-full border-b-2 pb-4 border-[#456bdb] font-semibold">
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-shadow{
  box-shadow: 0 0 30px 0 #c3d3ea;
}
.login{
  width: 75%;
  height: 75%;
  background: center / cover no-repeat url("/image/login-bg.jpg");
}
.width-3_5{
  width: 60%;
}
:deep{
  .formily-element-plus-space-item{
    width: 100%;
  }
  .formily-element-plus-space-align-center{
    width: 100%;
  }
  .formily-element-plus-form-item-label-align-right > .formily-element-plus-form-item-label{
    display: none;
  }
  .el-button{
    height: 40px;
  }
  .el-input__inner{
    height: 40px;
  }
}
</style>
