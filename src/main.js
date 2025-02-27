// 导入createApp模块
// 作用：创建一个Vue的应用
import '@/common.css'
import { createApp } from 'vue'
// 组件：具备HTML+CSS+JS的一个HTML片段（Vue自己定义的一直组织html、css、js的一种文件格式）
// 作用：替代现有的html文件+css文件+js文件组织代码的方式
// 规范：.vue文件中有很多代码块，其中官方规定的有template、style、script代码块
// import App from './App.vue'
import App from './App.vue'

createApp(App).mount('#app')
