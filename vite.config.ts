import { UserConfig } from 'vite';
// jsx语法
import vueJsx from '@vitejs/plugin-vue-jsx';
import config from './src/config';
// 自动导入vue中hook reactive ref等
import AutoImport from 'unplugin-auto-import/vite';
//自动导入ui-组件
import Components from 'unplugin-vue-components/vite';
import uni from '@dcloudio/vite-plugin-uni';

export default (): UserConfig => {
	return {
		base: '/',
		plugins: [
			uni(),
			vueJsx(),
			Components({
				//自定义的模块
				dirs: ['src/components'],
				extensions: ['vue', 'ts'],
				resolvers: [], //自动导入的ui库
			}),
			AutoImport({
				// 插件进行自动导入相关的依赖库
				//组件中不用再导入ref，reactive等
				imports: ['vue', 'vue-router'],
				// 可选，用于自动导入组件类型
				dts: 'src/components.d.ts',
				// 解决eslint报错
				eslintrc: {
					// 这里先设置成true然后npm run dev 运行之后会生成 .eslintrc-auto-import.json 文件之后，在改为false
					enabled: false,
					filepath: './.eslintrc-auto-import.json', // 生成的文件路径
					globalsPropValue: true,
				},
			}),
		],
		// server: {
		// 	open: false,
		// 	// 端口号
		// 	port: 5173,
		// 	// 本地代理
		// 	proxy: {
		// 		'/adm': {
		// 			target: 'http://127.0.0.1:8082/api',
		// 			changeOrigin: true,
		// 			rewrite: (path: string) => path.replace(/^\/adm/, ''),
		// 		},
		// 	},
		// },
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@import "@/style/index.scss";', //引入全局样式
				},
			},
		},
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					// 生产环境去除log语句和DBUG
					drop_console: true,
					drop_debugger: true,
				},
			},
		},
	};
};
