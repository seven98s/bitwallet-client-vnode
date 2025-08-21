# uniapp+vite+vue3+pinia+ts 框架

<a href='https://gitee.com/IT-bear/uniapp-framework/stargazers'><img src='https://gitee.com/IT-bear/uniapp-framework/badge/star.svg?theme=dark' alt='star'></img></a>

#### 介绍

- **uniapp Vue3 Vite pinia TypeScript scss TSX 基础框架**
- [开源地址](https://gitee.com/IT-bear/uniapp-framework)

#### 架构

- 技术栈采用了vue3+vite+TS+pinia+uview-plus
- 框架支持tsx、scss语法
- 配置了按需引入以及自动导入
- 配置了eslint和prettier代码规范，可根据自己喜好修改

#### 使用说明

- 推荐使用vscode进行开发;
- 框架完全基于 Vue3 `<script setup lang='ts'>` 写法,不支持 Vue2;
- 可用于学习与交流;
- 如发现问题或建议可在评论区留言, 看到会及时处理;
- 如有需求亦可在评论区留言,或在此项目基础上增加;

## 目录结构

```shell

├─ src
│ ├─api # 接口文件目录
│ ├─directives # 自定义指令
│ ├─components # 组件目录
│ ├─tsx # TSX组件目录
│ ├─pages # 页面
│ ├─static # 静态文件
│ ├─store # 状态管理（pinia）
│ │ ├─ modules # 数据模块
│ │ │ ├─user.ts
│ │ │ └─...
│ │ │
│ │ └─ index.ts #配置文件
│ ├─style # 全局样式
│ │
│ ├─utils # 工具类
│ │	└─ request.ts #网络请求拦截
│ └─config.ts #全局变量
│
└─ # 其他配置文件

```

## 安装使用

- 安装依赖

```bash
npm install
```

- 运行

```bash
# 其他端请查看 package.json
npm run dev:h5
```

- 打包

```bash
# 其他端请查看 package.json
npm run build:h5
```
