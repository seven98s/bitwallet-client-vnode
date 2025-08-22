<template>
  <view class="swipe-delete-container" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <view class="content" :style="{ transform: `translateX(${translateX}px)` }" @click="onContentClick">
      <slot ></slot>
    </view>
    <view class="delete-btn" :style="{ transform: `translateX(${deleteBtnTranslateX}px)` }"
          @click.stop="handleDelete">
      <image src="@/static/newUI3/transaction/delete.png" mode="aspectFill" class="deleteIcon"></image>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    threshold: {
      type: Number,
      default: 10
    },
    maxTranslateX: {
      type: Number,
      default: -80
    },
    // 新增 disabled props
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      startX: 0,
      translateX: 0,
      showDeleteButton: false,
      deleteBtnTranslateX: 80 // 删除按钮初始位置，完全隐藏
    };
  },
  methods: {
    touchStart(e) {
      // 如果禁用，则不处理触摸事件
      if (this.disabled) return;
      this.startX = e.touches[0].clientX;
      this.translateX = 0;
      this.deleteBtnTranslateX = Math.abs(this.maxTranslateX); // 重置删除按钮的位置
    },
    touchMove(e) {
      // 如果禁用，则不处理触摸事件
      if (this.disabled) return;
      const moveX = e.touches[0].clientX;
      const deltaX = moveX - this.startX;
      const newTranslateX = this.translateX + deltaX;
      this.translateX = Math.max(Math.min(newTranslateX, 0), this.maxTranslateX);
      this.startX = moveX;

      // 根据 translateX 的值动态调整删除按钮的位置
      this.deleteBtnTranslateX = Math.abs(this.maxTranslateX) + this.translateX;
    },
    touchEnd(e) {
      // 如果禁用，则不处理触摸事件
      if (this.disabled) return;
      if (this.translateX < -this.threshold) {
        // 滑动距离超过阈值，显示删除按钮
        this.showDeleteButton = true;
        this.translateX = this.maxTranslateX;
        this.deleteBtnTranslateX = 0; // 删除按钮完全显示
      } else {
        // 滑动距离未超过阈值，隐藏删除按钮
        this.showDeleteButton = false;
        this.translateX = 0;
        this.deleteBtnTranslateX = Math.abs(this.maxTranslateX); // 删除按钮完全隐藏
      }
    },
    handleDelete() {
      // 如果禁用，则不处理删除事件
      if (this.disabled) return;
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该代币吗？',
        success: (res) => {
          if (res.confirm) {
            // 用户点击了确认按钮，执行删除操作
            this.showDeleteButton = false;
            this.translateX = 0;
            this.deleteBtnTranslateX = Math.abs(this.maxTranslateX); // 删除按钮完全隐藏
            this.$emit('delete'); // 触发自定义删除事件
          } else if (res.cancel) {
            // 用户点击了取消按钮，不执行删除操作
            console.log('用户取消删除操作');
          }
        }
      });
    },
    onContentClick(e) {
      if (this.showDeleteButton) {
        // 如果删除按钮显示，阻止点击事件继续传播
        e.stopPropagation();
      }
      this.$emit('contentClick', e);
    }
  }
};
</script>

<style scoped>
.swipe-delete-container {
  position: relative;
  overflow: hidden;
}

.content {
  background-color: #fff;
  transition: transform 0.5s;
  /* 平滑过渡效果 */
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 140rpx;
  /* 根据需要调整宽度 */
  height: 100%;
  background: #9D120F;
  /* 删除按钮背景颜色 */
  color: white;
  /* 文字颜色 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  /* 添加 z-index 样式，确保显示在最上层 */
  transition: transform 0.5s;
  /* 平滑过渡效果 */
}

.deleteIcon {
  display: block;
  width: 44rpx;
  height: 49rpx;
}
</style>