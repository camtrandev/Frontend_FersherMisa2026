<template>
    <div class="m-pagination-container" ref="paginationRef">
        <div class="m-pagination-left">
            Tổng số: <b>{{ totalRecords }}</b> bản ghi
        </div>

        <div class="m-pagination-right">
            <div class="m-page-size-selector">
                <div class="m-combo-main" @click="toggleDropdown" :class="{ 'active': isDropdownOpen }">
                    <span>{{ pageSize }} bản ghi trên 1 trang</span>
                    <div class="m-icon mi_icon_chevron_down" :class="{ 'rotate': isDropdownOpen }"></div>
                </div>

                <ul class="m-combo-list" v-show="isDropdownOpen">
                    <li v-for="size in pageSizes" :key="size" class="m-combo-item"
                        :class="{ 'item-selected': size === pageSize }" @click="selectPageSize(size)">
                        {{ size }} bản ghi trên 1 trang
                    </li>
                </ul>
            </div>

            <div class="m-page-nav">
                <span class="m-nav-text" :class="{ 'disabled': isFirstPage }" @click="prevPage">
                    Trước
                </span>

                <div class="m-page-number active">{{ currentPage }}</div>

                <span class="m-nav-text" :class="{ 'disabled': isLastPage }" @click="nextPage">
                    Sau
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    totalRecords: {
        type: Number,
        default: 0
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

// Định nghĩa các sự kiện báo lên Component cha để gọi API
const emit = defineEmits(['update:pageSize', 'update:currentPage', 'changeData']);

const paginationRef = ref(null);
const isDropdownOpen = ref(false);
const pageSizes = [10, 20, 30, 50, 100, 200]; // Chuẩn các mốc của MISA

// Tính toán tổng số trang và trạng thái Disable của nút Trước/Sau
const totalPages = computed(() => Math.ceil(props.totalRecords / props.pageSize));
const isFirstPage = computed(() => props.currentPage <= 1);
const isLastPage = computed(() => props.currentPage >= totalPages.value || props.totalRecords === 0);

// =======================
// CÁC HÀM XỬ LÝ SỰ KIỆN
// =======================

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (e) => {
    // Nếu click ra ngoài khu vực phân trang thì đóng dropdown
    if (paginationRef.value && !paginationRef.value.contains(e.target)) {
        isDropdownOpen.value = false;
    }
};

const selectPageSize = (newSize) => {
    if (newSize !== props.pageSize) {
        emit('update:pageSize', newSize);
        emit('update:currentPage', 1); // Đổi kích thước trang thì tự reset về trang 1
        emit('changeData');            // Báo cho cha biết để gọi lại API
    }
    isDropdownOpen.value = false;
};

const prevPage = () => {
    if (!isFirstPage.value) {
        emit('update:currentPage', props.currentPage - 1);
        emit('changeData');
    }
};

const nextPage = () => {
    if (!isLastPage.value) {
        emit('update:currentPage', props.currentPage + 1);
        emit('changeData');
    }
};

// Lắng nghe sự kiện click toàn cục để xử lý đóng Dropdown
onMounted(() => {
    window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
    window.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
/* --- TỔNG QUAN CONTAINER --- */
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
    position: relative;
}

.m-pagination-left b {
    font-weight: 700;
}

.m-pagination-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

/* --- COMBOBOX CHỌN SỐ BẢN GHI (CHUẨN HÌNH 2) --- */
.m-page-size-selector {
    position: relative;
    margin-right: 16px;
}

.m-combo-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 200px;
    height: 32px;
    padding: 0 8px 0 12px;
    border: 1px solid #babec5;
    border-radius: 2px;
    cursor: pointer;
    background-color: #fff;
    transition: all 0.2s;
}

.m-combo-main:hover,
.m-combo-main.active {
    border-color: #2ca01c;
}

.m-combo-list {
    position: absolute;
    bottom: 100%;
    /* Mở ngược lên trên */
    left: 0;
    width: 100%;
    margin: 0 0 2px 0;
    padding: 2px 0;
    list-style: none;
    background-color: #fff;
    border: 1px solid #babec5;
    border-radius: 2px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    z-index: 99;
}

.m-combo-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.m-combo-item:hover {
    background-color: #e8e9ec;
    color: #2ca01c;
}

.m-combo-item.item-selected {
    background-color: #2ca01c;
    color: #fff;
}

/* --- ĐIỀU HƯỚNG TRANG (TRƯỚC / SAU) --- */
.m-page-nav {
    display: flex;
    align-items: center;
    gap: 12px;
}

.m-nav-text {
    cursor: pointer;
    color: #111;
    font-weight: 500;
}

.m-nav-text:hover:not(.disabled) {
    color: #2ca01c;
}

.m-nav-text.disabled {
    color: #9e9e9e;
    cursor: not-allowed;
}

.m-page-number {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    font-weight: 700;
}

/* --- ICON --- */
.m-icon {
    background-repeat: no-repeat;
    background-position: center;
    transition: transform 0.2s;
}

.mi_icon_chevron_down {
    background-color: #111;
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>');
    width: 16px;
    height: 16px;
}

.mi_icon_chevron_down.rotate {
    transform: rotate(180deg);
}
</style>