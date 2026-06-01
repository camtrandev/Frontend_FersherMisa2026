<template>
    <div class="m-employee-view">
        <div class="m-page-header">
            <div class="m-page-title-box">
                <h1 class="m-page-title">Nhân viên</h1>
                <a href="#" class="m-back-link">
                    <div class="m-icon mi_icon_chevron_left_blue"></div>
                    Tất cả danh mục
                </a>
            </div>
            <div class="m-page-actions">
                <div class="m-btn-split" style="position: relative;">
                    <MsButton class="m-btn-main" @click="openAddForm">Thêm</MsButton>
                    <div class="m-btn-divider"></div>

                    <button class="m-btn-dropdown-icon" @click="showAddMenu = !showAddMenu" style="cursor: pointer;">
                        <div class="m-icon mi_icon_chevron_down_white"></div>
                    </button>

                    <ul v-if="showAddMenu" class="m-dropdown-menu"
                        style="position: absolute; top: calc(100% + 4px); right: 0; z-index: 99; min-width: 150px; background: #fff; border: 1px solid #babec5; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 4px; padding: 4px 0; margin: 0; list-style: none;">
                        <li class="dropdown-item" @click="openImportExcel">Nhập từ Excel</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="m-page-content">
            <div class="m-toolbar">
                <div class="m-toolbar-left">
                    <div class="m-toolbar-icon" style="margin-right: 12px;" title="Thực hiện hàng loạt">
                        <div class="m-icon mi_icon_arrow_check"></div>
                    </div>

                    <div class="batch-action-container" style="position: relative;">
                        <button class="btn-dropdown m-btn-util"
                            :class="{ 'active-batch': selectedEmployeeIds.length >= 2 }"
                            :disabled="selectedEmployeeIds.length < 2" @click="showBatchMenu = !showBatchMenu">
                            <span>Thực hiện hàng loạt</span>
                            <div class="m-icon mi_icon_chevron_down"></div>
                        </button>

                        <ul v-if="showBatchMenu && selectedEmployeeIds.length >= 2" class="m-dropdown-menu"
                            style="position: absolute; top: calc(100% + 4px); left: 0; z-index: 99; min-width: 160px; background: #fff; border: 1px solid #babec5; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 4px; padding: 4px 0; margin: 0; list-style: none;">
                            <li class="dropdown-item" @click="confirmBatchAction('batch_delete')">Xóa hàng loạt</li>
                            <li class="dropdown-item" @click="confirmBatchAction('stop_using')">Ngừng sử dụng hàng loạt
                            </li>
                            <li class="dropdown-item" @click="confirmBatchAction('start_using')">Sử dụng hàng loạt</li>
                        </ul>
                    </div>
                </div>

                <div class="m-toolbar-right">
                    <div class="m-search-box">
                        <MsInput v-model="searchQuery" placeholder="Tìm theo mã, tên nhân viên"
                            iconRight="m-icon mi_icon_search" />
                    </div>

                    <div class="m-toolbar-icon" title="Lấy lại dữ liệu" @click="loadData">
                        <div class="m-icon mi_icon_refresh"></div>
                    </div>
                    <div class="m-toolbar-icon" title="Xuất ra Excel" @click="handleExportExcel">
                        <div class="m-icon mi_icon_excel"></div>
                    </div>
                    <div class="m-toolbar-icon" title="Tùy chỉnh giao diện" @click="showColumnSetting = true">
                        <div class="m-icon mi_icon_setting"></div>
                    </div>

                    <ColumnSetting :isVisible="showColumnSetting" :columns="tableColumns"
                        @close="showColumnSetting = false" @save="handleApplyColumnSettings" />
                </div>
            </div>

            <div class="m-table-container">
                <MsTable :columns="visibleColumns" :data="displayData" v-model:selectedIds="selectedEmployeeIds"
                    @filter-data="onApplyFilter" @onDeleteRow="openDeleteDialog" @onEditRow="openEditForm"
                    @onCloneRow="openCloneForm" @onUpdateStatusRow="openUpdateStatusDialog" />

                <EmployeeForm :isVisible="showEmployeeForm" :editData="currentEmployeeData" @close="closeEmployeeForm"
                    @save="handleSaveEmployee" @saveSuccess="loadData" />

                <DialogConfirm :isVisible="showDeleteDialog" @close="showDeleteDialog = false"
                    @confirm="executeConfirmedAction">

                    <template v-if="confirmActionType === 'single_delete'">
                        Bạn có thực sự muốn xóa Nhân viên &lt;{{ employeeToDelete?.employeeCode }}&gt; không?
                    </template>

                    <template v-else-if="confirmActionType === 'batch_delete'">
                        Bạn có thực sự muốn xóa <b>{{ selectedEmployeeIds.length }}</b> nhân viên đã chọn không?
                    </template>

                    <template v-else-if="confirmActionType === 'single_stop_using'">
                        Bạn có thực sự muốn <b>ngừng sử dụng</b> Nhân viên &lt;{{ employeeToDelete?.employeeCode }}&gt;
                        không?
                    </template>

                    <template v-else-if="confirmActionType === 'single_start_using'">
                        Bạn có thực sự muốn <b>sử dụng</b> lại Nhân viên &lt;{{ employeeToDelete?.employeeCode }}&gt;
                        không?
                    </template>
                    <template v-else-if="confirmActionType === 'stop_using'">
                        Bạn có thực sự muốn <b>ngừng sử dụng {{ selectedEmployeeIds.length }}</b> nhân viên đã chọn
                        không?
                    </template>

                    <template v-else-if="confirmActionType === 'start_using'">
                        Bạn có thực sự muốn <b>sử dụng {{ selectedEmployeeIds.length }}</b> nhân viên đã chọn không?
                    </template>
                </DialogConfirm>

                <MsPagination class="m-pagination-fixed" :totalRecords="totalRecords" :pageSize="pageSize"
                    :currentPage="currentPage" @update:currentPage="handlePageChange"
                    @update:pageSize="handlePageSizeChange" />
            </div>
        </div>
    </div>

    <ImportExcelDialog :isVisible="showImportExcel" @close="showImportExcel = false" @importSuccess="loadData" />
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEmployeeStore } from '../../stores/Employee.store';

// Import các Base Component
import MsButton from '../../components/base/MsButton.vue';
import MsInput from '../../components/base/MsInput.vue';
import MsTable from '../../components/base/MsTable.vue';
import MsPagination from '../../components/base/MsPagination.vue';
import DialogConfirm from '../../components/base/DialogConfirm.vue';
import EmployeeForm from '../employee/EmployeeForm.vue';
import ColumnSetting from '../../components/base/ColumnSetting.vue'
import ImportExcelDialog from '../../components/Excel/ImportExcelDialog.vue';

// --- KHỞI TẠO STORE & GIỮ TÍNH PHẢN XẠ (REACTIVITY) ---
const employeeStore = useEmployeeStore();
const { employees, totalRecords, isLoading } = storeToRefs(employeeStore);

// -- trang thái ImportExcel --- 
const showAddMenu = ref(false);
const showImportExcel = ref(false);

const openImportExcel = () => {
    showAddMenu.value = false; // Đóng cái menu nhỏ lại
    showImportExcel.value = true; // Bật màn hình Excel to lên
};

// Đóng menu "Nhập từ Excel" nếu click ra ngoài khoảng trống màn hình
onMounted(() => {
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.m-btn-split')) {
            showAddMenu.value = false;
        }
    });
});

// --- CÁC BIẾN TRẠNG THÁI UI VÀ PHÂN TRANG ---
const showDeleteDialog = ref(false);
const employeeToDelete = ref(null);
const showEmployeeForm = ref(false);
const currentEmployeeData = ref(null);
const showColumnSetting = ref(false);

const mockData = ref([]);

const currentPage = ref(1);
const pageSize = ref(20);
const searchQuery = ref('');
const activeFilters = ref({});
let searchTimeout = null;

const tableColumns = ref([
    { label: 'Mã nhân viên', field: 'employeeCode', width: '130px', alignClass: 'text-left', filterable: true },
    { label: 'Tên nhân viên', field: 'fullName', width: '220px', alignClass: 'text-left', filterable: true },
    { label: 'Mã số thuế', field: 'taxCode', width: '130px', alignClass: 'text-left', filterable: true },
    { label: 'Chức danh', field: 'positionName', width: '150px', alignClass: 'text-left', filterable: true },
    { label: 'Mã đơn vị', field: 'departmentCode', width: '120px', alignClass: 'text-left', filterable: true },
    { label: 'Tên đơn vị', field: 'departmentName', width: '200px', alignClass: 'text-left', filterable: true },
    { label: 'Số tài khoản', field: 'bankAccountNumber', width: '150px', alignClass: 'text-left', filterable: true },
    { label: 'Tên ngân hàng', field: 'bankName', width: '180px', alignClass: 'text-left', filterable: true },
    { label: 'Số điện thoại di động', field: 'mobilePhoneNumber', width: '160px', alignClass: 'text-left', filterable: true },
    { label: 'Giới tính', field: 'gender', width: '100px', alignClass: 'text-left' },
    { label: 'Ngày sinh', field: 'dateOfBirth', width: '120px', alignClass: 'text-center' },
    { label: 'Số hộ chiếu', field: 'passportNumber', width: '150px', alignClass: 'text-left' },
    { label: 'Số CCCD/ CMND', field: 'identityNumber', width: '160px', alignClass: 'text-left', filterable: true },
    { label: 'Ngày cấp', field: 'issueDate', width: '120px', alignClass: 'text-center' },
    { label: 'Nơi cấp', field: 'issuePlace', width: '200px', alignClass: 'text-left', filterable: true },
    { label: 'Là khách hàng', field: 'isCustomer', width: '130px', alignClass: 'text-center', type: 'checkbox' },
    { label: 'Là nhà cung cấp', field: 'isSupplier', width: '140px', alignClass: 'text-center', type: 'checkbox' },
    { label: 'Ngày tạo', field: 'createdDate', width: '120px', alignClass: 'text-center' },
    { label: 'Người tạo', field: 'createdBy', width: '150px', alignClass: 'text-left' },
    { label: 'Ngày sửa', field: 'modifiedDate', width: '120px', alignClass: 'text-center' },
    { label: 'Người sửa', field: 'modifiedBy', width: '150px', alignClass: 'text-left' },
    { label: 'Trạng thái', field: 'status', width: '150px', alignClass: 'text-left', filterable: true }
]);

// ẩn hiển thị cột

const visibleColumns = computed(() => {
    return tableColumns.value.filter(col => col.hidden !== true && col.visible !== false && col.isShow !== false);
});

watch(employees, (newEmployees) => {
    if (newEmployees && newEmployees.length > 0) {
        mockData.value = [...newEmployees];
    } else {
        mockData.value = [];
    }
}, { immediate: true, deep: true });

const loadData = async () => {
    try {
        const params = {
            pageNumber: currentPage.value || 1,
            pageSize: pageSize.value || 20,
            keyword: searchQuery.value ? searchQuery.value.trim() : ''
        };
        await employeeStore.fetchEmployeesPaging(params);
    } catch (error) {
        console.error("Lỗi khi kết nối API, tự động đồng bộ sang MockData để duy trì hệ thống:", error);
    }
};

onMounted(() => { loadData(); });

watch(searchQuery, (newVal) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage.value = 1; // Đưa về trang đầu tiên khi có từ khóa tìm kiếm mới
        loadData();
    }, 2000);
});

watch([currentPage, pageSize], () => { loadData(); });

const displayData = computed(() => {
    let sourceData = (mockData.value && mockData.value.length > 0) ? mockData.value : (employees.value || []);

    // BƯỚC 1: Tìm kiếm theo mã và tên nhân viên (từ ô input tổng)
    const keyword = searchQuery.value ? searchQuery.value.trim().toLowerCase() : '';
    if (keyword) {
        sourceData = sourceData.filter(item => {
            const code = (item.employeeCode || '').toLowerCase();
            const name = (item.fullName || '').toLowerCase();
            return code.includes(keyword) || name.includes(keyword);
        });
    }

    // BƯỚC 2: Lọc theo từng cột (từ icon Phễu)
    return sourceData.filter(item => {
        for (const key in activeFilters.value) {
            const filterInfo = activeFilters.value[key];
            if (!filterInfo) continue;

            const op = filterInfo.operator;
            // Chuyển an toàn sang String để tránh lỗi khi lọc các cột kiểu số
            const itemValueStr = (item[key] === null || item[key] === undefined) ? '' : String(item[key]).toLowerCase();
            const searchValueStr = (filterInfo.value || '').toString().toLowerCase();

            switch (op) {
                case 'empty': if (itemValueStr !== '') return false; break;
                case 'not_empty': if (itemValueStr === '') return false; break;
                case 'equals': if (itemValueStr !== searchValueStr) return false; break;
                case 'not_equals': if (itemValueStr === searchValueStr) return false; break;
                case 'contains': if (!itemValueStr.includes(searchValueStr)) return false; break;
                case 'not_contains': if (itemValueStr.includes(searchValueStr)) return false; break;
                case 'starts_with': if (!itemValueStr.startsWith(searchValueStr)) return false; break;
                case 'ends_with': if (!itemValueStr.endsWith(searchValueStr)) return false; break;
                default: if (!itemValueStr.includes(searchValueStr)) return false;
            }
        }
        return true; // Dòng này qua được tất cả các cửa ải lọc
    });
});

const openAddForm = async () => {
    currentEmployeeData.value = null;
    showEmployeeForm.value = true;
    try { await employeeStore.fetchNewCode(); }
    catch (error) { console.error("Không thể lấy mã tự động:", error); }
};

const openEditForm = async (employeeData) => {
    try {
        const id = employeeData.employeeId;
        const fullData = await employeeStore.fetchEmployeeById(id);
        currentEmployeeData.value = { ...fullData };
        showEmployeeForm.value = true;
    } catch (error) {
        console.error("Lỗi khi tải chi tiết nhân viên:", error);
        alert("Không thể tải thông tin chi tiết nhân viên lúc này.");
    }
};

const closeEmployeeForm = () => { showEmployeeForm.value = false; };

const handleSaveEmployee = async ({ data, isSaveAndAdd }) => {
    try {
        // Kiểm tra chặt chẽ: Chỉ khi biến tạm CÓ employeeId thì mới là hành động Sửa
        // (Vì khi Nhân bản, ta đã gán ép employeeId = null rồi)
        const isEdit = currentEmployeeData.value && currentEmployeeData.value.employeeId;

        if (isEdit) {
            // ==========================================
            // 1. TRƯỜNG HỢP SỬA NHÂN VIÊN
            // ==========================================
            await employeeStore.updateEmployeeInfo(data.employeeId, data);
            await loadData(); // Tải lại bảng bình thường

        } else {
            // ==========================================
            // 2. TRƯỜNG HỢP THÊM MỚI HOẶC NHÂN BẢN
            // ==========================================
            await employeeStore.createNewEmployee(data);
            await loadData(); // Gọi API lấy trang 1 từ DB

            const existingIndex = mockData.value.findIndex(emp => emp.employeeCode === data.employeeCode);

            if (existingIndex === -1) {
                // Backend đẩy sang trang khác -> Ép đẩy dữ liệu vừa nhập lên dòng 1
                mockData.value.unshift(data);

                // Cắt bỏ dòng cuối cùng để giữ đúng số lượng pageSize (VD: Không để bảng thành 21/20 dòng)
                if (mockData.value.length > pageSize.value) {
                    mockData.value.pop();
                }
            } else if (existingIndex > 0) {
                // Nằm ở trang 1 nhưng bị đẩy xuống dưới -> Cắt nó đưa lên dòng 1
                const newEmp = mockData.value.splice(existingIndex, 1)[0];
                mockData.value.unshift(newEmp);
            }
        }

        // ==========================================
        // XỬ LÝ SAU KHI CẤT THÀNH CÔNG
        // ==========================================
        if (isSaveAndAdd) {
            currentEmployeeData.value = null; // Xóa trắng form
            await employeeStore.fetchNewCode(); // Tự động lấy mã mới điền vào
        } else {
            closeEmployeeForm(); // Cất xong thì đóng form
        }
    } catch (error) {
        console.error("Lỗi cất giữ dữ liệu:", error);
    }
};

// ==========================================================
//  QUẢN LÝ XÓA VÀ THỰC HIỆN HÀNG LOẠT
// ==========================================================

const selectedEmployeeIds = ref([]); // Chứa danh sách ID đang tích trên bảng
const showBatchMenu = ref(false); // Quản lý đóng/mở Dropdown hàng loạt
const confirmActionType = ref('');

// Reset Checkbox khi chuyển trang / tìm kiếm
watch([currentPage, pageSize, searchQuery], () => {
    selectedEmployeeIds.value = [];
});

// Click ra ngoài thì đóng menu hàng loạt
const closeBatchMenu = (e) => {
    if (!e.target.closest('.batch-action-container')) {
        showBatchMenu.value = false;
    }
};
onMounted(() => window.addEventListener('click', closeBatchMenu));
onUnmounted(() => window.removeEventListener('click', closeBatchMenu));

// 1. Kích hoạt Xóa 1 bản ghi
const openDeleteDialog = (employeeData) => {
    employeeToDelete.value = employeeData;
    confirmActionType.value = 'single_delete'; // Xác định là xóa 1
    showDeleteDialog.value = true;
};

// 2. Kích hoạt Hành động hàng loạt (Từ Menu Dropdown)
const confirmBatchAction = (actionType) => {
    confirmActionType.value = actionType; // Gắn loại hành động (batch_delete, stop_using, start_using)
    showBatchMenu.value = false; // Đóng menu dropdown
    showDeleteDialog.value = true; // Bật hộp thoại xác nhận lên
};

// 3. Hàm thi hành Đích cuối cùng (Sau khi bấm nút "Có" trên Dialog)
const executeConfirmedAction = async () => {
    try {
        if (confirmActionType.value === 'single_delete') {
            const targetId = employeeToDelete.value.employeeId || employeeToDelete.value.employeeCode;
            await employeeStore.removeEmployee(targetId);

            // 👇 BỔ SUNG ĐOẠN NÀY ĐỂ GỌI API ĐỔI TRẠNG THÁI ĐƠN LẺ 👇
        } else if (confirmActionType.value === 'single_stop_using' || confirmActionType.value === 'single_start_using') {
            // Tận dụng API hàng loạt nhưng nhét duy nhất 1 cái ID vào mảng
            await employeeStore.changeEmployeeStatus({
                ids: [employeeToDelete.value.employeeId],
                status: employeeToDelete.value.targetStatus
            });
            // 👆 KẾT THÚC BỔ SUNG 👆

        } else if (confirmActionType.value === 'batch_delete') {
            await employeeStore.removeMultipleEmployees(selectedEmployeeIds.value);
            selectedEmployeeIds.value = [];

        } else if (confirmActionType.value === 'stop_using') {
            await employeeStore.changeEmployeeStatus({
                ids: selectedEmployeeIds.value,
                status: 0
            });
            selectedEmployeeIds.value = [];

        } else if (confirmActionType.value === 'start_using') {
            await employeeStore.changeEmployeeStatus({
                ids: selectedEmployeeIds.value,
                status: 1
            });
            selectedEmployeeIds.value = [];
        }

        // Đóng dialog và lấy dữ liệu mới nhất
        showDeleteDialog.value = false;
        employeeToDelete.value = null; // Clean up biến mượn tạm
        await loadData();
    } catch (error) {
        console.error("Lỗi khi thực thi hành động:", error);
    }
};

// ==========================================================

const handleExportExcel = async () => {
    try {
        const params = { keyword: searchQuery.value.trim() };
        await employeeStore.exportEmployeesToExcel(params);
    } catch (error) { console.error("Lỗi xuất Excel:", error); }
};

const handlePageChange = (page) => { currentPage.value = page; };
const handlePageSizeChange = (size) => { pageSize.value = size; currentPage.value = 1; };
const handleApplyColumnSettings = (newColumns) => { tableColumns.value = [...newColumns]; };

// chuyển value thành String an toàn trước khi trim()
const onApplyFilter = ({ field, value, operator }) => {
    const newFilters = { ...activeFilters.value };
    const valStr = (value !== null && value !== undefined) ? String(value).trim() : '';

    if (valStr === '' && !['empty', 'not_empty'].includes(operator)) {
        delete newFilters[field];
    } else {
        newFilters[field] = { value: valStr, operator: operator };
    }
    activeFilters.value = newFilters;
};

// HÀM XỬ LÝ NHÂN BẢN: Lấy full data, reset ID và cấp mã mới
const openCloneForm = async (employeeData) => {
    try {
        const fullData = await employeeStore.fetchEmployeeById(employeeData.employeeId);
        const newCode = await employeeStore.fetchNewCode();

        // Ép dữ liệu thành bản ghi mới tinh
        const cloneData = { ...fullData };
        cloneData.employeeId = null;
        cloneData.employeeCode = newCode;

        // Reset ID của mảng ngân hàng
        if (cloneData.bankAccounts && cloneData.bankAccounts.length > 0) {
            cloneData.bankAccounts = cloneData.bankAccounts.map(b => ({
                ...b,
                bankAccountId: null,
                employeeId: null
            }));
        }

        currentEmployeeData.value = cloneData;
        showEmployeeForm.value = true;
    } catch (error) {
        console.error("Lỗi khi nhân bản:", error);
        alert("Không thể tải dữ liệu để nhân bản.");
    }
};

// HÀM  ĐỔI TRẠNG THÁI 
const openUpdateStatusDialog = ({ row, status }) => {
    // Mượn tạm employeeToDelete để lưu dòng đang chọn và trạng thái muốn đổi thành
    employeeToDelete.value = { ...row, targetStatus: status };
    confirmActionType.value = status === 0 ? 'single_stop_using' : 'single_start_using';
    showDeleteDialog.value = true;
};
</script>

<style scoped>
/* --- 1. TỔNG THỂ TRANG --- */
.m-employee-view {
    height: 100vh;
    background-color: #f4f5f8;
    padding: 0 0 20px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
}

/* --- 2. HEADER TRANG --- */
.m-page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px 16px 0 0;
}

.m-page-title-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.m-page-title {
    font-size: 24px;
    font-weight: 700;
    color: #111;
    margin: 0;
}

.m-back-link {
    display: flex;
    align-items: center;
    color: #0075c0;
    text-decoration: none;
    font-size: 13px;
    cursor: pointer;
    margin-top: 4px;
}

.m-back-link .m-icon {
    margin-right: 4px;
}

.m-back-link:hover {
    text-decoration: underline;
}

.m-btn-split {
    display: flex;
    height: 36px;
    border-radius: 3px;
}

.m-btn-main {
    background-color: #2ca01c !important;
    color: #fff !important;
    border: none !important;
    padding: 0 16px !important;
    font-weight: 600 !important;
    border-radius: 30px 0 0 30px;
}

.m-btn-main:hover,
.m-btn-dropdown-icon:hover {
    background-color: #35bf22 !important;
}

.m-btn-divider {
    width: 1px;
    background-color: #fff;
    opacity: 0.3;
}

.m-btn-dropdown-icon {
    background-color: #2ca01c !important;
    border: none !important;
    padding: 0 8px !important;
    min-width: unset !important;
    border-radius: 0 30px 30px 0;
}

/* --- 3. KHỐI NỘI DUNG --- */
.m-page-content {
    background-color: #ffffff;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-radius: 4px;
    padding: 16px 16px 40px 16px;
    box-sizing: border-box;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

/* --- 4. TOOLBAR --- */
.m-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.m-toolbar-left {
    display: flex;
    align-items: center;
    margin-left: 20px;
}

.m-toolbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.m-search-box {
    width: 260px;
}

.m-toolbar-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Button Utilities & Batch Action */
.btn-dropdown.m-btn-util {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    height: 36px !important;
    padding: 0 16px !important;
    border-radius: 20px !important;
    border: 1px solid #8d9096 !important;
    background-color: #fff !important;
    width: fit-content !important;
    line-height: 1 !important;
    opacity: 0.5;
    pointer-events: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    /* Thêm con trỏ bàn tay */
}

.btn-dropdown.m-btn-util .mi_icon_chevron_down {
    width: 16px !important;
    height: 16px !important;
    margin: 0 !important;
    flex-shrink: 0 !important;
    transform: translateY(5px);
    opacity: 0.6;
}

.btn-dropdown.m-btn-util span {
    color: #9b9b9b !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    display: flex !important;
    align-items: center !important;
    line-height: 1 !important;
}

.btn-dropdown.m-btn-util:hover {
    border-color: #111 !important;
    color: #111 !important;
}

/* Trạng thái active (hàng loạt) */
.btn-dropdown.m-btn-util.active-batch {
    opacity: 1;
    pointer-events: auto;
    border: 2px solid #111 !important;
}

.btn-dropdown.m-btn-util.active-batch span {
    color: #111 !important;
}

.btn-dropdown.m-btn-util.active-batch .mi_icon_chevron_down {
    opacity: 1 !important;
}

/* M-btn-util định nghĩa riêng */
.m-btn-util {
    border: 2px solid #e0e0e0 !important;
    border-radius: 30px !important;
    padding: 0 16px !important;
    color: #111 !important;
    font-weight: 600 !important;
    background-color: transparent !important;
    height: 32px !important;
    display: flex;
    align-items: center;
    gap: 8px;
}

.dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
}

.dropdown-item:hover {
    background-color: #f4f5f8;
    color: #2ca01c;
}

/* --- 5. TABLE & PAGINATION --- */
.m-table-container {
    height: calc(100vh - 180px);
    position: relative;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    border-bottom: none;
}

.m-pagination-fixed {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    z-index: 10;
    border-top: 1px solid #e0e0e0;
    background-color: #fff;
    padding: 0 12px;
}

/* --- 6. ICONS --- */
.m-icon {
    background: url(../../assets/icons/Sprites-7ba27b53.svg) no-repeat center;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
}

.mi_icon_chevron_left_blue {
    background-color: #0075c0;
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>');
    width: 16px;
    height: 16px;
}

.mi_icon_chevron_down_white {
    background-position: -848px -359px;
    width: 16px !important;
    height: 16px !important;
    min-width: 16px;
    min-height: 16px;
    margin-right: 6px;
}

.mi_icon_refresh {
    background-position: -424px -200px;
}

.mi_icon_excel {
    background-position: -704px -200px;
}

.mi_icon_setting {
    background-position: -88px -200px;
}

.mi_icon_search {
    background-position: -992px -360px;
}

.mi_icon_chevron_down {
    background-position: -560px -359px;
}

.mi_icon_arrow_check {
    background-position: -256px -143px;
}
</style>