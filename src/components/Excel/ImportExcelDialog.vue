<template>
    <div class="m-dialog-overlay full-screen" v-if="isVisible">
        <div class="m-dialog-box import-dialog">

            <div class="m-dialog-header">
                <h2 class="dialog-title">Nhập nhân viên từ Excel</h2>
                <div class="header-actions">
                    <div class="icon-btn" title="Trợ giúp">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="#666" stroke-width="2" fill="none">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <div class="icon-btn icon-close" @click="closeDialog" title="Đóng">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#666" stroke-width="2" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="wizard-container">
                <div class="step" :class="{ 'active': currentStep === 1, 'passed': currentStep > 1 }">
                    <div class="step-number">1</div>
                    <div class="step-text">CHỌN TỆP NGUỒN</div>
                </div>
                <div class="step-line" :class="{ 'passed-line': currentStep > 1 }"></div>

                <div class="step" :class="{ 'active': currentStep === 2, 'passed': currentStep > 2 }">
                    <div class="step-number">2</div>
                    <div class="step-text">KIỂM TRA DỮ LIỆU</div>
                </div>
                <div class="step-line" :class="{ 'passed-line': currentStep > 2 }"></div>

                <div class="step" :class="{ 'active': currentStep === 3 }">
                    <div class="step-number">3</div>
                    <div class="step-text">KẾT QUẢ NHẬP KHẨU</div>
                </div>
            </div>

            <div class="m-dialog-body">
                <ImportStep1 v-show="currentStep === 1" @file-loaded="onFileLoaded" @file-cleared="onFileCleared" />

                <ImportStep2 v-show="currentStep === 2" ref="step2Ref" :tableData="sharedData"
                    @validation-done="val => validRecordsCount = val" />

                <ImportStep3 v-show="currentStep === 3" :successData="successData" />
            </div>

            <div class="m-dialog-footer import-footer">
                <div class="footer-left">
                    <button class="m-btn m-btn-secondary btn-dark-mode" @click="closeDialog">Hủy</button>
                </div>
                <div class="footer-right">
                    <button v-if="currentStep === 2" class="m-btn m-btn-secondary btn-dark-mode"
                        @click="currentStep = 1" style="margin-right: 8px;">Quay lại</button>

                    <button v-if="currentStep === 1" class="m-btn m-btn-primary" @click="goToStep2"
                        :disabled="sharedData.length === 0">Tiếp tục</button>
                    <button v-if="currentStep === 2" class="m-btn m-btn-primary" @click="executeSave"
                        :disabled="validRecordsCount === 0">Thực hiện</button>
                    <button v-if="currentStep === 3" class="m-btn m-btn-primary" @click="closeDialog">Đóng</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useEmployeeStore } from '../../stores/Employee.store'
// Import 3 Component con
import ImportStep1 from './ImportStep1.vue';
import ImportStep2 from './ImportStep2.vue';
import ImportStep3 from './ImportStep3.vue';

const props = defineProps({ isVisible: Boolean });
const emit = defineEmits(['close', 'importSuccess']);

const employeeStore = useEmployeeStore();

const currentStep = ref(1);
const sharedData = ref([]); // Data đọc từ Excel
const successData = ref([]); // Data lưu thành công
const validRecordsCount = ref(0);

const step2Ref = ref(null); // Để gọi hàm Validate của Bước 2

// Sự kiện từ Bước 1
const onFileLoaded = (data) => { sharedData.value = data; };
const onFileCleared = () => { sharedData.value = []; };

const closeDialog = () => {
    currentStep.value = 1;
    sharedData.value = [];
    successData.value = [];
    validRecordsCount.value = 0;
    emit('close');
};

// Sang bước 2 và kích hoạt Validate
const goToStep2 = async () => {
    currentStep.value = 2;
    // Chờ DOM render xong Bước 2 rồi mới gọi hàm check
    setTimeout(() => {
        if (step2Ref.value) step2Ref.value.validateAll();
    }, 100);
};

// Thực thi lưu Data ở Bước 3
const executeSave = async () => {
    const validRows = sharedData.value.filter(r => r.status === 'valid');
    successData.value = [];

    // Map mã phòng ban ra ID trước khi gửi DB
    const depts = employeeStore.departments || await employeeStore.fetchAllDepartments();

    for (let row of validRows) {
        try {
            const payload = {
                employeeCode: row.employeeCode,
                fullName: row.fullName,
                departmentId: depts.find(d => d.departmentCode.toLowerCase() === row.departmentCode.toLowerCase())?.departmentId
            };
            await employeeStore.createNewEmployee(payload);
            successData.value.push(row);
        } catch (e) {
            console.error("Lỗi dòng:", row.employeeCode);
        }
    }

    currentStep.value = 3;
    emit('importSuccess'); // Báo trang ngoài tải lại dữ liệu
};
</script>

<style scoped>
/* 🔴 CSS CHE PHỦ TOÀN MÀN HÌNH */
.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f4f5f8;
    z-index: 9999;
    display: flex;
}

.import-dialog {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    background: #f4f5f8;
}

.m-dialog-header {
    background-color: #fff;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dialog-title {
    font-size: 24px;
    font-weight: 700;
    color: #111;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.icon-btn {
    cursor: pointer;
}

/* WIZARD */
.wizard-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    padding: 24px 0;
    margin-bottom: 24px;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #999;
}

.step-number {
    width: 32px;
    height: 32px;
    border: 2px solid #ccc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 8px;
    background: #fff;
    z-index: 2;
}

.step-text {
    font-size: 13px;
    font-weight: bold;
}

.step.active .step-number {
    border-color: #2ca01c;
    color: #2ca01c;
}

.step.active .step-text {
    color: #2ca01c;
}

.step.passed .step-number {
    background: #2ca01c;
    border-color: #2ca01c;
    color: #fff;
}

.step.passed .step-text {
    color: #2ca01c;
}

.step-line {
    height: 2px;
    width: 300px;
    background: #ccc;
    margin: -24px 16px 0 16px;
    z-index: 1;
}

.passed-line {
    background: #2ca01c;
}

.m-dialog-body {
    flex: 1;
    overflow-y: auto;
    padding: 0 40px;
}

/* FOOTER ĐEN */
.import-footer {
    background-color: #38393d;
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
}

.btn-dark-mode {
    color: #fff !important;
    border-color: #fff !important;
    background: transparent !important;
}

.btn-dark-mode:hover {
    background: rgba(255, 255, 255, 0.1) !important;
}
</style>