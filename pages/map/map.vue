<template>
  <view class="map-container">
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
      }
    }
  },
  onLoad(options) {
    this.orderId = options.orderId
    this.toLatitude = parseFloat(options.toLatitude)
    this.toLongitude = parseFloat(options.toLongitude)
    console.log('目的地坐标：', this.toLatitude, this.toLongitude)
    
    // 直接尝试获取位置，不再检查权限
    this.getLocation()
    
    // 设置标记点
    this.setMarkers()
    
    // 规划路线
    this.planRoute()
  },
  methods: {
    getLocation() {
      uni.showLoading({
        title: '定位中...'
      })
      
      // 直接尝试获取位置
      uni.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        highAccuracyExpireTime: 3000,
        success: (res) => {
          console.log('获取位置成功：', res)
          this.currentLatitude = res.latitude
          this.currentLongitude = res.longitude
          this.setMarkers()
          this.planRoute()
        },
        fail: (err) => {
          console.error('获取位置失败：', err)
          // 获取失败时显示提示并使用默认位置
          uni.showModal({
            title: '提示',
            content: '无法获取您的位置，是否开启定位权限？',
            success: (res) => {
              if (res.confirm) {
                // 打开设置页面
                uni.openSetting({
                  success: (settingRes) => {
                    console.log('打开设置页面成功', settingRes)
                    if (settingRes.authSetting['scope.userLocation']) {
                      // 如果用户在设置页面打开了定位权限，重新获取位置
                      this.getLocation()
                    } else {
                      this.useDefaultLocation()
                    }
                  },
                  fail: () => {
                    this.useDefaultLocation()
                  }
                })
              } else {
                this.useDefaultLocation()
              }
            }
          })
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    },

    useDefaultLocation() {
      uni.showToast({
        title: '使用默认位置',
        icon: 'none',
        duration: 2000
      })
      // 使用默认位置（上海人民广场）
      this.currentLatitude = 31.233706
      this.currentLongitude = 121.472644
      this.setMarkers()
      this.planRoute()
    },

    setMarkers() {
      this.markers = [
        {
          id: 1,
          latitude: this.currentLatitude,
          longitude: this.currentLongitude,
          width: 35,
          height: 35,
          anchor: {x: 0.5, y: 0.5},
          callout: {
            content: '当前位置',
            color: '#ffffff',
            fontSize: 14,
            borderRadius: 4,
            bgColor: '#1989fa',
            padding: 8,
            display: 'ALWAYS',
            textAlign: 'center',
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        },
        {
          id: 2,
          latitude: this.toLatitude,
          longitude: this.toLongitude,
          width: 35,
          height: 35,
          anchor: {x: 0.5, y: 0.5},
          callout: {
            content: '配送目的地',
            color: '#ffffff',
            fontSize: 14,
            borderRadius: 4,
            bgColor: '#ff6b6b',
            padding: 8,
            display: 'ALWAYS',
            textAlign: 'center',
            borderWidth: 2,
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
          
          // 显示预计时间和距离
          const duration = Math.ceil(routeData.paths[0].duration / 60) // 转换为分钟
          const distance = (routeData.paths[0].distance / 1000).toFixed(1) // 转换为公里
          
          uni.showToast({
            title: `预计${duration}分钟，${distance}公里`,
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
</style> 