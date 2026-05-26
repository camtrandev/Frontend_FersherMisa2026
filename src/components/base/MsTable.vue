<template>
    <div class="m-table-scroller">
        <table class="m-table">
            <thead>
                <tr>
                    <th class="th-checkbox text-center">
                        <MsCheckbox />
                    </th>

                    <th v-for="(col, index) in columns" :key="index" :class="[col.alignClass, 'th-column-group']"
                        :style="{ minWidth: col.width, width: col.width }">

                        <div class="th-content">
                            {{ col.label }}
                        </div>

                        <div v-if="col.filterable" class="icon-filter-trigger m-icon mi_icon_filter_dropdown"
                            :class="{ 'active': activeFilterCol === col.field }" @click.stop="toggleFilter(col.field)">
                        </div>

                        <MsTableFilter v-if="activeFilterCol === col.field" :column="col" @onFilter="handlePassFilter"
                            @onClear="handlePassClear" @close="activeFilterCol = null" />
                    </th>

                    <th class="th-action text-center">Chức năng</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, rowIndex) in data" :key="rowIndex">
                    <td class="td-checkbox text-center">
                        <MsCheckbox />
                    </td>

                    <td v-for="col in columns" :key="col.field" :class="col.alignClass">
                        <template v-if="col.type === 'checkbox'">
                            <input type="checkbox" :checked="row[col.field]" disabled />
                        </template>

                        <template v-else>
                            {{ row[col.field] }}
                        </template>
                    </td>

                    <td class="td-action text-center" :style="{ zIndex: activeDropdown === rowIndex ? 4 : 1 }">
                        <div class="action-group">
                            <span class="action-btn" @click.stop="handleEdit(row)">Sửa</span>

                            <div class="m-icon mi_icon_chevron_down_blue btn-dropdown-action"
                                @click.stop="toggleDropdown(rowIndex)"></div>
                        </div>

                        <ul v-if="activeDropdown === rowIndex" class="dropdown-menu">
                            <li class="dropdown-item" @click.stop="handleAction('Nhân bản', row)">Nhân bản</li>
                            <li class="dropdown-item" @click.stop="handleAction('Xóa', row)">Xóa</li>
                            <li class="dropdown-item" @click.stop="handleAction('Ngừng sử dụng', row)">Ngừng sử dụng
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MsCheckbox from './MsCheckbox.vue';
import MsTableFilter from './MsTableFilter.vue'; // IMPORT COMPONENT FILTER

const props = defineProps({
    columns: { type: Array, required: true },
    data: { type: Array, required: true }
});

const emit = defineEmits(['filter-data', 'onDeleteRow', 'onEditRow']);

// ==========================================
// LOGIC CHO CHỨC NĂNG DROPDOWN (BÊN PHẢI)
// ==========================================
const activeDropdown = ref(null);

const toggleDropdown = (index) => {
    if (activeDropdown.value === index) {
        activeDropdown.value = null;
    } else {
        activeDropdown.value = index;
    }
};

const closeDropdown = () => {
    activeDropdown.value = null;
};

const handleEdit = (row) => {
    closeDropdown();
    emit('onEditRow', row); // Phát tín hiệu lên cha kèm theo dữ liệu của nhân viên
    console.log("MỞ FORM SỬA CHO DỮ LIỆU:", row);
};

const handleAction = (actionName, row) => {
    closeDropdown();

    // THÊM ĐOẠN IF NÀY VÀO:
    if (actionName === 'Xóa') {
        emit('onDeleteRow', row); // Phát sự kiện lên cha, truyền theo dữ liệu dòng đang chọn
    } else {
        console.log(`Thực hiện tính năng [${actionName}] cho:`, row);
    }
};


// ==========================================
// LOGIC CHO CHỨC NĂNG LỌC CỘT (TRÊN THEAD)
// ==========================================
// Lưu trữ tên field của cột đang được mở bảng lọc
const activeFilterCol = ref(null);

const toggleFilter = (field) => {
    activeFilterCol.value = activeFilterCol.value === field ? null : field;
};

const closeFilter = () => {
    activeFilterCol.value = null;
};

// Đẩy dữ liệu lọc từ MsTableFilter.vue lên cha (EmployeeList.vue)
const handlePassFilter = (filterData) => {
    emit('filter-data', filterData);
};

// Đẩy tín hiệu xóa bộ lọc từ MsTableFilter.vue lên cha
const handlePassClear = (field) => {
    emit('filter-data', { field: field, value: '' });
};

// ==========================================
// SỰ KIỆN CLICK NGOÀI MÀN HÌNH CHUNG
// ==========================================
const closeAllPopovers = () => {
    closeDropdown();
    closeFilter();
};

onMounted(() => {
    window.addEventListener('click', closeAllPopovers);
});

onUnmounted(() => {
    window.removeEventListener('click', closeAllPopovers);
});
</script>

<style scoped>
/* Box chứa table để xử lý scroll */
.m-table-scroller {
    flex: 1;
    min-height: 0;
    min-width: 0;
    overflow: auto;
    background-color: #fff;
}

.m-table {
    min-width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 13px;
}

.m-table th,
.m-table td {
    white-space: nowrap;
}

/* --- 1. XỬ LÝ THEAD & STICKY HEADER --- */
.m-table thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: #eceef1;
    padding: 0 10px;
    height: 29px;
    border-right: 1px solid #c7c7c7;
    border-bottom: 1px solid #c7c7c7;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12px;
    cursor: pointer;

    font-size: 12px;
    text-transform: var(--grid-header-text-transform);
    align-items: center;
    cursor: pointer;
    padding-right: 12px;

}

/* BỔ SUNG CSS CHO CHỨC NĂNG LỌC TẠI THEAD 
*/
.th-column-group {
    position: relative;
    /* Bắt buộc để đặt popover và icon filter */
    padding-right: 24px !important;
    /* Dành chỗ trống cho icon mũi tên không đè vào chữ */
}

.th-content {
    display: inline-block;
    width: 100%;
}

.icon-filter-trigger {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    cursor: pointer;
    display: none;
    /* Mặc định ẩn, chỉ hiện khi hover */
    background-color: transparent;
    /* Nền trong suốt */

    /* Thiết lập icon mũi tên (Sử dụng CSS sprite của bạn, sửa lại tọa độ nếu chưa chuẩn) */
    background: url(../../assets/icons/Sprites-7ba27b53.svg) no-repeat;
    background-position: -1686px -564px;
    /* Tọa độ ví dụ, bạn hãy sửa lại theo đúng icon mũi tên xám */
}

/* Hiển thị icon mũi tên khi trỏ chuột vào cột HOẶC khi cột đó đang mở bộ lọc */
.th-column-group:hover .icon-filter-trigger,
.icon-filter-trigger.active {
    display: block;
}


/* --- 2. XỬ LÝ TBODY & ROWS --- */
.m-table tbody td {
    padding: 0 10px;
    height: 33px;
    border-right: 1px dotted #c7c7c7;
    border-bottom: 1px solid #c7c7c7;
    color: #111;
    transition: background-color 0.1s;
}

/* --- 3. CỐ ĐỊNH CỘT TRÁI - CHECKBOX --- */
.th-checkbox,
.td-checkbox {
    position: sticky;
    left: 0;
    width: 40px;
    min-width: 40px;
    border-right: 1px solid #c7c7c7 !important;
}

.td-checkbox {
    background-color: #fff;
    z-index: 1;
}

.th-checkbox {
    background-color: #eceef1;
    z-index: 3 !important;
}

/* --- 4. CỐ ĐỊNH CỘT PHẢI - CHỨC NĂNG --- */
.th-action,
.td-action {
    position: sticky;
    right: 0;
    width: 104px;
    min-width: 104px;
    border-left: 1px solid #c7c7c7 !important;
    border-right: none !important;
}

.td-action {
    background-color: #fff;
}

.th-action {
    background-color: #eceef1;
    z-index: 3 !important;
}

/* --- 5. HIỆU ỨNG HOVER --- */
.m-table tbody tr:hover td {
    background-color: #f3f8f8;
}

.m-table tbody tr:hover .td-checkbox,
.m-table tbody tr:hover .td-action {
    background-color: #f3f8f8;
}

.text-center {
    text-align: center;
}

/* --- CỤM NÚT CHỨC NĂNG VÀ MENU DROPDOWN --- */
.action-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.action-btn {
    color: #0075c0;
    font-weight: 600;
    cursor: pointer;
}

.btn-dropdown-action {
    width: 16px;
    height: 16px;
    cursor: pointer;
    background: url(../../assets/icons/Sprites-7ba27b53.svg) no-repeat;
    background-position: -896px -359px;
}

/* --- BOX MENU DROPDOWN HIỂN THỊ --- */
.dropdown-menu {
    position: absolute;
    top: 90%;
    right: 20px;
    background-color: #ffffff;
    border: 1px solid #babec5;
    border-radius: 2px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    list-style: none;
    padding: 2px 0;
    margin: 0;
    min-width: 120px;
    text-align: left;
    z-index: 999;
}

.dropdown-item {
    padding: 6px 12px;
    cursor: pointer;
    font-size: 13px;
    color: #111111;
    transition: background-color 0.2s ease;
}

.dropdown-item:hover {
    background-color: #e8e9ec;
    color: #00a54f;
}
</style>