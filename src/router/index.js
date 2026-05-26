import { createRouter, createWebHistory } from 'vue-router'

// Import component màn hình Nhân viên
import EmployeeList from '../views/employee/EmployeeList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/employee' // Vừa vào trang web sẽ tự chuyển hướng sang /employee
    },
    {
      path: '/employee',
      name: 'EmployeeList',
      component: EmployeeList
    },
    // Tạo sẵn các đường dẫn rỗng (hoặc gắn tạm component trống) để test hiệu ứng click Sidebar
    { path: '/dashboard', name: 'Dashboard', component: {} },
    { path: '/cash', name: 'Cash', component: {} },
    { path: '/bank', name: 'Bank', component: {} },
    { path: '/buy', name: 'Buy', component: {} },
    { path: '/sale', name: 'Sale', component: {} },
    { path: '/invoice', name: 'Invoice', component: {} },
    { path: '/stock', name: 'Stock', component: {} },
    { path: '/tools', name: 'Tools', component: {} },
    { path: '/assets', name: 'Assets', component: {} },
    { path: '/salary', name: 'Salary', component: {} },
    { path: '/tax', name: 'Tax', component: {} },
    { path: '/price', name: 'Price', component: {} },
    { path: '/general', name: 'General', component: {} },
    { path: '/report', name: 'Report', component: {} },
    { path: '/risk', name: 'Risk', component: {} },
    { path: '/app-link', name: 'AppLink', component: {} },
    { path: '/loan-link', name: 'LoanLink', component: {} }
  ],
})

export default router