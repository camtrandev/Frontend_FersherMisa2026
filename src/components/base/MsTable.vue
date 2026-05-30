<template>
    <div class="m-table-scroller">
        <table class="m-table">
            <thead>
                <tr>
                    <th class="th-checkbox text-center">
                        <MsCheckbox :modelValue="isAllSelected" @update:modelValue="toggleSelectAll" />
                    </th>

                    <th v-for="(col, index) in columns" :key="index" :class="[col.alignClass, 'th-column-group']"
                        :style="{ minWidth: col.width, width: col.width }">

                        <div class="th-content">{{ col.label }}</div>

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
                        <MsCheckbox :modelValue="selectedIds.includes(row.employeeId)"
                            @update:modelValue="toggleSelectRow(row.employeeId, $event)" />
                    </td>

                    <td v-for="col in columns" :key="col.field" :class="col.alignClass">
                        <template v-if="col.type === 'checkbox'">
                            <input type="checkbox" :checked="row[col.field]" disabled />
                        </template>

                        <template v-else-if="col.field === 'gender'">
                            {{ row[col.field] === 0 ? 'Nữ' : (row[col.field] === 1 ? 'Nam' : 'Khác') }}
                        </template>

                        <template v-else-if="col.field === 'agreedSalary' || col.field === 'insuranceSalary'">
                            {{ formatCurrency(row[col.field]) }}
                        </template>

                        <template
                            v-else-if="col.field === 'dateOfBirth' || col.field === 'issueDate' || col.field === 'createdDate' || col.field === 'modifiedDate'">
                            {{ formatDate(row[col.field]) }}
                        </template>

                        <template v-else-if="col.field === 'contractType'">
                            {{ contractTypes[row[col.field]] || 'Chưa xác định' }}
                        </template>

                        <template v-else-if="col.field === 'status'">
                            {{ row[col.field] === 1 ? 'Đang sử dụng' : 'Ngừng sử dụng' }}
                        </template>

                        <template v-else>
                            {{ row[col.field] }}
                        </template>
                    </td>

                    <td class="td-action text-center" :style="{ zIndex: activeDropdown === rowIndex ? 4 : 1 }">
                        <div class="action-group">
                            <span class="action-btn" @click.stop="handleEdit(row)">Sửa</span>

                            <div class="m-icon mi_icon_chevron_down_blue btn-dropdown-action"
                                @click.stop="toggleDropdown(rowIndex, $event)"></div>
                        </div>

                        <ul v-if="activeDropdown === rowIndex" class="dropdown-menu" :class="{ 'dropup': isDropUp }">
                            <li class="dropdown-item" @click.stop="handleAction('Nhân bản', row)">Nhân bản</li>
                            <li class="dropdown-item" @click.stop="handleAction('Xóa', row)">Xóa</li>
                            <li class="dropdown-item" @click.stop="handleAction('Ngừng sử dụng', row)">Ngừng sử dụng </li>
                        </ul>
                    </td>
                </tr>

                <tr class="empty-spacer-row">
                    <td :colspan="columns.length + 2"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
// BỔ SUNG: Import thêm 'computed' từ 'vue'
import { ref, computed, onMounted, onUnmounted } from 'vue';
import MsCheckbox from './MsCheckbox.vue';
import MsTableFilter from './MsTableFilter.vue';

const props = defineProps({
    columns: { type: Array, required: true },
    data: { type: Array, required: true },
    // nhận danh sách id chọn ngoài màn hình 
    selectedIds: { type: Array, default: () => [] }
});

// Định nghĩa danh sách loại hợp đồng
const contractTypes = {
    1: 'Không cư trú',
    2: 'Cư trú và không ký HĐLĐ/HĐLĐ dưới 3 tháng',
    3: 'Cư trú và có HĐLĐ từ 3 tháng trở lên'
};

const emit = defineEmits(['filter-data', 'onDeleteRow', 'onEditRow', 'update:selectedIds', 'onCloneRow', 'onUpdateStatusRow']);

const activeDropdown = ref(null);
const activeFilterCol = ref(null);

// Thêm biến kiểm soát hướng mở của Dropdown
const isDropUp = ref(false);

// BỔ SUNG: Hàm tính toán xem ô Checkbox trên cùng có được tích hay không
const isAllSelected = computed(() => {
    // Tích khi mảng data có dữ liệu VÀ số lượng ID được chọn bằng đúng số lượng dòng hiển thị
    return props.data.length > 0 && props.selectedIds.length === props.data.length;
});

const toggleDropdown = (index, event) => {
    if (activeDropdown.value === index) {
        activeDropdown.value = null;
    } else {
        activeDropdown.value = index;

        // Tính toán khoảng cách từ con trỏ chuột đến đáy màn hình
        // Nếu khoảng cách < 150px (tức là menu có nguy cơ bị che), ta hất nó lên trên
        if (window.innerHeight - event.clientY < 150) {
            isDropUp.value = true;
        } else {
            isDropUp.value = false;
        }
    }
};


const closeDropdown = () => { activeDropdown.value = null; };
const handleEdit = (row) => { closeDropdown(); emit('onEditRow', row); };
const handleAction = (actionName, row) => {
    closeDropdown();
    if (actionName === 'Xóa') emit('onDeleteRow', row);
    else if (actionName === 'Nhân bản') emit('onCloneRow', row);
    else if (actionName === 'Ngừng sử dụng') emit('onUpdateStatusRow', { row, status: 0 });
};

// Hàm chạy khi click vào Checkbox trên cùng (Header)
const toggleSelectAll = (isChecked) => {
    if (isChecked) {
        // Tích chọn: Lấy toàn bộ employeeId của trang hiện tại bắn ra ngoài
        const allIds = props.data.map(row => row.employeeId);
        emit('update:selectedIds', allIds);
    } else {
        // Bỏ chọn: Bắn ra mảng rỗng
        emit('update:selectedIds', []);
    }
};

// Hàm chạy khi click vào Checkbox của từng dòng
const toggleSelectRow = (id, isChecked) => {
    const newSelected = [...props.selectedIds];
    if (isChecked) {
        if (!newSelected.includes(id)) newSelected.push(id);
    } else {
        const index = newSelected.indexOf(id);
        if (index !== -1) newSelected.splice(index, 1);
    }
    emit('update:selectedIds', newSelected);
};

const toggleFilter = (field) => { activeFilterCol.value = (activeFilterCol.value === field) ? null : field; };
const closeFilter = () => { activeFilterCol.value = null; };
const handlePassFilter = (filterData) => { emit('filter-data', filterData); };
const handlePassClear = (field) => { emit('filter-data', { field: field, value: '' }); };

const closeAllPopovers = () => { closeDropdown(); closeFilter(); };
onMounted(() => window.addEventListener('click', closeAllPopovers));
onUnmounted(() => window.removeEventListener('click', closeAllPopovers));

// Hàm format số có dấu phẩy ngăn cách hàng nghìn
const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Hàm format ngày tháng từ ISO (YYYY-MM-DD...) sang dd/MM/yyyy
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Nếu không phải ngày hợp lệ, giữ nguyên

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};
</script>

<style scoped>
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

/* HÀNG TRỐNG 20PX */
.empty-spacer-row {
    height: 50px;
    background-color: #fff;
}

.empty-spacer-row td {
    border: none !important;
}

.m-table tbody tr.empty-spacer-row:hover td {
    background-color: #fff !important;
}

/* --- CSS CŨ (GIỮ NGUYÊN) --- */
.m-table thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: #eceef1;
    padding: 0 10px;
    height: 29px;
    border-right: 1px solid #c7c7c7;
    border-bottom: 1px solid #c7c7c7;
    font-weight: 560;
    font-size: 14px;
    cursor: pointer;
    align-items: center;
    padding-right: 12px;

}

.th-column-group {
    position: relative;
    padding-right: 24px !important;
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
    background: url(../../assets/icons/Sprites-7ba27b53.svg) no-repeat;
    background-position: -1686px -564px;
}

.th-column-group:hover .icon-filter-trigger,
.icon-filter-trigger.active {
    display: block;
}

.m-table tbody td {
    padding: 0 10px;
    height: 33px;
    border-right: 1px dotted #c7c7c7;
    border-bottom: 1px solid #c7c7c7;
    color: #111;
    transition: background-color 0.1s;
}

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

/* THÊM ĐOẠN NÀY DÀNH RIÊNG CHO CÁC DÒNG CUỐI BẢNG */
.dropdown-menu.dropup {
    top: auto;        /* Hủy bỏ neo phía trên */
    bottom: 90%;      /* Neo menu mọc ngược từ dưới lên */
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1); /* Đảo ngược bóng đổ cho đẹp */
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