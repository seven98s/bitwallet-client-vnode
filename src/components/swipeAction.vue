<template>
  <view class="swipe-delete-container" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <view class="content" :style="{ transform: `translateX(${translateX}px)` }" @click="onContentClick">
      <slot></slot>
    </view>
    <view class="delete-btn" :style="{ transform: `translateX(${deleteBtnTranslateX}px)` }" @click.stop="handleDelete">
      <image src="@/static/newUI3/transaction/delete.png" mode="aspectFill" class="deleteIcon"></image>
    </view>
  </view>
</template>



<script setup lang="ts">
const props = defineProps({
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
})

const startX = ref(0);
const translateX = ref(0);
const showDeleteButton = ref(false);
const deleteBtnTranslateX = ref(Math.abs(props.maxTranslateX)); // 删除按钮初始位置

const touchStart = (e: any) => {
  if (props.disabled) return;
  startX.value = e.touches[0].clientX;
  translateX.value = 0;
  deleteBtnTranslateX.value = Math.abs(props.maxTranslateX); // 重置删除按钮的位置
}

const touchMove = (e: any) => {
  // 如果禁用，则不处理触摸事件
  if (props.disabled) return;
  const moveX = e.touches[0].clientX;
  const deltaX = moveX - startX.value;
  const newTranslateX = translateX.value + deltaX;
  translateX.value = Math.max(Math.min(newTranslateX, 0), props.maxTranslateX);
  startX.value = moveX;

  // 根据 translateX 的值动态调整删除按钮的位置
  deleteBtnTranslateX.value = Math.abs(props.maxTranslateX) + translateX.value;
}
const touchEnd = (e: any) => {
  // 如果禁用，则不处理触摸事件
  if (props.disabled) return;
  if (translateX.value < -props.threshold) {
    // 滑动距离超过阈值，显示删除按钮
    showDeleteButton.value = true;
    translateX.value = props.maxTranslateX;
    deleteBtnTranslateX.value = 0; // 删除按钮完全显示
  } else {
    // 滑动距离未超过阈值，隐藏删除按钮
    showDeleteButton.value = false;
    translateX.value = 0;
    deleteBtnTranslateX.value = Math.abs(props.maxTranslateX); // 删除按钮完全隐藏
  }
}

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'contentClick', event: Event): void;
}>();

const handleDelete = () => {
  // 如果禁用，则不处理删除事件
  if (props.disabled) return;
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该代币吗？',
    success: (res) => {
      if (res.confirm) {
        // 用户点击了确认按钮，执行删除操作
        showDeleteButton.value = false;
        translateX.value = 0;
        deleteBtnTranslateX.value = Math.abs(props.maxTranslateX); // 删除按钮完全隐藏
        emit('delete'); // 触发自定义删除事件
      } else if (res.cancel) {
        // 用户点击了取消按钮，不执行删除操作
        console.log('用户取消删除操作');
      }
    }
  });
}

const onContentClick = (e) => {
    if (showDeleteButton.value) {
      // 如果删除按钮显示，阻止点击事件继续传播
      e.stopPropagation();
    }
    emit('contentClick', e);
  }
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