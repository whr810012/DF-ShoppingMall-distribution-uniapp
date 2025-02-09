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
export default {
  data() {
    return {
      orderList: [
        {
          id: 1,
          orderNo: 'DD20240315001',
          status: '配送中',
          fromAddress: '上海市黄浦区人民广场',
          toAddress: '上海市黄浦区豫园',
          toLatitude: 31.227401,
          toLongitude: 121.492479
        },
        {
          id: 2,
          orderNo: 'DD20240315002',
          status: '配送中',
          fromAddress: '上海市黄浦区人民广场',
          toAddress: '上海市静安区静安寺',
          toLatitude: 31.223426,
          toLongitude: 121.445867
        }
      ]
    }
  },
  methods: {
    goToMap(order) {
      uni.navigateTo({
        url: `/pages/map/map?orderId=${order.id}&toLatitude=${order.toLatitude}&toLongitude=${order.toLongitude}`
      })
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