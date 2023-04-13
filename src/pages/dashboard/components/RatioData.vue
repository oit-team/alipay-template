<script setup lang="ts">
import RatioCard from './RatioCard.vue'
const ratioFormat = '0[.]00%'
const doubleFormat = '0[.]00'
const moneyFormat = '0,0[.]00'
</script>

<template>
  <div class="grid grid-cols-5 gap-3 p-3">
    <template
      v-for="item of [{
        prop: 'd1',
        title: '司机总数',
      }, {
        prop: 'd2',
        title: '当日新增',
      }, {
        prop: 'd3',
        title: '合规司机',
      }, {
        prop: 'd4',
        title: '合规率',
        valueFormat: ratioFormat,
      }, {
        prop: 'd5',
        title: '司机流水',
        valueFormat: moneyFormat,
      }, {
        prop: 'd6',
        title: '出车司机',
      }, {
        prop: 'd7',
        title: '活跃司机',
      }, {
        prop: 'd8',
        title: '出车率',
        valueFormat: ratioFormat,
      }, {
        prop: 'd9',
        title: '活跃率',
        valueFormat: ratioFormat,
      }, {
        prop: 'd10',
        title: '司机完单',
      }, {
        prop: 'd11',
        title: '人均出车时长',
        valueFormat: doubleFormat,
      }, {
        prop: 'd12',
        title: '人均服务时长',
        valueFormat: doubleFormat,
      }, {
        prop: 'd13',
        title: '人均高峰时长',
        valueFormat: doubleFormat,
      }, {
        prop: 'd14',
        title: '时长有效率',
        valueFormat: ratioFormat,
      }, {
        prop: 'd15',
        title: '人均流水',
        valueFormat: moneyFormat,
      }, {
        prop: 'd16',
        title: '订单均价',
        valueFormat: moneyFormat,
      }, {
        prop: 'd17',
        title: '人均完单',
        valueFormat: doubleFormat,
      }]"
      :key="item.prop"
    >
      <RatioCard
        :header="item.title"
        :ratio1="0.5"
        :ratio2="-0.5"
        :value="10"
        :value-format="item?.valueFormat"
      />
    </template>
  </div>
</template>
