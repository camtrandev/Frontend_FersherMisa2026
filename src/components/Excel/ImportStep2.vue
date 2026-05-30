<template>
    <div class="step-content">
        <div class="validation-summary">
            <div style="color: #00a54f; font-weight: 600;">1. Có {{ validCount }} nhân viên đủ điều kiện</div>
            <div style="color: #e5a326; font-weight: 600;">2. Có {{ missingCount }} nhân viên thiếu trường Mã / Mã Đơn
                vị không hợp lệ</div>
            <div style="color: #ed1c24; font-weight: 600;">3. Có {{ duplicateCount }} nhân viên có mã trùng</div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin: 12px 0;">
            <div style="color: #ed1c24; font-size: 14px;">
                <b>{{ missingCount + duplicateCount }}</b> dòng dữ liệu không hợp lệ
                <a href="#" style="color: #0075c0; text-decoration: none; margin-left: 8px;">Tải tệp kiểm tra ⬇</a>
            </div>

            <div style="display: flex; align-items: center;">
                <span style="margin-right: 8px; font-size: 13px;">Lọc tình trạng: </span>
                <select v-model="filterStatus" class="m-select" style="width: 150px; height: 32px;">
                    <option value="all">Tất cả</option>
                    <option value="valid">Hợp lệ</option>
                    <option value="invalid">Không hợp lệ</option>
                </select>
            </div>
        </div>

        <div class="m-table-container step-2-table">
            <table class="m-table">
                <thead>
                    <tr>
                        <th class="freeze-col" style="left: 0; width: 60px; text-align: center; z-index: 3;">Dòng số
                        </th>
                        <th class="freeze-col" style="left: 60px; width: 120px; z-index: 3;">Tình trạng</th>
                        <th class="freeze-col" style="left: 180px; width: 250px; z-index: 3;">Chi tiết lỗi</th>
                        <th style="min-width: 150px;">Mã nhân viên</th>
                        <th style="min-width: 200px;">Tên nhân viên</th>
                        <th style="min-width: 100px;">Giới tính</th>
                        <th style="min-width: 120px;">Ngày sinh</th>
                        <th style="min-width: 150px;">Chức danh</th>
                        <th style="min-width: 150px;">Mã đơn vị</th>
                        <th style="min-width: 200px;">Tên đơn vị</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in filteredData" :key="index" :class="getRowClass(row.status)">
                        <td class="text-center freeze-col" style="left: 0;">{{ index + 2 }}</td>
                        <td class="freeze-col" style="left: 60px; font-weight: bold;"
                            :style="{ color: row.status === 'valid' ? '#00a54f' : '#ed1c24' }">
                            {{ row.status === 'valid' ? 'Hợp lệ' : 'Không hợp lệ' }}
                        </td>
                        <td class="freeze-col" style="left: 180px; color: #ed1c24; font-size: 13px;">{{ row.errorMsg }}
                        </td>

                        <td><input type="text" v-model="row.employeeCode" @blur="validateAll" class="m-input-td" /></td>
                        <td><input type="text" v-model="row.fullName" class="m-input-td" /></td>
                        <td><input type="text" v-model="row.genderName" class="m-input-td" /></td>
                        <td><input type="text" v-model="row.dateOfBirth" class="m-input-td" /></td>
                        <td><input type="text" v-model="row.positionName" class="m-input-td" /></td>
                        <td><input type="text" v-model="row.departmentCode" @blur="validateAll" class="m-input-td" /></td>
                        <td><input type="text" v-model="row.departmentName" class="m-input-td" /></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 13px;">
            <div>Tổng số: <b>{{ filteredData.length }}</b> bản ghi</div>
            <button class="m-btn-util" @click="validateAll">
                <span style="color: #0075c0; font-weight: bold;">✔ Kiểm tra lại dữ liệu</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useEmployeeStore } from '../../stores/Employee.store'; // Nhớ check đúng đường dẫn

const props = defineProps({ tableData: Array });
const emit = defineEmits(['validation-done']);

const employeeStore = useEmployeeStore();

const validCount = ref(0);
const missingCount = ref(0);
const duplicateCount = ref(0);
const filterStatus = ref('all');

const filteredData = computed(() => {
    if (filterStatus.value === 'valid') return props.tableData.filter(r => r.status === 'valid');
    if (filterStatus.value === 'invalid') return props.tableData.filter(r => r.status !== 'valid');
    return props.tableData;
});

const getRowClass = (status) => {
    if (status === 'valid') return 'row-valid';      // Xanh
    if (status === 'missing') return 'row-missing';  // Vàng
    if (status === 'duplicate') return 'row-duplicate';// Đỏ
    return '';
};

// ==========================================
// HÀM KIỂM TRA ĐIỀU KIỆN
// ==========================================
// ==========================================
// HÀM KIỂM TRA ĐIỀU KIỆN (ĐÃ GHÉP API HÀNG LOẠT)
// ==========================================
const validateAll = async () => {
    validCount.value = 0;
    missingCount.value = 0;
    duplicateCount.value = 0;

    // 1. Lấy mã phòng ban
    let depts = employeeStore.departments;
    if (!depts || depts.length === 0) {
        depts = await employeeStore.fetchAllDepartments();
    }
    const deptCodes = depts.map(d => d.departmentCode.toLowerCase());

    // 2. Gom mã để check hàng loạt
    const allCodes = props.tableData
        .filter(row => row.employeeCode && String(row.employeeCode).trim() !== '')
        .map(row => String(row.employeeCode).trim());

    // 🔴 SỬA LỖI Ở ĐÂY: API trả về List<string> (các mã trùng)
    let duplicatedCodesFromServer = [];
    try {
        // Giả sử API trả về mảng ["NV001", "NV002"]
        duplicatedCodesFromServer = await employeeStore.checkDuplicateCodesList(allCodes);
    } catch (error) {
        console.error("Lỗi gọi API:", error);
    }

    // 3. Vòng lặp xử lý
    for (let row of props.tableData) {
        row.status = 'valid';
        row.errorMsg = '';
        const currentCode = String(row.employeeCode || '').trim();

        // Kiểm tra thiếu mã (Vàng)
        if (!currentCode) {
            row.status = 'missing';
            row.errorMsg = 'Mã nhân viên không được để trống.';
            missingCount.value++;
            continue;
        }

        // Kiểm tra phòng ban (Vàng)
        if (!row.departmentCode || !deptCodes.includes(String(row.departmentCode).trim().toLowerCase())) {
            row.status = 'missing';
            row.errorMsg = `Mã đơn vị <${row.departmentCode}> không tồn tại.`;
            missingCount.value++;
            continue;
        }

        // 🔴 SỬA LỖI Ở ĐÂY: Kiểm tra trong mảng string trả về
        if (duplicatedCodesFromServer.includes(currentCode)) {
            row.status = 'duplicate'; // (Đỏ)
            row.errorMsg = `Mã nhân viên <${currentCode}> đã tồn tại.`;
            duplicateCount.value++;
            continue;
        }

        validCount.value++;
    }

    emit('validation-done', validCount.value);
};

defineExpose({ validateAll });
</script>

<style scoped>
.validation-summary {
    margin-bottom: 12px;
    line-height: 1.8;
    background: #fff;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}

.step-2-table {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    background: #fff;
    border: 1px solid #e0e0e0;
    height: 320px;
}

.m-table {
    width: max-content;
    min-width: 100%;
    border-collapse: collapse;
}

.m-table th,
.m-table td {
    white-space: nowrap;
    padding: 6px 10px;
    border-right: 1px dotted #c7c7c7;
    border-bottom: 1px solid #c7c7c7;
}

.m-table th {
    background: #eceef1;
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 1;
    border-right-style: solid;
}

.freeze-col {
    position: sticky !important;
    background-color: inherit;
    z-index: 2;
    border-right: 1px solid #c7c7c7 !important;
}

.m-table th.freeze-col {
    background-color: #eceef1 !important;
    z-index: 4;
}

/* 3 TRƯỜNG HỢP MÀU SẮC */
.row-valid td {
    background-color: #e8f5e9 !important;
}

/* Xanh lá nhạt */
.row-missing td {
    background-color: #fff8e1 !important;
}

/* Vàng nhạt */
.row-duplicate td {
    background-color: #ffebee !important;
}

/* Đỏ nhạt */

.m-input-td {
    width: 100%;
    border: 1px solid transparent;
    background: transparent;
    padding: 4px;
    outline: none;
}

.m-input-td:focus {
    border-color: #00a54f;
    background: #fff;
}

.m-btn-util {
    border: 1px solid #e0e0e0;
    background: #fff;
    padding: 6px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.m-select {
    border: 1px solid #babec5;
    border-radius: 3px;
    padding: 0 8px;
}
</style>