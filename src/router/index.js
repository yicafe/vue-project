// 从 vue-router 中引入 createRouter, createWebHashHistory 方法
import { createRouter, createWebHashHistory } from 'vue-router'
// 引入组件
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import register from '../views/register.vue'
import Profile from '../views/Profile.vue'
import Design from '../views/Design.vue'
import About from '../views/About.vue'
import PostList from '../views/PostList.vue'
import DropdownsSimple from '../views/DropdownsSimple.vue'
import SideMenu from '../components/SideMenu.vue'
import ModelViewer from '../components/ModelViewer.vue'
import shequgongyue from '../views/shequgongyue.vue'//社区公约
// 定义一个路由数组，统一管理路由
const routes = [
    {
        path: '/', // 路由地址：首页
        name: 'home', // 命名路由
        component: Home // 对应的组件
    },
    {
        path: '/login', // 登录页
        name: 'login',
        component: Login // 对应的组件
    },
    {
        path: '/register', // 注册页
        name: 'register',
        component: register // 对应的组件
    },
    {
        path: '/Profile', // 个人资料页
        name: 'Profile',
        component: Profile // 对应的组件
    },
    {
        path: '/Design', // 注册页
        name: 'Design',
        component: Design // 对应的组件
    },
    {
        path: '/About', // 注册页
        name: 'About',
        component: About // 对应的组件
    },
    {
        path: '/PostList', // 注册页
        name: 'PostList',
        component: PostList, // 对应的组件
    },
    {
        path: '/DropdownsSimple', // 注册页
        name: 'DropdownsSimple',
        component: DropdownsSimple // 对应的组件
    },
    {
        path: '/SideMenu', // 注册页
        name: 'SideMenu',
        component: SideMenu // 对应的组件
    },
    {
        path: '/ModelViewer', // 注册页
        name: 'ModelViewer',
        component: ModelViewer // 对应的组件
    },
    {
        path: '/shequgongyue', // 注册页
        name: 'shequgongyue',
        component: shequgongyue // 对应的组件
    },
    // ...
]

// 使用 createRouter 方法创建路由实例
const router = createRouter({
    history: createWebHashHistory(), // 指定 history 模式，这里采用的是 hash 模式
    routes // 定义路由数组，相当于 routes: routes 的简写模式
})


// ES6 模块导出语句，它用于将 router 对象导出，以便其他文件可以导入和使用这个对象
export default router
