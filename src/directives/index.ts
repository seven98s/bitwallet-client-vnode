/**
 * 配置文件
 */
import { App, DirectiveBinding } from 'vue';
import select from './selectdirective';

// 指令对象
const directives = {
	select,
};

export default {
	install(app: App) {
		Object.keys(directives).forEach((key) => {
			app.directive(key, directives[key] as (binding: DirectiveBinding) => void);
		});
	},
};
