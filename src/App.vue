<template>
  <div id="app">
    <a-config-provider :locale="appLocale">
      <BasicLayout />
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { healthUsingGet} from '@/api/mainController.ts'
// 引入 ant-design-vue 的中文语言包
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
// 引入 dayjs 的中文语言包
import 'dayjs/locale/zh-cn';

// 设置 dayjs 默认语言为中文
dayjs.locale('zh-cn');

// 使用 Composition API 和 setup 函数定义响应式数据
const appLocale = zhCN; // 设置当前应用的语言环境

healthUsingGet().then(response => {
  console.log(response)
})
</script>

<style scoped></style>
