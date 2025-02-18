<template>
  <view class="orders-container">
    <view 
      class="order-item" 
      v-for="order in orderList" 
      :key="order.id"
      @tap="goToMap(order)"
    >
      <view class="order-header">
        <text class="order-no">订单号：{{order.id}}</text>
        <text class="order-status" :class="[getStatusClass(order.status)]">
          {{getStatusText(order.status)}}
        </text>
      </view>
      <view class="order-info">
        <view class="customer-info">
          <text class="name">{{order.name}}</text>
          <text class="phone">{{order.phone}}</text>
        </view>
        <view class="price">¥{{order.price}}</view>
      </view>
      <view class="order-address">
        <view class="to">
          <text class="label">送货地址：</text>
          <text>{{order.address}}</text>
        </view>
      </view>
      <view class="order-time">
        <text class="time">下单时间：{{order.createTime}}</text>
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
        url: `/pages/map/map?orderId=${order.id}&toLatitude=${order.lat}&toLongitude=${order.ing}`
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
        console.log(res);
        
        if (res.code === 1) {
          this.orderList = res.data|| []
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
    },
    getStatusText(status) {
      const statusMap = {
        0: '已取消',
        1: '已下单',
        2: '配送中',
        3: '已完成',
        4: '申请退款'
      }
      return statusMap[status] || '未知状态'
    },
    getStatusClass(status) {
      const classMap = {
        0: 'status-cancelled',
        1: 'status-ordered',
        2: 'status-delivering',
        3: 'status-completed',
        4: 'status-refunding'
      }
      return classMap[status] || ''
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
  font-size: 26rpx;
  font-weight: 600;
  padding: 6rpx 20rpx;
  border-radius: 100rpx;
}
.status-cancelled {
  color: #999999;
  background-color: #F5F5F5;
}
.status-ordered {
  color: #FF9500;
  background-color: rgba(255, 149, 0, 0.1);
}
.status-delivering {
  color: #007AFF;
  background-color: rgba(0, 122, 255, 0.1);
}
.status-completed {
  color: #34C759;
  background-color: rgba(52, 199, 89, 0.1);
}
.status-refunding {
  color: #FF3B30;
  background-color: rgba(255, 59, 48, 0.1);
}
.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f5f5f5;
}
.customer-info {
  display: flex;
  align-items: center;
}
.name {
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
}
.phone {
  font-size: 28rpx;
  color: #666;
}
.price {
  font-size: 32rpx;
  color: #FF3B30;
  font-weight: bold;
}
.order-time {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
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