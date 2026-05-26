<template>
    <aside class="m-sidebar" :class="{ 'collapsed': isCollapsed }">
        <div class="sidebar-top">
            <button class="btn-add-quick">
                <div class="icon-sidebar icon-green mi_icon_plus"></div>
                <span class="text-add" v-show="!isCollapsed">Thêm nhanh</span>
            </button>
        </div>

        <div class="sidebar-menu">
            <a v-for="(item, index) in menuItems" :key="index" class="sidebar-item" :class="{ 'active': item.isActive }"
                @click="setActive(index)">
                <div class="sidebar-item-left">
                    <div class="icon-sidebar" :class="item.iconClass"></div>
                    <span class="sidebar-item-text" v-show="!isCollapsed">{{ item.name }}</span>
                </div>
                <div class="icon-sidebar" :class="item.iconClassRight" v-show="!isCollapsed"></div>
            </a>
        </div>

        <div class="sidebar-bottom" @click="toggleSidebar">
            <div class="icon-sidebar" :class="isCollapsed ? 'mi_icon_chevron_right' : 'mi_icon_chevron_left'"></div>
            <span class="sidebar-item-text" v-show="!isCollapsed">Thu gọn</span>
        </div>
    </aside>
</template>

<script setup>
import { ref } from 'vue';

const isCollapsed = ref(false);

const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
};

const menuItems = ref([
    { name: 'Tổng quan', iconClass: 'mi_icon_dashboard',iconClassRight: 'mi_icon_chevron_right', isActive: false },
    { name: 'Tiền mặt', iconClass: 'mi_icon_cash',iconClassRight: 'mi_icon_chevron_right', isActive: false },
    { name: 'Tiền gửi', iconClass: 'mi_icon_bank',iconClassRight: 'mi_icon_chevron_right', isActive: false },
    { name: 'Mua hàng', iconClass: 'mi_icon_buy',iconClassRight: 'mi_icon_chevron_right', isActive: false },
    { name: 'Bán hàng', iconClass: 'mi_icon_sale',iconClassRight: 'mi_icon_chevron_right', isActive: false },
    { name: 'Quản lý hóa đơn', iconClass: 'mi_icon_invoice',iconClassRight: 'mi_icon_chevron_right', isActive: false },
    { name: 'Kho', iconClass: 'mi_icon_stock',iconClassRight: 'mi_icon_chevron_right', isActive: false },
    { name: 'Giá thành', iconClass: 'mi_icon_price',iconClassRight: 'mi_icon_chevron_right', isActive: false },
    { name: 'Tổng hợp', iconClass: 'mi_icon_general', isActive: false },
    { name: 'Báo cáo', iconClass: 'mi_icon_report', isActive: false },
    { name: 'Kiểm soát rủi ro', iconClass: 'mi_icon_risk', isActive: false },
    { name: 'Nhân viên', iconClass: 'mi_icon_employee',iconClassRight: 'mi_icon_chevron_right', isActive: true },
    
    { name: 'Kết nối vay vốn', iconClass: 'mi_icon_loan_link', isActive: false }
    
]);

/**
 * Hàm xử lý khi click vào item: 
 * Reset tất cả về false và set true cho item được chọn
 */
const setActive = (index) => {
    menuItems.value.forEach((item, i) => {
        item.isActive = (i === index);
    });
};
</script>

<style scoped>
/* --- LAYOUT CHÍNH --- */
.m-sidebar {
    width: 200px;
    min-width: 200px;
    height: calc(100vh - 48px);
    background-color: #ffffff;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

.m-sidebar.collapsed {
    width: 56px;
    min-width: 56px;
}

/* --- SIDEBAR TOP & NÚT THÊM NHANH --- */
.sidebar-top {
    padding: 16px 16px 12px 16px;
    display: flex;
    justify-content: center;
}

.btn-add-quick {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 36px;
    background-color: #ffffff;
    border: 1px solid #454545;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    color: #333333;
    transition: all 0.2s ease;
    overflow: hidden;
    white-space: nowrap;
}

.btn-add-quick:hover {
    background-color: #f2f2f2;
}

.m-sidebar.collapsed .btn-add-quick {
    width: 36px;
    border-radius: 50%;
    padding: 0;
}

/* --- SIDEBAR MENU (SCROLL) --- */
.sidebar-menu {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.sidebar-menu::-webkit-scrollbar {
    width: 6px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
}

/* --- ITEM TRONG MENU --- */
.sidebar-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    cursor: pointer;
    text-decoration: none;
    color: #333333;
    transition: background-color 0.2s;
    white-space: nowrap;
}

.sidebar-item:hover {
    background-color: #f2f2f2;
}

.sidebar-item-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.sidebar-item-text {
    font-size: 13px;
}

.m-sidebar.collapsed .sidebar-item {
    justify-content: center;
    padding: 10px 0;
}

.m-sidebar.collapsed .sidebar-item-left {
    justify-content: center;
}

/* --- TRẠNG THÁI ACTIVE (QUAN TRỌNG) --- */
.sidebar-item.active {
    background-color: #e5e5e5 !important;
    font-weight: 600;
}

/* Khi active, đổi màu icon (nhờ kỹ thuật mask) thành màu xanh tươi đẹp */
.sidebar-item.active .sidebar-item-left .icon-sidebar {
    background-color: #00a54f !important; 
}

/* Giữ nguyên màu xám/đen cho nút mũi tên bên phải kể cả khi active */
.sidebar-item.active .mi_icon_chevron_right {
    background-color: #737373 !important; 
}

.sidebar-item.active .sidebar-item-text {
    color: #000000;
}

/* --- SIDEBAR BOTTOM (NÚT THU GỌN) --- */
.sidebar-bottom {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    border-top: 1px solid #e0e0e0;
    background-color: #ffffff;
    transition: background-color 0.2s;
    white-space: nowrap;
}

.sidebar-bottom:hover {
    background-color: #f2f2f2;
}

.m-sidebar.collapsed .sidebar-bottom {
    justify-content: center;
    padding: 12px 0;
}

/* =========================================
   HỆ THỐNG ICON (ÁP DỤNG KỸ THUẬT MASK CSS)
========================================= */
.icon-sidebar {
    /* Đặt URL ảnh SVG làm Mask thay vì Background */
    -webkit-mask-image: url('../../assets/icons/Sprites-7ba27b53.svg');
    -webkit-mask-repeat: no-repeat;
    mask-image: url('../../assets/icons/Sprites-7ba27b53.svg');
    mask-repeat: no-repeat;

    /* MÀU MẶC ĐỊNH CỦA ICON CHƯA ACTIVE (Màu xám tối) */
    background-color: #737373;

    height: 24px;
    width: 24px;
    display: inline-block;
}

/* Ghi đè màu xanh luôn sáng cho icon nút Thêm nhanh */
.icon-green {
    background-color: #00a54f !important;
}

/* --- TỌA ĐỘ CÁC ICON (MASK POSITION) --- */
.mi_icon_plus {
	width: 12px;
	height: 12px;
    -webkit-mask-position: -34px -314px;
    margin-right: 6px;
}

.mi_icon_dashboard {
    -webkit-mask-position: -30px -1628px;
    mask-position: -30px -1628px;
}

.mi_icon_cash {
    -webkit-mask-position: -73px -1628px;
    mask-position: -73px -1628px;
}

.mi_icon_bank {
    -webkit-mask-position: -117px -1628px;
    mask-position: -117px -1628px;
}

.mi_icon_buy {
    -webkit-mask-position: -161px -1628px;
    mask-position: -161px -1628px;
}

.mi_icon_sale {
    -webkit-mask-position: -204px -1628px;
    mask-position: -204px -1628px;
}

.mi_icon_invoice {
    -webkit-mask-position: -249px -1628px;
    mask-position: -249px -1628px;
}

.mi_icon_stock {
    -webkit-mask-position: -291px -1628px;
    mask-position: -291px -1628px;
}

.mi_icon_tools,
.mi_icon_assets {
    -webkit-mask-position: -336px -1628px;
    mask-position: -336px -1628px;
}

.mi_icon_salary {
    -webkit-mask-position: -378px -1630px;
    mask-position: -378px -1630px;
}

.mi_icon_tax,
.mi_icon_price {
    -webkit-mask-position: -423px -1630px;
    mask-position: -423px -1630px;
}

.mi_icon_general {
    -webkit-mask-position: -510px -1628px;
    mask-position: -510px -1628px;
}

.mi_icon_report {
    -webkit-mask-position: -547px -1630px;
    mask-position: -547px -1630px;
}

.mi_icon_employee {
    -webkit-mask-position: -590px -1660px;
    mask-position: -590px -1660px;
}

.mi_icon_app_link {
    -webkit-mask-position: -632px -1660px;
    mask-position: -632px -1660px;
}

.mi_icon_loan_link {
    /* Đảm bảo bạn có tọa độ cho icon này nếu dùng, hiện tại để tạm */
    -webkit-mask-position: -675px -1660px;
    mask-position: -675px -1660px;
}

.mi_icon_risk {
    -webkit-mask-position: -877px -1660px;
    mask-position: -877px -1660px;
}

.mi_icon_chevron_left {
    -webkit-mask-position: -36px -361px;
    mask-position: -36px -361px;
    height: 16px;
    width: 16px;
}

.mi_icon_chevron_right {
    -webkit-mask-position: -84px -361px;
    mask-position: -84px -361px;
    height: 16px;
    width: 16px;
}
</style>