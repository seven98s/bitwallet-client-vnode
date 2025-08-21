<template>
	<view class="page">
		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import PasswordPopup from "@/components/password/passwordPopup.vue";

export default Vue.extend({
	components: { PasswordPopup },
	data() {
		return {}
	},
	methods: {}
});
</script>

<style lang="scss" scoped>
	.page {
	}
</style>
