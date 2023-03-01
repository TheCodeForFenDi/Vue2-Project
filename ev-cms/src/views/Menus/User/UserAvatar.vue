<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>更换头像</span>
        </div>
        <div>
            <img src="../../../assets/images/avatar.jpg" alt="" class="preview" v-if="avatar==''">
            <img :src="avatar" alt="" class="preview" v-else>
            <div class="btn-box">
                <!-- accept 约束选择文件类型 -->
                <input type="file" ref="fileRef" accept="image/*" @change="fileChange">  
                <el-button type='primary' icon='el-icon-plus' @click="chooseImg">选择图片</el-button>
                <el-button type='success' icon='el-icon-upload' :disabled="avatar===''" @click="uploadImg">上传头像</el-button>
            </div>
        </div>
    </el-card>
</template>

<script>
import { Message } from 'element-ui'
export default {
    name: 'UserAvatar',
    data() {
        return {
            avatar: ''
        }
    },
    methods: {
        chooseImg() {
            // input file 内置一个点击事件
            this.$refs.fileRef.click()
        },
        fileChange(e) {
            // 把图片储存到 files 里面
            const files = e.target.files
            if(files.length === 0){
                console.log('没有选择图片！')
            } else {
                console.log('选择了图片！', files[0])
                // FileReader() JS原生的读取文件实例对象
                const fr = new FileReader()
                // readAsDataURL() 将文件格式转化成 base64格式 （异步）
                fr.readAsDataURL(files[0])
                // onload 方法获取异步数据 --> result
                fr.onload = (e)=>{
                    console.log(e.target.result)
                    this.avatar = e.target.result
                }
            }
        },
        async uploadImg() {
            const { data: res } = await this.$http.patch('/my/update/avatar', {avatar: this.avatar})
            if(res.code === 0){
                // 更新成功
                Message.success(res.message)
                this.$store.dispatch('getUserInfo')
            } else {
                // 更新失败
                Message.error(res.message)
            }
        }
    },
}
</script>

<style lang='less' scoped>
.btn-box {
    margin-top: 10px;
}
.preview {
    width: 350px; height: 350px;
    object-fit: cover;
}
img {
    border-radius: 20px;
    box-shadow: 1px 1px 5px 1px rgb(224, 224, 224);
}
input[type='file'] {
    display: none;
}
</style>