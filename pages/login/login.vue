<template>
  <view class="login-container">
    <view class="login-box">
      <image 
        class="logo" 
        src="https://tse1-mm.cn.bing.net/th/id/OIP-C.Prw2B2JeUWwuV7YrHoWmcQHaHa?rs=1&pid=ImgDetMain"
        mode="aspectFit"
      ></image>
      <input 
        class="input" 
        v-model="username" 
        type="text" 
        placeholder="请输入账号"
      />
      <input 
        class="input" 
        v-model="password" 
        type="password" 
        placeholder="请输入密码"
      />
      <button class="login-btn" @tap="handleLogin">登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  onLoad() {
    // 检查是否已经登录
    const token = uni.getStorageSync('token')
    if (token) {
      // 如果已登录，直接跳转到订单页
      uni.reLaunch({
        url: '/pages/orders/orders'
      })
    }
  },
  methods: {
    handleLogin() {
      if (!this.username || !this.password) {
        uni.showToast({
          title: '请输入账号和密码',
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({
        title: '登录中...'
      })
      
      // 模拟登录请求
      setTimeout(() => {
        // 登录成功后保存信息到本地
        const token = 'mock_token_' + Date.now() // 实际项目中应该是后端返回的token
        uni.setStorageSync('token', token)
        uni.setStorageSync('username', this.username)
        uni.setStorageSync('password', this.password)
        
        uni.hideLoading()
        uni.reLaunch({
          url: '/pages/orders/orders'
        })
      }, 1500)
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6e8efb 0%, #4a6ee0 100%);
  padding: 30rpx;
}

.login-box {
  width: 85%;
  padding: 40rpx;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 30rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.12);
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo {
  width: 160rpx;
  height: 160rpx;
  margin: 20rpx auto 60rpx;
  display: block;
  border-radius: 50%;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 6rpx solid rgba(255, 255, 255, 0.8);
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

.logo:active {
  transform: scale(0.92);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.input {
  width: 100%;
  height: 90rpx;
  margin-bottom: 30rpx;
  padding: 0 30rpx;
  border: 2rpx solid #eaeaea;
  border-radius: 16rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.input:focus {
  border-color: #4a6ee0;
  background-color: #ffffff;
  box-shadow: 0 0 0 2rpx rgba(74, 110, 224, 0.1);
}

.login-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background: linear-gradient(to right, #4a6ee0, #6e8efb);
  color: #fff;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 500;
  letter-spacing: 2rpx;
  transition: all 0.3s ease;
  border: none;
  margin-top: 20rpx;
}

.login-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style> 