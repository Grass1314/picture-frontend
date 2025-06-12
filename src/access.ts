import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStores.ts'
import { message } from 'ant-design-vue'

let firstFetchLoginUser = true

router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  // 确保刷新页面时，首次加载，能够等待后端返回登录用户信息后再校验权限
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
  }
  const toUrl = to.fullPath
  if (toUrl.startsWith('/admin')) {
    if (!loginUser || loginUser.userRole !== 'admin') {
      message.error('无权限访问')
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
  }
  next()
})
