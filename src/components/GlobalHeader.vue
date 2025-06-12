<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <div class="title">小草云图库</div>
          </div>
        </router-link>
      </a-col>

      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>

      <a-col flex="120px">
        <div class="user-login-status">
          <div class="user-login-status">
            <div v-if="loginUserStore.loginUser.id">
              <a-dropdown>
                <a-space>
                  <a-avatar src="loginUserStore.loginUser.userAvatar" />
                  {{ loginUserStore.loginUser.userName ?? '无名' }}
                </a-space>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1">
                      <EditOutlined />
                      个人中心
                    </a-menu-item>
                    <a-menu-item key="2" @click="doLoginOut">
                      <LogoutOutlined />
                      退出登录
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <div v-else>
              <a-button type="primary" href="/user/login">登录</a-button>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { HomeOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStores.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'
import checkAccess from '@/access/checkAccess.ts'
import ACCESS_ENUM from '@/access/accessEnum.ts'

const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()
const current = ref<string[]>([])
const router = useRouter()

// 菜单项
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
    meta: {
      access: ACCESS_ENUM.ADMIN, // 管理员权限
      hideInMenu:  false, // 隐藏菜单
    },
  },
  {
    key: '/about',
    label: '关于',
    title: '关于',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    title: '编程导航',
  },
]

// 过滤掉无权限的菜单
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    // 无权限则返回 false，则不保留该菜单
    const item = menuToRouteItem(menu);
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单，有权限则返回 true，则保留该菜单
    return checkAccess(loginUserStore.loginUser, item.meta?.access as string);
  })
}

// 实现 menu 到路由 item 的转化
const menuToRouteItem = (menu) => {
  return {
    key: menu.key,
    icon: menu.icon,
    label: menu.label,
    title: menu.title,
    meta: {
      access: menu.meta?.access,
      hideInMenu: menu.meta?.hideInMenu,
    },
    children: menu.children?.map(menuToRouteItem),
  }
}

// 展示在菜单的路由数组
const items = computed<MenuProps['items']>(() => filterMenus(originItems))

// 路由跳转事件
const doMenuClick = ({ key }) => {
  router.push({ path: key }).catch((err) => {
    console.error('路由跳转失败:', err)
  })
}

// 退出登录
const doLoginOut = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push({
      path: '/user/login',
    })
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}

// 回调钩子 当前要高亮的菜单项
router.afterEach((to, from, next) => {
  current.value = [to.path]
})
</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
