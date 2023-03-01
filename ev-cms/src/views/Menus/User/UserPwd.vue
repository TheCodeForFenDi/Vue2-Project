<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>重置密码</span>
        </div>
        <!-- 表单 -->
        <el-form :model="pwdForm" :rules="pwdRules" ref="pwdRef" label-width="100px">
            <el-form-item label="原密码" prop="old_pwd">
                <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new_pwd">
                <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="re_pwd">
                <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitPwd">修改密码</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
     </el-card>
</template>

<script>
import { Message } from 'element-ui'
export default {
    name: 'UserPwd',
    data() {
        const diffPwd = (rule, value, callback)=>{
            if(value !== this.pwdForm.old_pwd){
                callback()
            } else {
                callback(new Error('新密码不能与旧密码相同'))
            }
        }
        const samePwd = (rule, value, callback)=>{
            if(value === this.pwdForm.new_pwd){
                callback()
            } else {
                callback(new Error('两次密码输入不一致'))
            }
        }
        return {
            // 表单数据对象
            pwdForm: {
                old_pwd: '',
                new_pwd: '',
                re_pwd: ''
            },
            // 表单验证规则对象
            pwdRules: {
                old_pwd: [
                    { required: true, message: '原始密码不能为空！！', trigger: 'blur' },
                ],
                new_pwd: [
                    { required: true, message: '新密码不能为空！！', trigger: 'blur' },
                    { pattern: /^\S{6,15}$/, message: "密码必须是 6~15位 的非空字符", trigger: 'blur' },
                    { validator: diffPwd, trigger: 'blur' }
                ],
                re_pwd: [
                    { required: true, message: '请再次确认新的密码！！', trigger: 'blur' },
                    { validator: samePwd, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitPwd(){
            // validate() 表单与校验
            this.$refs.pwdRef.validate(async valid=>{
                if(!valid) return
                const { data: res } = await this.$http.patch('/my/updatepwd', this.pwdForm)
                if(res.code === 0){
                    // 修改成功
                    Message.success(res.message)
                    // 清除 Token
                    localStorage.removeItem('token')
                    // 修改密码成功，跳转回登陆页面
                    this.$router.push('/login')
                } else {
                    Message.error(res.message)
                }
            })
        },
        reset(){
            // resetFields() 对表单内容进行重置（包括校验的提示信息）
            this.$refs.pwdRef.resetFields()
        }
    },
}
</script>

<style lang='less' scoped>
.el-form {
    width: 500px;
}
</style>