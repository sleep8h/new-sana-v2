<template>
	<view class="preview-container" v-if="visible" @click="handleClose">
		<view class="preview-mask"></view>
		<view class="preview-content">
			<img :src="imageUrl" alt="" />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ImagePreview',
		props: {
			// 控制预览框显示
			visible: {
				type: Boolean,
				default: false
			},
			// 预览图片地址
			imageUrl: {
				type: String,
				default: ''
			}
		},
		methods: {
			// 关闭预览
			handleClose() {
				this.$emit('update:visible', false);
				this.$emit('close');
			}
		}
	}
</script>

<style>
	.preview-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.preview-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
	}
	
	.preview-content {
		position: relative;
		z-index: 1;
		max-width: 50%;
		max-height: 50%;
	}
	
	.preview-content img {
		max-width: 100%;
		max-height: 90vh;
		object-fit: contain;
	}
</style> 