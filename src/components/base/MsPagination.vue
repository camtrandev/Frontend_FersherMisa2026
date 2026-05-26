<template>
    <div class="m-pagination-container">
        <div class="m-pagination-left">
            Tổng số: <b>{{ totalRecords }}</b> bản ghi
        </div>

        <div class="m-pagination-right">
            <div class="m-page-size-selector">
                <span>{{ pageSize }} bản ghi trên 1 trang</span>
                <div class="m-icon mi_icon_chevron_down"></div>
            </div>

            <div class="m-page-nav">
                <span class="m-nav-text inactive">Trước</span>
                <div class="m-page-number active">{{ currentPage }}</div>
                <span class="m-nav-text inactive">Sau</span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    totalRecords: {
        type: Number,
        default: 38
    },
    pageSize: {
        type: Number,
        default: 200
    },
    currentPage: {
        type: Number,
        default: 1
    }
});
</script>

<style scoped>
/* --- PAGINATION --- */
.m-pagination-container {
    height: 46px;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    font-size: 13px;
    color: #111;
    z-index: 10;
    border-top: 1px solid #e0e0e0;
}

.m-pagination-left b {
    font-weight: 700;
}

.m-pagination-right {
    display: flex;
    align-items: center;
    gap: 24px;
}

.m-page-size-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
}

.m-page-nav {
    display: flex;
    align-items: center;
    gap: 16px;
}

.m-nav-text {
    cursor: pointer;
}

.m-nav-text.inactive {
    color: #9e9e9e;
    cursor: not-allowed;
}

/* --- ICON MASK --- */
.m-icon {
    background-repeat: no-repeat;
    background-position: center;
}

.mi_icon_chevron_down {
    background-color: #111;
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>');
    width: 16px;
    height: 16px;
}
</style>