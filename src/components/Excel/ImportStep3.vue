<template>
    <div class="step-content">
        <h2 style="color: #00a54f; text-align: center; margin-bottom: 8px; font-size: 24px;">Thêm thành công!</h2>
        <p style="text-align: center; margin-bottom: 24px; font-size: 14px;">
            Số lượng nhân viên được thêm: <b style="font-size: 16px;">{{ successData.length }}</b>
        </p>

        <div class="m-table-container" style="height: 320px; overflow-y: auto; border: 1px solid #e0e0e0;">
            <table class="m-table">
                <thead>
                    <tr>
                        <th style="width: 150px;">Mã nhân viên</th>
                        <th style="width: 250px;">Tên nhân viên</th>
                        <th>Mã đơn vị</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(emp, index) in paginatedList" :key="index">
                        <td style="padding: 10px;">{{ emp.employeeCode }}</td>
                        <td style="padding: 10px;">{{ emp.fullName }}</td>
                        <td style="padding: 10px;">{{ emp.departmentCode }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="margin-top: 16px;">
            <MsPagination :totalRecords="successData.length" :pageSize="pageSize" :currentPage="currentPage"
                @update:currentPage="currentPage = $event" @update:pageSize="handlePageSizeChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// Nhớ sửa lại đường dẫn trỏ tới MsPagination cho chuẩn dự án của bạn nhé
import MsPagination from '../base/MsPagination.vue';

const props = defineProps({ successData: Array });

// Biến quản lý phân trang cục bộ
const currentPage = ref(1);
const pageSize = ref(20);

// Cắt dữ liệu dựa trên trang hiện tại
const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return props.successData.slice(start, start + pageSize.value);
});

// Hàm xử lý đổi số bản ghi/trang
const handlePageSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1; // Reset về trang 1
};
</script>

<style scoped>
.m-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
}

.m-table th {
    background: #eceef1;
    position: sticky;
    top: 0;
    padding: 10px;
    border-right: 1px solid #c7c7c7;
    border-bottom: 1px solid #c7c7c7;
    font-weight: bold;
    text-align: left;
}

.m-table td {
    border-right: 1px dotted #c7c7c7;
    border-bottom: 1px solid #c7c7c7;
}
</style>