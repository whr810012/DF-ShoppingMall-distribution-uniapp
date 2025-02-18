<template>
  <view class="orders-container">
    <view 
      class="order-item" 
      v-for="order in orderList" 
      :key="order.id"
      @tap="goToMap(order)"
    >
      <view class="order-header">
        <text class="order-no">订单号：{{order.orderNo}}</text>
        <text class="order-status">{{order.status}}</text>
      </view>
      <view class="order-address">
        <view class="from">
          <text class="label">取货地址：</text>
          <text>{{order.fromAddress}}</text>
        </view>
        <view class="to">
          <text class="label">送货地址：</text>
          <text>{{order.toAddress}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { API, request } from '@/api/api.js'
export default {
  data() {
    return {
      orderList: [],  // 改为空数组，将从接口获取数据
      userInfo: uni.getStorageSync('userInfo')
    }
  },
  // 添加生命周期钩子
  onShow() {
    this.fetchOrders()
  },
  methods: {
    goToMap(order) {
      uni.navigateTo({
        url: `/pages/map/map?orderId=${order.id}&toLatitude=${order.toLatitude}&toLongitude=${order.toLongitude}`
      })
    },
    // 添加获取订单列表的方法
    async fetchOrders() {
      try {
        console.log(this.userInfo);
        const res = await request({
          url: API.RIDER.QUERY + '?id=' + this.userInfo.id,
          method: 'GET'
        })
        
        if (res.statusCode === 200 && res.data.code === 0) {
          this.orderList = res.data.data
        } else {
          uni.showToast({
            title: '获取订单失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.orders-container {
  padding: 30rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}
.order-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s;
}
.order-item:active {
  transform: scale(0.98);
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f5f5f5;
}
.order-no {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
.order-status {
  color: #007AFF;
  font-size: 26rpx;
  font-weight: 600;
  background-color: rgba(0, 122, 255, 0.1);
  padding: 6rpx 20rpx;
  border-radius: 100rpx;
}
.order-address {
  font-size: 28rpx;
}
.from, .to {
  margin: 16rpx 0;
  display: flex;
  align-items: flex-start;
}
.label {
  color: #666;
  min-width: 140rpx;
  font-weight: 500;
}
.to {
  margin-top: 24rpx;
}
.to text:not(.label) {
  color: #333;
  flex: 1;
  line-height: 1.5;
}
</style> 