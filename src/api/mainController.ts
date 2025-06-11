// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** health GET /api/api/health */
export async function healthUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/api/health', {
    method: 'GET',
    ...(options || {}),
  })
}
