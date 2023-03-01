<template>
    <div class="Registered">
        <section>
            <h1>后台管理系统</h1>
            <el-form :model="regForm" ref="regRef" :rules="regRules" class="demo-regForm">
                <el-form-item prop="username">
                    <el-input
                        v-model="regForm.username"
                        placeholder="用户名"
                        prefix-icon="el-icon-user-solid">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        v-model="regForm.password"
                        placeholder="密码"
                        show-password
                        prefix-icon="el-icon-lock">
                    </el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input
                        type="repassword"
                        v-model="regForm.repassword"
                        placeholder="确认密码"
                        show-password
                        prefix-icon="el-icon-lock">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="button" type="primary" @click="submitForm">注册</el-button>
                </el-form-item>
                <el-link type="info" @click="$router.push('/Login')">登录</el-link>
            </el-form>
        </section>
    </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
    name: 'Registered',
    data() {
        const samePwd = (rule, value, callback) => {
            if(value === this.regForm.password) callback()
            else {
                callback(new Error('两次密码输入不一致'))
            }
        }
        return {
            regForm: {
                username: '',
                password: '',
                repassword: '',
            },
            // regRules 规则对象
            regRules: {
                // 要验证的表单绑定数据：[ { 校验规则 } ], [ { 校验规则 } ]
                    // trigger ---> 触发事件
                    // pattern ---> 正则格式验证 [范围]{长度}
                    // \S 非空字符串
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '请输入 1~10位 英文或数字', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { pattern: /^\S{6,15}$/, message: "密码必须是 6~15位 的非空字符", trigger: 'blur' }
                ],
                // validator 自定义校验规则
                repassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { pattern: /^\S{6,15}$/, message: '密码必须是6~15位的非空字符', trigger: 'blur' },
                    { validator: samePwd, trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        submitForm() {
            // 1. 表单预校验
            this.$refs.regRef.validate(async valid => {
                if (!valid) return

                // res 后端返回的结果
                const { data: res } = await this.$http.post('/api/reg', this.regForm)
                console.log(res)
                if(res.code === 0){
                    // 注册成功信息提示
                    Message.success(res.message)
                    this.$router.push('/Login')
                } else {
                    // 之策失败信息提示
                    Message.error(res.message)
                }
            })
        }
    }
}
</script>

<style lang='less' scoped>
    div.Registered {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: url('../../assets/images/login_bg.jpg') center;
        background-size: cover;
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
            .demo-regForm {
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
        .el-form-item:last-child {
            margin: 0;
        }
        .el-link {
            max-width: 25px;
        }
    }
</style>