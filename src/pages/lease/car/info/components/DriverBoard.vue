<script>
export default {
  name: 'DriverBoard',
}
</script>

<template>
  <div class="">
    <div class="font-bold text-lg text-center text-[#002060]">
      日司机分类看板
    </div>
    <div>
      <div>搜索栏</div>
      <div class="content">
        <!-- 单项 -->
        <div>
          <div class="w-1/3 flex justify-center items-center text-white bg-[#002060]">
            <div>A类</div>
            <div class="flex-1 flex">
              <div>
                UP司机：
                <span class="text-sm">流水>461.54</span>
              </div>
              <div>
                加盟司机：
                <span class="text-sm">流水>384.62</span>
              </div>
            </div>
          </div>
          <!-- 单项大盒子 -->
          <div class="border-2 border-[#002060] flex justify-center">
            <!-- 盒子里面的环比项 -->
            <div class="flex flex-col">
              <div>司机总数</div>
              <div>92</div>
              <div class="flex-1">
                <span>环比</span>
                <span>⬆9.52%</span>
                <span>同比</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
