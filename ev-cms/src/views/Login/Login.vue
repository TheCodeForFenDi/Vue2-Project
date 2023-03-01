<template>
    <div class="Login">
        <section>
            <h1>后台管理系统</h1>
            <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="demo-loginForm">
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        prefix-icon="el-icon-user-solid"
                        placeholder="用户名">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        v-model="loginForm.password"
                        placeholder="密码"
                        show-password
                        prefix-icon="el-icon-lock">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="button" type="primary" @click="submitForm('loginForm')">登录</el-button>
                </el-form-item>
                <el-link type="info" @click="$router.push('/Registered')">注册</el-link>
            </el-form>
        </section>
    </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: '',
            },
            loginRules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '请输入 1~10位 非空字符', trigger: 'blur' },
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    { pattern: /^\S{6,15}$/, message: "密码必须是 6~15位 的非空字符", trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName){
            this.$refs[formName].validate(async valid=>{
                if(!valid) return

                const { data: res } = await this.$http.post('/api/login', this.loginForm)
                console.log(res)
                if(res.code === 0){
                    Message.success(res.message)
                    // Token 存到本地
                    localStorage.setItem('token', res.token)
                    this.$router.push('/')
                } else {
                    Message.error(res.message)
                }
            })
        }
    },
}
</script>

<style lang='less' scoped>
    div.Login {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: url('../../assets/images/login_bg.jpg') center;
        background-size: cover;
        color: #FFF;
        section {
            padding: 15px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 350px;
            background-color: #FFF;
            border-radius: 5px;
            h1 {
                margin: 5px 0;
                font-family: 'Times New Roman', Times, serif;
                font-size: 30px;
                letter-spacing: 2px;
                text-align: center;
                color: #3979c2;
            }
            .demo-loginForm {
                display: flex;
                flex-direction: column;
                width: 80%;
                justify-content: center;
                .button {
                    width: 100%;
                    letter-spacing: 3px;
                    font-weight: 600;
                }
            }
        }
        .el-form-item {
            margin: 10px 0;
        }
        .el-link {
            max-width: 25px;
        }
    }
</style>