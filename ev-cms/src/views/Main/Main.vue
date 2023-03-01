<template>
    <el-container class="main-container">
        <el-header>
            <img class="header-logo" src="../../assets/images/logo.png" alt="">
            <el-menu
                class="el-menu-top"
                mode='horizontal'
                background-color="#23262E"
                text-color="#FFF"
                active-text-color="#409EFF">
                <el-submenu index="1">
                    <template slot="title">
                        <img class="user-img" :src="userInfo.user_pic" alt="" v-if="userInfo.user_pic">
                        <img class="user-img" src="../../assets/logo.png" alt="" v-else>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
                    <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
                    <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
                </el-submenu>
                <el-menu-item index="2" @click="logout"><i class="el-icon-switch-button"></i>退出</el-menu-item>
            </el-menu>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <div class="user-box">
                    <img class="user-img" :src="userInfo.user_pic" alt="" v-if="userInfo.user_pic">
                    <img class="user-img" src="../../assets/logo.png" alt="" v-else>
                    <span>欢迎 {{userInfo.nickname || userInfo.username}}</span>
                </div>
                <el-menu
                    default-active="/home"                  
                    class="el-menu-vertical-demo"
                    background-color="#23262E"
                    text-color="#FFF"
                    active-text-color="#409EFF"
                    unique-opened
                    router>
                    <!-- template 不会构建结构，只能作为包裹元素，所有也不能给与 key 值，因为template是不存在的 -->
                    <!-- v-for 循环渲染 -->
                    <!-- 上方 router 属性 直接跳转 index="item.indexPath" 的路由入口 -->
                    <template v-for="item in menus">
                        <el-menu-item
                            :index="item.indexPath"
                            :key="item.indexPath"
                            v-if="item.children === null">
                            <i :class="item.icon"></i>
                                {{item.title}}
                            </el-menu-item>
                        <el-submenu :index="item.indexPath" :key="item.indexPath" v-else>
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span>{{item.title}}</span>
                            </template>
                                <!-- v-for 的双重循环 -->
                            <el-menu-item
                                :index="subItem.indexPath"
                                v-for="subItem in item.children"
                                :key="subItem.indexPath">
                                <i :class="subItem.icon"></i>
                                {{subItem.title}}
                            </el-menu-item>
                        </el-submenu>
                    </template>
                </el-menu>
            </el-aside>
            <el-container>
                <el-main>
                    <router-view></router-view>
                </el-main>
                <el-footer>@ www.FenDi.com - FenDi程序员</el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import { mapState } from 'vuex'
export default {
    name: 'Main',
    data() {
        return {
            menus: []
        }
    },
    // 触发 vuex 中的 action 里面的动作
    created() {
        this.$store.dispatch('getUserInfo')
        // 进入Main页面，初始化时调用 getMenus获取侧边导航数据
        this.getMenus()
    },
    computed: {
        // 获取数据
        ...mapState(['userInfo'])
    },
    methods: {
        // 退出登录按钮方法
        logout(){
            MessageBox.confirm('是否需要退出登录', {
                type: 'warning'
            }).then(()=>{                               /* 成功回调 ---> then */
                Message.success('成功退出')
                localStorage.removeItem('token')
                this.$router.push('/Login')
            }).catch(()=>{                              /* 失败回调 ---> catch */
                Message.info('取消退出')
            })
        },
        // 获取侧边导航的数据方法
        async getMenus(){
            const { data: res } = await this.$http.get('/my/menus')
            if(res.code === 0){
                this.menus = res.data                               /* 将侧边导航数据存入 this.menus 当中 */
            }
            console.log('进入Main页面，初始化时调用 getMenus获取侧边导航数据', res)
        }
    },
}
</script>

<style lang='less' scoped>
    .main-container {
        height: 100%;
        .el-header,
        .el-aside {
            background-color: #23262e;
        }
        .el-header {
            padding: 0;
            display: flex;
            justify-content: space-between;
        }
        .el-main {
            overflow-y: scroll;
            height: 0;
            background-color: #F2F2F2;
        }
        .el-footer {
            background-color: #eee;
            font-size: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .user-box {
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #000;
            user-select: none;
        }
        .user-img {
            width: 35px; height: 35px;
            border-radius: 50%;
            background-color: #fff;
            margin: 0 15px 0 0;
            object-fit: cover;
        }
        span {
            color: white;
            font-size: 12px;
        }

        .avatar {
            margin-right: 10px;
            object-fit: cover;
            border-radius: 50%;
            width: 35px; height: 35px;
            background-color: #FFF;
        }
    }
</style>