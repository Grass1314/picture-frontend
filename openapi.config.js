import { generateService } from '@umijs/openapi'

generateService({
  // 引入地址
  requestLibPath: "import request from '@/request'",
  // 生成接口依据
  schemaPath: 'http://localhost:8123/api/v2/api-docs',
  serversPath: './src',
})
