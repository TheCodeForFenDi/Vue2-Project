<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix header-box">
                <span>文章分类</span>
                <el-button type="primary" size="mini" @click="dialogVisible = true">添加分类</el-button>
            </div>
        <!-- 表格区域 -->
        <el-table :data="cateList" border stripe style="width: 100%;">
            <el-table-column label="序号" type="index" width="100"></el-table-column>
            <el-table-column label="分类名称" prop="cate_name"></el-table-column>
            <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
            <el-table-column label="操作">
                <!-- 组件内部传出的数据 (row)，使用作用域插槽，自定义该列的内容 --> 
                <template v-slot="scope">
                    <!-- {{ scope.row }} -->
                    <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">修改</el-button>
                    <el-button type="danger" size="mini" @click="remove(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加文章分类"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
            @closed="addClosed">
        <!-- closed 弹窗关闭时触发的回调 -->
            <el-form :model="addForm" status-icon :rules="addRules" ref="addRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cate_name">
                    <el-input v-model="addForm.cate_name"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="cate_alias">
                    <el-input v-model="addForm.cate_alias"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改分类的对话框 -->
        <el-dialog
            title="修改文章分类"
            :visible.sync="editVisible"
            width="30%"
            :before-close="handleClose"
            @closed="editClosed">
            <el-form :model="editForm" :rules="addRules" ref="editRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cate_name">
                    <el-input v-model="editForm.cate_name"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="cate_alias">
                    <el-input v-model="editForm.cate_alias"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
export default {
    name: 'ArtCate',
    data(){
        return {
            cateList: [],
            // dialogVisible = false el-dialog对话框关闭
            // dialogVisible = true  el-dialog对话框打开
            dialogVisible: false,
            editVisible: false,
            // 添加表单数据对象
            addForm: {
                cate_name: '',
                cate_alias: ''
            },
            // 修改表单数据
            editForm: {
                cate_name: '',
                cate_alias: ''
            },
            // 验证规则
            addRules: {
                cate_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { pattern: /^\S{1,10}$/, message: '分类名称必须是1~10个非空字符', trigger: 'blur' }
                ],
                cate_alias: [
                    { required: true, message: '请输入分类别名', trigger: 'blur' },
                    { pattern: /^[a-zA-Z0-9]{1,15}/, message: '分类别名必须是1~15位字母数字', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getArtCateList()
    },
    methods: {
        // 通过接口获取数据
        async getArtCateList(){
            const { data: res } = await this.$http.get('/my/cate/list')
            if(res.code === 0){
                this.cateList = res.data
                // console.log(this.cateList)
            }
        },
        // 关闭窗口
        handleClose(done) {
            MessageBox.confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        // 窗口关闭清空表单数据 - resetFields()
        addClosed(){
            this.$refs.addRef.resetFields()
        },
        editClosed(){
            this.$refs.editRef.resetFields()
        },
        // 添加文章分类
        addCate(){
            this.$refs.addRef.validate(async valid=>{
                if(!valid) return
                const { data: res } = await this.$http.post('/my/cate/add', this.addForm)
                if(res.code === 0){
                    Message.success(res)
                    // el-dialog 关闭对话框
                    this.dialogVisible = false
                    // 调用获取文章分类的接口，获取最新的文章数据
                    this.getArtCateList()
                    this.$refs.addRef.resetFields()
                } else{
                    Message.error(res)
                }
            })
        },
        showEditDialog(row){
            if(row.id === 1 || row.id === 2){
                Message.error('该分类不允许修改')
                return
            }
            this.editVisible = true
            // console.log(row)
            this.editForm = Object.assign({}, row)
        },
        editCate(){
            this.$refs.editRef.validate(async valid=>{
                if(!valid) return
                this.editVisible = false
                const { data: res } = await this.$http.put('/my/cate/info', this.editForm)
                if(res.code === 0){
                    Message.success(res)
                    // 调用获取文章分类的接口，获取最新的文章数据
                    this.getArtCateList()
                } else{
                    Message.error(res)
                }
            })
        },
        remove(id){
            if(id === 1 || id === 2){
                Message.error('该分类不允许删除')
                return
            }
            MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete('/my/cate/del', {
                    params: {
                        id
                    }
                })
                if(res.code === 0){
                    Message.success(res)
                    // 调用获取文章分类的接口，获取最新的文章数据
                    this.getArtCateList()
                } else{
                    Message.error(res)
                }
            }).catch(() => {
                Message({
                    type: 'info',
                    message: '已取消删除'
                })
            })

        }
    },
}
</script>

<style lang='less' scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>