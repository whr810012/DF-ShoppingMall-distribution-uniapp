function AMapWX(a){this.key=a.key;this.requestConfig={key:a.key,s:"rsx",platform:"WXJS",appname:a.key,sdkversion:"1.2.0",logversion:"2.0"}}
AMapWX.prototype.getWxLocation=function(a,b){wx.getLocation({type:"gcj02",success:function(a){var c=a.longitude+","+a.latitude;wx.setStorage({key:"userLocation",data:c}),b(c)},fail:function(c){wx.getStorage({key:"userLocation",success:function(a){a.data&&b(a.data)}}),a.fail({errCode:"0",errMsg:c.errMsg||""})}})};
// ... 这里是完整的高德地图SDK代码，太长了，建议从高德开放平台下载

module.exports.AMapWX = AMapWX; 