const KEY = 'ffdbb001fd0b4cc024456334e9aa6567'
const BASE_URL = 'https://restapi.amap.com/v4/direction/bicycling'

function getBicyclingRoute(origin, destination) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}?key=${KEY}&origin=${origin}&destination=${destination}`,
      method: 'GET',
      success: (res) => {
        if (res.data.errcode === 0) {
          resolve(res.data.data)
        } else {
          reject(new Error(res.data.errmsg))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

module.exports = {
  getBicyclingRoute
} 