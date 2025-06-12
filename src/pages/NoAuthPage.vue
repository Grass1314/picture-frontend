
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="no-auth-container">
    <div class="error-content">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <h1 class="error-code">401</h1>
      <h2 class="error-message">抱歉，您没有访问权限</h2>
      <p class="error-desc">当前账号无权限访问此页面，请联系管理员或切换账号</p>
      <button class="back-btn" @click="router.push('/')">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.no-auth-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.error-content {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
}

.error-code {
  font-size: 72px;
  color: #ff4d4f;
  margin: 20px 0 10px;
  font-weight: 600;
}

.error-message {
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
}

.error-desc {
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.back-btn {
  padding: 10px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}
</style>
