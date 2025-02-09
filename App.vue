<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 提前向用户发起位置权限请求
			uni.authorize({
				scope: 'scope.userLocation',
				success() {
					console.log('位置权限授权成功')
				},
				fail() {
					console.log('位置权限授权失败')
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
