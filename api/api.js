const BASE_URL = 'http://localhost:8080'

export const API = {
  // 骑手相关接口
  RIDER: {
    LOGIN: `${BASE_URL}/rider/login`,  // 登录接口
    QUERY: `${BASE_URL}/rider/query`,  // 查询接口 
    AMEND: `${BASE_URL}/rider/amend`,  // 更新位置接口
    ORDER: `${BASE_URL}/rider/order`  // 完成配送接口

  }
}

// 封装请求方法
export const request = async (options) => {
  try {
    const response = await uni.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      }
    })
    
    if (response.statusCode === 200) {
      const result = response.data
      if (result.code === 1) {
        return result
      } else {
        throw new Error(result.msg || '请求失败')
      }
    } else {
      throw new Error('网络请求失败')
    }
  } catch (error) {
    throw error
  }
} 