<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import schema from './schema/list.json'
import { useUserStore } from '@/store/user'
import { getCityList, useSelectAsyncDataSource, vehicleServiceList } from '@/reactions'

const { t } = useI18n()

const queryRef = ref()

async function onDelete(row: any) {
  await ElMessageBox.confirm('要删除该车辆吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/vehicle/vehicle/deleteVehicle', { vehicleId: row.vehicleId })
  await queryRef.value?.query()
  ElMessage.success(t('handle.success'))
}

const columns = [
  {
    prop: 'licensePlateNumber',
    label: '车牌号',
  },
  {
    prop: 'vehicleFrameNumber',
    label: '车架号',
  },
  {
    prop: 'vehicleModel',
    label: '品牌车系车型',
  },
  {
    prop: 'bodyColor',
    label: '车身颜色',
  },
  {
    prop: 'vehicleState',
    label: '车辆状态',
  },
  {
    prop: 'city',
    label: '所属城市',
  },
  {
    prop: 'vehicleService',
    label: '车务',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'updateTime',
    label: '更新时间',
  },
]
const columnsConfig = {
  licensePlateNumber: {
    width: 150,
    showOverflowTooltip: true,
  },
  vehicleModel: {
    width: 200,
    showOverflowTooltip: true,
  },
  vehicleFrameNumber: {
    width: 150,
    showOverflowTooltip: true,
  },
  bodyColor: {
    width: 100,
    showOverflowTooltip: true,
  },
  vehicleService: {
    width: 200,
    showOverflowTooltip: true,
  },
  city: {
    width: 100,
    showOverflowTooltip: true,
  },
  vehicleState: {
    width: 100,
    showOverflowTooltip: true,
  },
  createTime: {
    width: 200,
    showOverflowTooltip: true,
  },
  updateTime: {
    width: 200,
    showOverflowTooltip: true,
  },
}

const { files, open } = useFileDialog()

const importType = ref(0)
// function importYun() {
//   open({ multiple: false })
//   importType.value = 0
// }
function importCar() {
  open({ multiple: false })
  importType.value = 1
}
function importWei() {
  open({ multiple: false })
  importType.value = 2
}
const url = ref('')

const errDrawer = ref(false)
const errObj = ref()

watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  switch (importType.value) {
    // case 0:
    //   url.value = '/vehicle/vehicle/addT3OperationalData'
    //   break
    case 1:
      url.value = '/vehicle/vehicle/addImportReplenishVehicle'
      break
    case 2:
      url.value = '/vehicle/vehicle/addImportIllegal'
      break
    default:
      url.value = ''
      break
  }

  axios.post(url.value, {
    file: value[0],
    userId: profile?.userId,
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((res) => {
      ElMessage.success(t('import.success'))
      if (res.data.errorStr.length > 0) {
        errDrawer.value = true
        errObj.value = res.data
      }
    })
    .catch((err) => {
      ElMessageBox.alert(err.message, '警告', {
        type: 'warning',
      })
    })
})
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="columnsConfig"
      :key-map="{ data: 'vehicleList', total: 'count' }"
      :schema="schema"
      url="/vehicle/vehicle/getVehicleList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm :scope="{ useSelectAsyncDataSource, getCityList, vehicleServiceList }" />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push(`./car/new`)">
            {{ $t('button.new') }}
          </ElButton>
          <!-- <ElButton type="info" @click="importYun">
            {{ $t('button.import') }}运营流水
          </ElButton> -->
          <ElButton type="info" @click="importCar">
            {{ $t('button.import') }}车辆信息
          </ElButton>
          <ElButton type="info" @click="importWei">
            {{ $t('button.import') }}违章信息
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="180px">
              <ElButton size="small" type="info" @click="$router.push(`./car/info/${row.vehicleId}`)">
                {{ $t('button.info') }}
              </ElButton>
              <ElButton size="small" type="primary" @click="$router.push(`./car/${row.vehicleId}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton size="small" type="danger" @click="onDelete(row)">
                {{ $t('button.delete') }}
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
    <ElDrawer v-model="errDrawer" direction="rtl">
      <div class="demo-drawer__content p-3">
        <h3 v-if="errObj.addCount">
          {{ errObj.addCount }}
        </h3>
        <h3 v-if="errObj.failureCount">
          {{ errObj.failureCount }}
        </h3>
        <h3 v-if="errObj.upDateCount">
          {{ errObj.upDateCount }}
        </h3>
        <h3 class="mb-2">
          失败数据如下:
        </h3>
        <div class="errDataBox" style="text-align:left;">
          <div v-for="(item, index) in errObj.errorStr" :key="index" class="mb-2">
            {{ item }}
          </div>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>
