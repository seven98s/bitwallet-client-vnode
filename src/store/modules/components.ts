import { defineStore } from 'pinia';
export const componentsStore = defineStore('componStore', () => {
	//相当于data
	const count = ref(0);

	//相当于action
	function increment() {
		//不需要this，直接调用
		count.value++;
	}

	//最后返回需要导出的内容
	return { count, increment };
});
