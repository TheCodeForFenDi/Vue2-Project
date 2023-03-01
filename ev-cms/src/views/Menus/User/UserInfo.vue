<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>基本资料</span>
        </div>
        <el-form :model='userForm' :rules='userRules' ref='userRef' label-width='100px'>
            <el-form-item label='登录名称' prop='username'>
                <el-input v-model='userForm.username' disabled></el-input>
            </el-form-item>
            <el-form-item label='用户昵称' prop='nickname'>
                <el-input v-model='userForm.nickname'></el-input>
            </el-form-item>
            <el-form-item label='用户邮箱' prop='email'>
                <el-input v-model='userForm.email'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="submit">提交修改</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { mapState } from 'vuex'
import { Message } from 'element-ui'
export default {
    name: 'UserInfo',
    data() {
        return {
            userForm: {
                username: '',
                nickname: '',
                email: '',
            },
            userRules: {
                nickname: [
                    { required: true, message: '用户昵称不能为空！！', trigger: 'blur' },
                    { pattern: /^\S{1,10}$/, message: '请输入 1~10位 非空字符', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '用户邮箱不能为空！！', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确！！', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        // this.userForm.username = this.userInfo.username
        // this.userForm.nickname = this.userInfo.nickname
        // this.userForm.email = this.userInfo.email
        // this.userForm = this.userInfo
        // 浅拷贝, 通过 Object.assign(a, b) 把数据拷贝一份，
        // userInfo 是vuex中的全局数据，如果不浅拷贝一份的话，v-model双向绑定会直接修改vuex中的全局数据，容易出错
        this.userForm = Object.assign({}, this.userInfo)
        // console.log('执行了基本信息组件的 create')
    },
    computed: {
        ...mapState(['userInfo'])
    },
    // 监听 组件/全局 的数据变化，userInfo是异步请求来的数据，异步比同步执行慢，
    watch: {
        userInfo(){
            // 浅拷贝, 通过 Object.assign(a, b) 把数据拷贝一份，
            // userInfo 是vuex中的全局数据，如果不浅拷贝一份的话，v-model双向绑定会直接修改vuex中的全局数据，容易出错
            this.userForm = Object.assign({}, this.userInfo)
        }
    },
    methods: {
        reset(){
            // resetFields() 对表单内容进行重置（包括校验的提示信息）
            this.$refs.userRef.resetFields()
            this.userForm = Object.assign({}, this.userInfo)
        },
        submit(){
            // validate() 表单预校验
            this.$refs.userRef.validate(async valid=>{
                if(!valid) return
                const { data: res } = await this.$http.put('/my/userinfo', this.userForm)
                if(res.code === 0){
                    Message.success(res.message)
                    // 调用用户信息的接口，刷新信息
                    this.$store.dispatch('getUserInfo')
                } else{
                    Message.error(res.message)

                }
            })
        }
    },
}
</script>

<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>