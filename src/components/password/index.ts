import Vue from 'vue';

const PasswordPopup = function(options = {}) {
	console.log(options)
	Vue.prototype.$store.commit('changePasswordPopConfig', options)
	console.log(Vue.prototype.$store.state.passwordPopConfig.show)
	// return new Promise<string>((resolve,reject)=>{
		// uni.navigateTo({  
		// 	url: '/components/password/passwordPopup'
		// });
		
		//  // #ifdef H5  
		// let MessageConstructor = Vue.extend(Message)
		// let instance = new MessageConstructor({
		// 	data: options,
		// 	methods: {
		// 		confirm(value: string) {
		// 			console.log(value);
		// 			resolve(value);
		// 		}
		// 	}
		// })
		
		// document.body.appendChild(instance.$mount().$el);
		// // #endif  
	// })

}

export default PasswordPopup;
