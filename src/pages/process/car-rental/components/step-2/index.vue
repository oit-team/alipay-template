<template>
  <div class="flex flex-col gap-2 p-2">
    <PageHeader title="租车申请">
      <template #extra>
        <ElButton type="danger">
          拒绝
        </ElButton>
        <ElButton type="primary">
          通过
        </ElButton>
      </template>
    </PageHeader>

    <ElCard header="基本信息">
      <Descriptions
        border
        column="4"
        :data="[]"
        label-width="130px"
        :options="[
          { label: '司机姓名', prop: '' },
          { label: '手机号', prop: '' },
          { label: '身份证号', prop: '' },
          { label: '居住地址', prop: '' },
          { label: '租赁城市', prop: '' },
          { label: '车牌号', prop: '' },
          { label: '车架号', prop: '' },
          { label: '品牌车系车型', prop: '' },
          { label: '车务姓名', prop: '' },
          { label: '租入到期日', prop: '' },
          { label: '司服姓名', prop: '' },
          { label: '方案编号', prop: '' },
          { label: '方案编名称', prop: '' },
          { label: '方案编类型', prop: '' },
          { label: '活动名称', prop: '' },
          { label: '销售姓名', prop: '' },
          { label: '申请时间', prop: '' },
        ]"
      />
    </ElCard>

    <ElCard header="租赁信息">
      <Descriptions
        border
        column="4"
        :data="[]"
        label-width="130px"
        :options="[
          { label: '品牌车系车型', prop: '' },
          { label: '租期（月）', prop: '' },
          { label: '押金（元）', prop: '' },
          { label: '车龄（年）', prop: '' },
          { label: '里程（km）', prop: '' },
          { label: '租期（月）', prop: '' },
          { label: '原月租（元）', prop: '' },
          { label: '优惠月租（元）', prop: '' },
          { label: '押金（元）', prop: '' },
          { label: '起租日期', prop: '' },
          { label: '原终止日期', prop: '' },
          { label: '终止日期', prop: '' },
          { label: '备注', prop: '' },
        ]"
      />
    </ElCard>

    <ElCard header="账单信息">
      <QueryTable
        :columns="[
          { label: '期数', prop: '' },
          { label: '账期', prop: '' },
          { label: '月租', prop: '' },
          { label: '备注', prop: '' },
        ]"
        :data="[]"
      />
    </ElCard>
  </div>
</template>

<style scoped>
.el-card {
  --el-card-padding: 0;
}

:deep(.el-card__header) {
  --el-card-padding: 12px;
}
</style>
