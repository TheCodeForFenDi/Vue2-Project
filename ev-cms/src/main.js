import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局 less样式
import '@/assets/global.less'

// 按需引入 组件样式 (A+)
import {
  Form,
  FormItem,
  Input,
  Button,
  Link,
  Container,
  Header,
  Menu,
  MenuItem,
  Submenu,
  Aside,
  Main,
  Footer,
  Row,
  Col,
  Card,
  Table,
  TableColumn,
  Dialog,
} from 'element-ui'

Vue.component(Input.name, Input), Vue.component(Button.name, Button), Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem), Vue.component(Link.name, Link), Vue.use(Container), Vue.use(Header)
Vue.use(Menu), Vue.use(Submenu), Vue.use(MenuItem), Vue.use(Aside), Vue.use(Main), Vue.use(Footer),Vue.use(Row),
Vue.use(Col), Vue.use(Card), Vue.use(Table), Vue.use(TableColumn), Vue.use(Dialog)

// 导入 axios
import axios from '@/http/index.js'
// 在 Vue 原型上添加 axios，将来在组件中可以使用 this.$http 访问 axios
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
