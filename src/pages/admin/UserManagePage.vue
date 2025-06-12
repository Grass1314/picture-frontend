<template>
  <div id="userManagePage">
    <!-- 搜索表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" allow-clear />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="输入用户名" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <!-- 可编辑字段 -->
        <template v-if="column.editable">
          <div>
            <a-input
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              style="margin: -5px 0"
            />
            <template v-else>
              <template v-if="column.dataIndex === 'userAvatar'">
                <a-image :src="record.userAvatar" :width="120" />
              </template>
              <template v-else-if="column.dataIndex === 'userRole'">
                <a-tag :color="record.userRole === 'admin' ? 'green' : 'blue'">
                  {{ record.userRole === 'admin' ? '管理员' : '普通用户' }}
                </a-tag>
              </template>
              <template v-else>
                {{ record[column.dataIndex] }}
              </template>
            </template>
          </div>
        </template>

        <!-- 操作列 -->
        <template v-else-if="column.key === 'action'">
          <div class="editable-row-operations" style="display: flex; align-items: center">
            <div style="display: flex; margin-right: 8px">
              <span v-if="editableData[record.id]">
                <a-button type="primary" @click="save(record.id)" size="small">保存</a-button>
                <a-button @click="cancel(record.id)" size="small" style="margin-left: 8px"
                  >取消</a-button
                >
              </span>
              <span v-else>
                <a-button @click="edit(record.id)" size="small">编辑</a-button>
              </span>
            </div>
            <a-button danger @click="doDelete(record.id)" size="small"> 删除 </a-button>
          </div>
        </template>

        <!-- 非可编辑字段保持原样 -->
        <template v-else>
          <template v-if="column.dataIndex === 'createTime'">
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  listUserByPageUsingPost,
  deleteUserUsingDelete,
  updateUserUsingPut,
} from '@/api/userController.ts'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    editable: true,
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
    editable: true,
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
    editable: true,
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    editable: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    width: '220px'
  },
]

// 定义数据
const dataList = ref<API.UserVo[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'ascend',
})

// 获取数据
const fetchData = async () => {
  const res = await listUserByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 编辑状态管理
const editableData = ref<Record<number, API.UserVo>>({})

// 编辑记录
const edit = (id: number) => {
  const record = dataList.value.find((item) => item.id === id)
  if (record) {
    editableData.value[id] = { ...record }
  }
}

// 保存编辑
const save = async (id: number) => {
  try {
    const editingData = editableData.value[id]
    if (!editingData) return

    // 构造更新请求参数
    const updateParams: API.UserUpdateRequest = {
      id: editingData.id,
      userName: editingData.userName,
      userAvatar: editingData.userAvatar,
      userProfile: editingData.userProfile,
      userRole: editingData.userRole,
    }

    // 调用更新接口
    const res = await updateUserUsingPut(updateParams)

    if (res.data.code === 0) {
      message.success('更新成功')

      // 更新本地数据
      const index = dataList.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        dataList.value[index] = { ...editingData }
      }

      // 退出编辑模式
      delete editableData.value[id]
    } else {
      message.error('更新失败：' + res.data.message)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    message.error('请求失败')
  }
}

// 取消编辑
const cancel = (id: number) => {
  delete editableData.value[id]
}

// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})

// 表格变化之后，重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 搜索数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

// 删除数据
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingDelete({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    await fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>

<style scoped>
.editable-row-operations {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

/* 确保按钮垂直对齐 */
.editable-row-operations .ant-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px; /* 统一高度 */
}
</style>
