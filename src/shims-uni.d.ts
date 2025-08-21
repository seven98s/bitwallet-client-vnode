/// <reference types='@dcloudio/types' />
// import Vue from 'vue'
// declare module "vue/types/options" {
//   type Hooks = App.AppInstance & Page.PageInstance;
//   interface ComponentOptions<V extends Vue> extends Hooks {
//     /**
//      * 组件类型
//      */
//     mpType?: string;
//   }
// }
declare const uni: {
  [key: string]: any; // 简化声明，实际可根据需要补充具体API类型
  navigateTo: (options: any) => void;
  showToast: (options: any) => void;
  // 可根据使用的API补充其他声明
};