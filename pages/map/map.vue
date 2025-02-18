<template>
  <view class="map-container">
    <view class="info-panel">
      <view class="info-text">预计配送时间：{{duration}}分钟</view>
      <view class="info-text">配送距离：{{distance}}公里</view>
      <view class="info-text">预计送达：{{estimatedArrivalTime}}</view>
    </view>
    
    <map
      id="deliveryMap"
      class="map"
      :latitude="currentLatitude"
      :longitude="currentLongitude"
      :markers="markers"
      :polyline="polyline"
      scale="14"
      show-location
      enable-rotate
      enable-satellite
      enable-traffic
    ></map>
    <view class="bottom-bar">
      <button class="complete-btn" @tap="completeDelivery">完成配送</button>
    </view>
  </view>
</template>

<script>
import { API, request } from '@/api/api.js'
const amapUtils = require('../../utils/amap.js')

export default {
  data() {
    return {
      currentLatitude: 31.233706,
      currentLongitude: 121.472644,
      toLatitude: 0,
      toLongitude: 0,
      markers: [],
      polyline: [],
      orderId: '',
      routeColor: '#1989fa',
      routeWidth: 6,
      polylineStyle: {
        arrowLine: true,
        borderWidth: 2,
        borderColor: '#fff',
        dottedLine: false
      },
      duration: 0,
      distance: 0,
      estimatedArrivalTime: '--:--',
      markerIcons: {
        start: '/static/images/marker-start.svg',
        end: '/static/images/marker-end.svg'
      },
      locationRefreshInterval: null,
    }
  },
  
  // 删除 mounted 钩子，改用 onLoad
  onLoad(options) {
    // 通过 options 获取页面参数
    this.orderId = options.orderId
    this.toLatitude = parseFloat(options.toLatitude)
    this.toLongitude = parseFloat(options.toLongitude)
    console.log('目的地坐标：', this.toLatitude, this.toLongitude)
    
    // 获取位置
    this.getLocation()
    
    // 设置标记点
    this.setMarkers()
    
    // 规划路线
    this.planRoute()
    
    // 开始定时刷新位置
    this.startLocationRefresh()
  },
  
  // 添加 onUnload 生命周期函数来清理定时器
  onUnload() {
    if (this.locationRefreshInterval) {
      clearInterval(this.locationRefreshInterval)
    }
  },

  methods: {
    getLocation() {
      uni.showLoading({
        title: '定位中...'
      })
      
      uni.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        highAccuracyExpireTime: 3000,
        success: async (res) => {
          console.log('获取位置成功：', res)
          this.currentLatitude = res.latitude
          this.currentLongitude = res.longitude
          this.setMarkers()
          this.planRoute()
          
          // 调用接口更新骑手位置
          try {
            const response = await request({
              url: API.RIDER.AMEND,
              method: 'POST',
              data: {
                id: uni.getStorageSync('userInfo').id,
                lng: res.longitude.toString(),
                lat: res.latitude.toString()
              }
            })
            
            if (response.statusCode === 200) {
              console.log('位置更新成功')
            } else {
              console.error('位置更新失败:', response)
            }
          } catch (error) {
            console.error('位置更新请求失败:', error)
          }
        },
        fail: (err) => {
          console.error('获取位置失败：', err)
          uni.showModal({
            title: '提示',
            content: '无法获取您的位置，是否开启定位权限？',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting({
                  success: (settingRes) => {
                    console.log('打开设置页面成功', settingRes)
                    if (settingRes.authSetting['scope.userLocation']) {
                      // 如果用户在设置页面打开了定位权限，重新获取位置
                      this.getLocation()
                    } else {
                      // 如果用户没有开启权限，继续尝试获取位置
                      setTimeout(() => {
                        this.getLocation()
                      }, 1000)
                    }
                  },
                  fail: () => {
                    // 打开设置页面失败，继续尝试获取位置
                    setTimeout(() => {
                      this.getLocation()
                    }, 1000)
                  }
                })
              } else {
                // 用户取消，继续尝试获取位置
                setTimeout(() => {
                  this.getLocation()
                }, 1000)
              }
            }
          })
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    },

    setMarkers() {
      this.markers = [
        {
          id: 1,
          latitude: this.currentLatitude,
          longitude: this.currentLongitude,
          width: 40,
          height: 40,
          iconPath: this.markerIcons.start,
          anchor: {x: 0.5, y: 1},
          callout: {
            content: '当前位置',
            color: '#333333',
            fontSize: 14,
            borderRadius: 4,
            bgColor: '#ffffff',
            padding: 8,
            display: 'BYCLICK',
            textAlign: 'center',
            borderWidth: 0,
            borderColor: '#ffffff'
          }
        },
        {
          id: 2,
          latitude: this.toLatitude,
          longitude: this.toLongitude,
          width: 40,
          height: 40,
          iconPath: this.markerIcons.end,
          anchor: {x: 0.5, y: 1},
          callout: {
            content: '配送目的地',
            color: '#333333',
            fontSize: 14,
            borderRadius: 4,
            bgColor: '#ffffff',
            padding: 8,
            display: 'BYCLICK',
            textAlign: 'center',
            borderWidth: 0,
            borderColor: '#ffffff'
          }
        }
      ]
    },
    async planRoute() {
      uni.showLoading({
        title: '规划路线中...'
      })
      
      try {
        const origin = `${this.currentLongitude},${this.currentLatitude}`
        const destination = `${this.toLongitude},${this.toLatitude}`
        
        const routeData = await amapUtils.getBicyclingRoute(origin, destination)
        console.log('路线规划成功：', routeData)
        
        if (routeData.paths && routeData.paths.length > 0) {
          let points = []
          const steps = routeData.paths[0].steps
          
          steps.forEach(step => {
            const polylinePoints = step.polyline.split(';')
            polylinePoints.forEach(point => {
              const [longitude, latitude] = point.split(',')
              points.push({
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude)
              })
            })
          })
          
          this.polyline = [{
            points,
            color: this.routeColor,
            width: this.routeWidth,
            arrowLine: this.polylineStyle.arrowLine,
            borderWidth: this.polylineStyle.borderWidth,
            borderColor: this.polylineStyle.borderColor,
            dottedLine: this.polylineStyle.dottedLine
          }]
          
          this.adjustMapScale(points)
          
          // 更新持续时间和距离到 data
          this.duration = Math.ceil(routeData.paths[0].duration / 60)
          this.distance = (routeData.paths[0].distance / 1000).toFixed(1)
          
          // 计算预计送达时间
          const now = new Date()
          const arrivalTime = new Date(now.getTime() + routeData.paths[0].duration * 1000)
          this.estimatedArrivalTime = `${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`
          
          uni.showToast({
            title: `预计${this.duration}分钟，${this.distance}公里`,
            icon: 'none',
            duration: 3000
          })
        }
      } catch (err) {
        console.error('路线规划失败：', err)
        uni.showToast({
          title: '路线规划失败，请重试',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    completeDelivery() {
      uni.showModal({
        title: '确认完成',
        content: '确认已完成配送？',
        success: (res) => {
          if (res.confirm) {
            // 这里添加完成配送的接口调用
            uni.showToast({
              title: '配送完成',
              success: () => {
                setTimeout(() => {
                  uni.navigateBack()
                }, 1500)
              }
            })
          }
        }
      })
    },
    adjustMapScale(points) {
      if (points && points.length > 0) {
        let minLat = points[0].latitude
        let maxLat = points[0].latitude
        let minLng = points[0].longitude
        let maxLng = points[0].longitude
        
        points.forEach(point => {
          minLat = Math.min(minLat, point.latitude)
          maxLat = Math.max(maxLat, point.latitude)
          minLng = Math.min(minLng, point.longitude)
          maxLng = Math.max(maxLng, point.longitude)
        })
        
        const mapContext = uni.createMapContext('deliveryMap')
        if (mapContext) {
          mapContext.includePoints({
            points: [
              { latitude: minLat, longitude: minLng },
              { latitude: maxLat, longitude: maxLng }
            ],
            padding: [50, 50, 50, 50]
          })
        }
      }
    },
    startLocationRefresh() {
      // 初始化时先获取一次位置
      this.getCurrentLocation()
      
      // 设置3分钟定时器
      this.locationRefreshInterval = setInterval(() => {
        this.getCurrentLocation()
      }, 3 * 60 * 1000) // 3分钟转换为毫秒
    },
    
    // 更新 getCurrentLocation 方法
    getCurrentLocation() {
      this.getLocation() // 直接调用 getLocation 方法，因为已经包含了位置更新的逻辑
    }
  }
}
</script>

<style scoped>
.map-container {
  height: 100vh;
  position: relative;
}
.map {
  width: 100%;
  height: calc(100vh - 120rpx);
}
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
}
.complete-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 10rpx;
}
.info-panel {
  position: fixed;
  top: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20rpx 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 300rpx;
}

.info-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  text-align: center;
  white-space: nowrap;
}
</style> 