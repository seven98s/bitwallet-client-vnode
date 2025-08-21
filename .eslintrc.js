module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:@typescript-eslint/recommended','./.eslintrc-auto-import.json'],
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	plugins: ['vue', '@typescript-eslint'],
	globals: {
		uni: true,
		wx: true
	},
	rules: {
		'vue/multi-word-component-names': 'off',
		quotes: ['error', 'single'],
	},
};
