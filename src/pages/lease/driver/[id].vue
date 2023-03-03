<script setup lang="ts">
import schema from './schema/form.json'

const route = useRoute()
const isNew = route.params.id === 'new'

const form = createForm({
  validateFirst: true,
})

async function submit(form: any) {
  await axios.post('/driverServer/driver/addDriverInfo', form)
}
</script>

<template>
  <Form :form="form" u-flex="~ col">
    <PageHeader :title="isNew ? '添加司机' : '编辑司机'" />
    <FormLayout
      u-mt="3"
      label-col="4"
      wrapper-col="16"
    >
      <UseSchemaField :schema="schema" />
    </FormLayout>
    <div class="mt-auto flex justify-center">
      <Submit @submit="submit">
        保存
      </Submit>
    </div>
  </Form>
</template>
