<template>
	<view class="passwordPopupComponent" v-show="$props.show">
		<view class="mask">
		</view>
		<view class="popup" ref="popup">
			<view class="title">版本更新</view>
			
			<view class="module">
				<view class="left">
					版本号: 
				</view>
				<view class="right">
					{{ version.no }}
				</view>
			</view>
			
			<view class="module">
				<view class="left">
					更新内容: 
				</view>
				<view class="right">
					<view class="tab" v-for="(item, index) in version.content" :key="index">
						{{ item }}
					</view>
				</view>
			</view>
			
			<view class="progress" v-show="param.downloading">
				<progress :percent="param.progress" stroke-width="3" />
			</view>
			
			<view class="btn" v-show="!param.downloading">
				<view class="cancel" @click="close" v-if="!version.forceUpdate">
					不再提示
				</view>
				<view class="confirm" @click="confirm">
					立即更新
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import { VersionData } from '@/data/version/versionData';
import { UniUtil } from '@/data/util/uniUtil';

export default Vue.extend({
	props: {
		show: {
			type: Boolean,
			default: false
		},
		refresh: {
			type: Number,
			default: 0
		}
	},
	watch: {
		refresh: {
			deep: true,
			async handler() {
				await this.init();
			}
		}
	},
	data() {
		return {
			param: {
				downloading: false,
				progress: 0,
			},
			version: {
				no: '',
				content: new Array<string>(),
				forceUpdate: false,
				
				apkUrl: '',
				apkSize: 0,
				showDownLine: false,
				downloadNum: '',
			},
		}
	},
	async created() {
		await this.init();
	},
	methods: {
		async init() {
			await VersionData.load().then((rs: any) => {
				const { version, describe, forceUpdate, apkUrl, apkSize } = rs;
				this.version.no = version;
				this.version.content = describe;
				this.version.forceUpdate = forceUpdate;
				this.version.apkUrl = apkUrl;
				this.version.apkSize = apkSize * 1024;
			})
		},
		close() {
			if(!this.version.forceUpdate) {
				this.$emit('versionPopupshow', false);
				uni.showTabBar().catch((err: any) => {});
				VersionData.setIgnoreVersion(this.version.no);
			}
		},
		async confirm() {
			if (plus.os.name == "iOS") {
				plus.runtime.openURL("itms-apps://" +
					'itunes.apple.com/cn/app/wechat');
			} else if (plus.os.name == "Android") {
				uni.showToast({
					title: '开始下载...',
					icon: 'none'
				})
				
				// const apkSize: any = await new Promise(async (resolve,reject) => {
				// 	uni.getFileSystemManager().getFileInfo({
				// 		filePath: this.version.apkUrl,
				// 		success: function (info) {
				// 			resolve(info.size);
				// 		},
				// 		fail: function (error) {
				// 			console.error(error);
				// 		}
				// 	});
				// });

				// UniUtil.loadShow();
				const that = this;
				var dtask: any = plus.downloader.createDownload(this.version.apkUrl, {}, function(d: any, status: any) {
					console.log(d, status);
					that.close();
					// UniUtil.loadHide();
					uni.showTabBar().catch((err: any) => {});
					if (status == 200) {
						plus.runtime.install(
							plus.io.convertLocalFileSystemURL(d.filename), 
							{}, 
							function(error: any) {}
						)
					}
				})
				this.param.downloading = true;
				dtask.start()
				
				let timer = setInterval(() => {
					const temp: any = (dtask.downloadedSize / this.version.apkSize).toFixed(2)
					this.param.progress = Math.floor(temp * 100)

					if (temp >= 1) {
						clearInterval(timer)

						setTimeout(() => {
							plus.runtime.quit()
						}, 1000)
					}
				}, 18)
			}
		}
	}
});
</script>

<style lang="scss" scoped>
	.passwordPopupComponent {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 999 !important;
		.mask {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			background-color: rgba(0, 0, 0, .5);
		}
		
		.popup {
			width: 80%;

			background-color: white;
			position: fixed;
			top: 30%;
			left: 10%;

			border-radius: 20rpx;
			
			.title {
				text-align: center;
				padding: 30rpx;
				border-top-left-radius: 20rpx;
				border-top-right-radius: 20rpx;
				background-color: rgb(158 41 34);
				color: white;
				font-size: 35rpx;
			}
			.module {
				margin: 30rpx;
				display: flex;
				.left {
					flex: 1;
				}
				.right {
					flex: 2;
				}
			}
			.progress {
				margin: 30rpx;
			}
			.btn {
				display: flex;
				margin: 30rpx;
				.cancel, .confirm {
					flex: 1;
					text-align: center;
					border: 1px solid rgb(239 239 239);
					padding: 20rpx;
					color: white;
					border-radius: 10rpx;
				}
				.cancel {
					background-color: rgb(204 204 204);
				}
				.confirm {
					background-color: rgb(231 98 94);
					margin-left: 10rpx;
				}
			}
		}
	}
</style>