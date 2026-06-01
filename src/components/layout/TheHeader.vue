<template>
    <header class="m-header">
        <div class="backgroundHoa"></div>

        <div class="header-left">
            <div class="spring-blossom-bg"></div>
            <div class="header-icon-app"></div>
        </div>
        
        <div class="header-center">
            <div class="header-icon-menu"></div>
            <div class="company-name">Fresher ASP</div>

            <div class="db-connection">
                <div class="status-dot"></div>
                <span class="db-name" title="LVTHO_2019_2030_133_Khấu ...">LVTHO_2019_2030_133_Khấu ...</span>
            </div>
        </div>

        <div class="header-right">
            <div class="header-search">
                <input type="text" placeholder="Nhập từ khóa tìm kiếm" class="search-input" />
                <div class="icon-header mi_icon_search"></div>
            </div>

            <div class="header-actions">
                <div class="icon-header mi_icon_download" title="Tải xuống"></div>
                <div class="icon-header mi_icon_setting" title="Cài đặt"></div>
                <div class="icon-header mi_icon_chat" title="Trò chuyện"></div>
                <div class="icon-header mi_icon_help" title="Trợ giúp"></div>
                <div class="icon-header mi_icon_book" title="Sổ sách"></div>

                <div class="header-avatar">
                    <div class="avatar-img"></div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
// Hiện tại Header tĩnh, chưa cần logic JS
</script>

<style scoped>
/* Biến màu sắc cục bộ cho Header */
.m-header {
    position: relative; /* Thêm position relative để làm hệ quy chiếu cho nền hoa */
    background: linear-gradient(90deg,
            #2ca01c 0%,
            /* Xanh lá đậm bên trái */
            #20a948 40%,
            /* Giữ màu xanh lá ổn định một đoạn */
            #0bb894 75%,
            /* Màu trung gian xanh ngọc */
            #03bfb6 100%
            /* Xanh dương nhạt dần về bên phải */
        ) !important;
    /* Xanh lá chuẩn MISA */
    --header-text-color: #ffffff;
    --header-height: 48px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--header-height);
    color: var(--header-text-color);
    padding: 12px;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    /* Tùy chỉnh theo font chữ chung của dự án */
}

/* CSS CHUẨN CHO BACKGROUND HOA */
.backgroundHoa {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://actaspcdng1.misacdn.net/assets/bg_head_navbar-db577ce7.png');
    background-repeat: no-repeat;
    background-position: left top; 
    pointer-events: none; /* Không cho click trúng ảnh để tránh chặn click chuột vào logo/menu */
    z-index: 0; /* Nằm dưới các thành phần khác */
}

/* Đảm bảo các khối nội dung nổi lên trên hoa */
.header-left, 
.header-center, 
.header-right {
    position: relative;
    z-index: 1;
}

/* --- TRÁI: LOGO --- */
.header-left {
    display: flex;
    align-items: center;
    height: 100%;
}

.spring-blossom-bg {
    background: url(../../assets/icons/Sprites-7ba27b53.svg) no-repeat;
    background-position: -424px -88px;
    width: 24px;
    height: 24px;
    margin-right: 10px;
}

.header-icon-app {
    width: 130px; /* Thay đổi thành 116px đúng với kích thước thật của ảnh */
    height: 36px; /* Thay đổi thành 32px đúng với kích thước thật của ảnh */

    background-image: url(../../assets/images/LogoMisaAsp3.png);
    background-repeat: no-repeat;
    background-position: left center;
    
    /* Dùng contain hoặc 100% 100% đều được vì khung div đã chuẩn tỷ lệ ảnh gốc */
    background-size: contain; 

    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.2s ease;
}

/* Hover nhẹ giống MISA */
.header-icon-app:hover {
    opacity: 0.9;
    transform: scale(1.01);
}

/* --- GIỮA: CÔNG TY --- */
.header-center {
    display: flex;
    align-items: center;
    flex: 1;
    margin-left: 25px;
}

.header-icon-menu {
    background: url(../../assets/icons/Sprites-7ba27b53.svg) no-repeat;
    background-position: -312px -32px;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
    cursor: pointer;
}

.company-name {
    font-size: 14px;
    font-weight: bold;
    margin: 0 16px 0 12px;
}

.db-connection {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.15);
    /* Nền tối mờ */
    padding: 4px 12px;
    border-radius: 20px;
    max-width: 250px;
    cursor: pointer;
}

.status-dot {
    width: 8px;
    height: 8px;
    background-color: #a1e67c;
    /* Chấm xanh lá nhạt */
    border-radius: 50%;
    margin-right: 8px;
}

.db-name {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* --- PHẢI: CÔNG CỤ --- */
.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.header-search {
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    color: #fff;
    padding: 6px 32px 6px 12px;
    outline: none;
    width: 220px;
    font-size: 13px;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
    border-color: #fff;
}

.header-search .mi_icon_search {
    position: absolute;
    right: 8px;
    background-color: #ffffff;
    /* Icon màu trắng */
    -webkit-mask-image: url('đường-dẫn-icon-của-bạn');
    /* Sửa đường dẫn nếu cần */
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

/* --- CẤU HÌNH ICON MASK CHUNG TỪ USER --- */
.icon-header {
    background: url(../../assets/icons/Sprites-7ba27b53.svg) no-repeat;
    height: 24px;
    width: 24px;
    cursor: pointer;
    margin-left: 6px;
}

.mi_icon_search {
    -webkit-mask-position: -0px -0px;
    height: 16px;
    width: 16px;
}

.mi_icon_download {
    background-position: -1771px -28px;
}

.mi_icon_setting {
    background-position: -1796px -28px;
}

.mi_icon_chat {
    background-position: -1847px -28px;
}

.mi_icon_bell {
    background-position: -1870px -28px;
}

.mi_icon_help {
    background-position: -1870px -28px;
}

.mi_icon_book {
    background-position: -1916px -27px;
    height: 28px;
}

/* Avatar */
.header-avatar {
    margin-left: 8px;
    cursor: pointer;
}

.avatar-img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #ccc;
    /* Nền tạm cho Avatar */
    /* background-image: url('../../assets/images/avatar.jpg'); */
    background-size: cover;
}
</style>