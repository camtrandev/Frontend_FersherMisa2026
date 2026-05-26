<template>
    <div class="m-dialog-overlay" v-if="isVisible">
        <div class="m-dialog-box">
            <div class="m-dialog-header">
                <div class="header-left">
                    <h2 class="dialog-title">Thông tin nhân viên</h2>
                    <div class="checkbox-group">
                        <label class="m-checkbox-label">
                            <input type="checkbox" v-model="isCustomer" class="m-checkbox">
                            <span class="checkmark"></span>
                            Là khách hàng
                        </label>
                        <label class="m-checkbox-label">
                            <input type="checkbox" v-model="isVendor" class="m-checkbox">
                            <span class="checkmark"></span>
                            Là nhà cung cấp
                        </label>
                    </div>
                </div>
                <div class="header-right">
                    <div class="icon-btn" title="Trợ giúp">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <div class="icon-btn icon-close" @click="closeForm" title="Đóng">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="m-dialog-body">
                <div class="info-layout">
                    <div class="info-left">
                        <div class="form-row">
                            <div class="form-group w-40 pr-1">
                                <label>Mã <span class="required">*</span></label>
                                <input type="text" v-model="employee.employeeCode" class="m-input" />
                            </div>
                            <div class="form-group w-60">
                                <label>Tên <span class="required">*</span></label>
                                <input type="text" v-model="employee.employeeName" class="m-input" />
                            </div>
                        </div>
                        <div class="form-row mt-2">
                            <div class="form-group w-100">
                                <label>Đơn vị <span class="required">*</span></label>
                                <select v-model="employee.departmentId" class="m-input m-select">
                                    <option value=""></option>
                                    <option value="1">Phòng Giám đốc</option>
                                    <option value="2">Phòng Kinh doanh</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row mt-2">
                            <div class="form-group w-100">
                                <label>Chức danh</label>
                                <input type="text" v-model="employee.positionName" class="m-input" />
                            </div>
                        </div>
                    </div>

                    <div class="info-right">
                        <div class="form-row">
                            <div class="form-group w-30 pr-1">
                                <label>Ngày sinh</label>
                                <input type="date" v-model="employee.dateOfBirth" class="m-input" />
                            </div>
                            <div class="form-group w-40 pr-1">
                                <label>Giới tính</label>
                                <div class="radio-group">
                                    <label class="m-radio"><input type="radio" v-model="employee.gender" value="1"
                                            name="gender"><span>Nam</span></label>
                                    <label class="m-radio"><input type="radio" v-model="employee.gender" value="0"
                                            name="gender"><span>Nữ</span></label>
                                </div>
                            </div>
                            <div class="form-group w-30">
                                <label>Số hộ chiếu</label>
                                <input type="text" v-model="employee.passport" class="m-input" />
                            </div>
                        </div>
                        <div class="form-row mt-2">
                            <div class="form-group w-60 pr-1">
                                <label>Số CMND/CCCD</label>
                                <input type="text" v-model="employee.identityNumber" class="m-input" />
                            </div>
                            <div class="form-group w-40">
                                <label>Ngày cấp</label>
                                <input type="date" v-model="employee.identityDate" class="m-input" />
                            </div>
                        </div>
                        <div class="form-row mt-2">
                            <div class="form-group w-100">
                                <label>Nơi cấp</label>
                                <input type="text" v-model="employee.identityPlace" class="m-input" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dynamic-layout mt-2" v-if="isCustomer || isVendor">
                    <div class="form-row">
                        <div class="form-group w-50 pr-2 relative-group">
                            <label>Nhóm khách hàng, nhà cung cấp</label>
                            <div class="input-with-add">
                                <select class="m-input m-select">
                                    <option></option>
                                </select>
                                <div class="btn-add-quick">+</div>
                            </div>
                        </div>

                        <div class="w-50 flex-row gap-1">
                            <div class="form-group w-50" v-if="isCustomer">
                                <label>TK công nợ phải thu</label>
                                <select v-model="employee.receivableAccount" class="m-input m-select">
                                    <option value="131">131</option>
                                    <option value="1311">1311</option>
                                </select>
                            </div>

                            <div class="form-group w-50" v-if="isVendor">
                                <label>TK công nợ phải trả</label>
                                <select v-model="employee.payableAccount" class="m-input m-select">
                                    <option value="331">331</option>
                                    <option value="3311">3311</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="m-tabs mt-4">
                    <div class="tab-headers">
                        <div class="tab-item" :class="{ active: activeTab === 1 }" @click="activeTab = 1">Thông tin tiền
                            lương</div>
                        <div class="tab-item" :class="{ active: activeTab === 2 }" @click="activeTab = 2">Tài khoản ngân
                            hàng</div>
                        <div class="tab-item" :class="{ active: activeTab === 3 }" @click="activeTab = 3">Thông tin liên
                            hệ</div>
                    </div>

                    <div class="tab-content">
                        <div v-show="activeTab === 1" class="tab-pane">
                            <div class="form-row">
                                <div class="form-group w-25 pr-1">
                                    <label>Lương thỏa thuận</label>
                                    <input type="text" class="m-input text-right" value="0" />
                                </div>
                                <div class="form-group w-25 pr-1">
                                    <label>Hệ số lương</label>
                                    <input type="text" class="m-input text-right" value="0,00" />
                                </div>
                                <div class="form-group w-50">
                                    <label>Lương đóng bảo hiểm</label>
                                    <input type="text" class="m-input text-right" value="0" />
                                </div>
                            </div>
                            <div class="form-row mt-2">
                                <div class="form-group w-25 pr-1">
                                    <label>Mã số thuế</label>
                                    <input type="text" class="m-input" />
                                </div>
                                <div class="form-group w-50 pr-1">
                                    <label>Loại hợp đồng <span class="required">*</span></label>
                                    <select class="m-input m-select">
                                        <option>Cư trú và có HĐLĐ từ 3 tháng trở lên</option>
                                    </select>
                                </div>
                                <div class="form-group w-25">
                                    <label>Số người phụ thuộc</label>
                                    <input type="number" class="m-input text-right" value="0" />
                                </div>
                            </div>
                        </div>

                        <div v-show="activeTab === 2" class="tab-pane">
                            <table class="m-table-bank">
                                <thead>
                                    <tr>
                                        <th style="width: 150px">Số tài khoản</th>
                                        <th style="width: 200px">Tên ngân hàng</th>
                                        <th style="width: 150px">Chi nhánh</th>
                                        <th>Tỉnh/TP của ngân hàng</th>
                                        <th style="width: 40px; text-align: center;"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(bank, index) in bankAccounts" :key="index">
                                        <td><input type="text" v-model="bank.accountNumber" class="m-input-td"
                                                :class="{ 'focus-border': bank.focused }" @focus="bank.focused = true"
                                                @blur="bank.focused = false" /></td>
                                        <td><input type="text" v-model="bank.bankName" class="m-input-td" /></td>
                                        <td><input type="text" v-model="bank.branch" class="m-input-td" /></td>
                                        <td><input type="text" v-model="bank.province" class="m-input-td" /></td>
                                        <td class="text-center">
                                            <div class="icon-trash" @click="removeBankRow(index)" title="Xóa dòng">
                                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor"
                                                    stroke-width="2" fill="none">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path
                                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                                    </path>
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="table-actions mt-2">
                                <button class="m-btn-util" @click="addBankRow">Thêm dòng</button>
                                <button class="m-btn-util" @click="clearAllBankRows">Xóa hết dòng</button>
                            </div>
                        </div>

                        <div v-show="activeTab === 3" class="tab-pane">
                            <div class="form-row">
                                <div class="form-group w-100">
                                    <label>Địa chỉ</label>
                                    <input type="text" v-model="employee.address" class="m-input" />
                                </div>
                            </div>
                            <div class="form-row mt-2">
                                <div class="form-group w-25 pr-1">
                                    <label>ĐT di động</label>
                                    <input type="text" v-model="employee.mobile" class="m-input" />
                                </div>
                                <div class="form-group w-25 pr-1">
                                    <label>ĐT cố định</label>
                                    <input type="text" v-model="employee.landline" class="m-input" />
                                </div>
                                <div class="form-group w-25">
                                    <label>Email</label>
                                    <input type="text" v-model="employee.email" class="m-input" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="m-dialog-footer">
                <div class="footer-left">
                    <button class="m-btn m-btn-secondary" @click="closeForm">Hủy</button>
                </div>
                <div class="footer-right">
                    <button class="m-btn m-btn-secondary" @click="saveForm(false)">Cất</button>
                    <button class="m-btn m-btn-primary" @click="saveForm(true)">Cất và Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    isVisible: { type: Boolean, default: false },
    // Dùng để phân biệt Thêm hay Sửa (truyền ID vào)
    editData: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save']);

// Trạng thái các Checkbox động
const isCustomer = ref(false);
const isVendor = ref(false);

// Tab đang được chọn
const activeTab = ref(1);

// Dữ liệu chính của Form
const employee = ref({
    employeeCode: 'NV00002',
    employeeName: '',
    departmentId: '',
    positionName: '',
    dateOfBirth: '',
    gender: '1',
    passport: '',
    identityNumber: '',
    identityDate: '',
    identityPlace: '',
    receivableAccount: '131',
    payableAccount: '331',
    address: '',
    mobile: '',
    landline: '',
    email: ''
});

// Dữ liệu bảng tài khoản ngân hàng
const bankAccounts = ref([
    { accountNumber: '', bankName: '', branch: '', province: '', focused: false }
]);

// Hàm thêm dòng bảng Ngân hàng
const addBankRow = () => {
    bankAccounts.value.push({ accountNumber: '', bankName: '', branch: '', province: '', focused: false });
};

// Hàm xóa 1 dòng bảng Ngân hàng
const removeBankRow = (index) => {
    bankAccounts.value.splice(index, 1);
    if (bankAccounts.value.length === 0) {
        addBankRow(); // Luôn giữ lại ít nhất 1 dòng trống nếu cần (tuỳ nghiệp vụ)
    }
};

// Hàm xóa toàn bộ dòng
const clearAllBankRows = () => {
    bankAccounts.value = [];
    addBankRow(); // Reset về 1 dòng trắng
};

// Đóng form
const closeForm = () => {
    emit('close');
};

// Lưu form (truyền cờ isSaveAndAdd để biết bấm nút nào)
const saveForm = (isSaveAndAdd) => {
    const payload = {
        ...employee.value,
        isCustomer: isCustomer.value,
        isVendor: isVendor.value,
        bankAccounts: bankAccounts.value
    };

    // Validate trước khi gửi (Tự bổ sung logic)

    // Gửi ra ngoài cho component cha gọi API
    emit('save', { data: payload, isSaveAndAdd });
};

// Theo dõi nếu có dữ liệu truyền vào (Chế độ Sửa)
watch(() => props.editData, (newData) => {
    if (newData) {
        // Gán dữ liệu tương ứng (Chỗ này bạn map với Object từ API về)
        // employee.value = { ...newData };
        // isCustomer.value = newData.isCustomer;
        // isVendor.value = newData.isVendor;
    }
}, { immediate: true });

</script>

<style scoped>
/* ================= TỔNG QUAN & OVERLAY ================= */
* {
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
}

.m-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.m-dialog-box {
    background-color: #fff;
    width: 900px;
    /* Rộng chuẩn xác để chia cột không bị vỡ */
    border-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
}

/* ================= HEADER ================= */
.m-dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px 24px 0 24px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 24px;
}

.dialog-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: #111;
}

.checkbox-group {
    display: flex;
    gap: 20px;
    margin-top: 4px;
}

.header-right {
    display: flex;
    gap: 12px;
}

.icon-btn {
    cursor: pointer;
    color: #555;
    transition: color 0.2s;
}

.icon-btn:hover {
    color: #111;
}

/* Checkbox Custom chuẩn MISA */
.m-checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    padding-left: 24px;
}

.m-checkbox-label input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.checkmark {
    position: absolute;
    top: -2px;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 1px solid #babec5;
    border-radius: 2px;
}

.m-checkbox-label:hover input~.checkmark {
    border-color: #2ca01c;
}

.m-checkbox-label input:checked~.checkmark {
    background-color: #fff;
    border-color: #2ca01c;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid #2ca01c;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.m-checkbox-label input:checked~.checkmark:after {
    display: block;
}

/* ================= BODY & FORM GRID ================= */
.m-dialog-body {
    padding: 24px;
    flex: 1;
}

.info-layout {
    display: flex;
    gap: 24px;
    /* Khoảng cách giữa cột trái và cột phải */
}

.info-left,
.info-right {
    width: 50%;
}

.form-row {
    display: flex;
    width: 100%;
}

.flex-row {
    display: flex;
}

.gap-1 {
    gap: 8px;
}

/* Tiện ích Width & Padding */
.w-25 {
    width: 25%;
}

.w-30 {
    width: 30%;
}

.w-40 {
    width: 40%;
}

.w-50 {
    width: 50%;
}

.w-60 {
    width: 60%;
}

.w-100 {
    width: 100%;
}

.pr-1 {
    padding-right: 8px;
}

.pr-2 {
    padding-right: 24px;
}

.mt-2 {
    margin-top: 12px;
}

.mt-4 {
    margin-top: 24px;
}

.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
}

/* Form Group & Input */
.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: 600;
    margin-bottom: 4px;
    color: #111;
}

.required {
    color: red;
}

.m-input {
    height: 32px;
    padding: 0 10px;
    border: 1px solid #babec5;
    border-radius: 2px;
    outline: none;
    background-color: #fff;
    color: #111;
}

.m-input:focus {
    border-color: #2ca01c;
}

/* Box Khách hàng nhà cung cấp (Có dấu +) */
.relative-group {
    position: relative;
}

.input-with-add {
    display: flex;
    align-items: center;
}

.input-with-add .m-select {
    flex: 1;
    border-right: none;
    border-radius: 2px 0 0 2px;
}

.btn-add-quick {
    height: 32px;
    width: 32px;
    border: 1px solid #babec5;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    color: #2ca01c;
    font-weight: bold;
    border-radius: 0 2px 2px 0;
}

.btn-add-quick:hover {
    background-color: #f2f2f2;
}

/* Radio Buttons */
.radio-group {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 32px;
}

.m-radio {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 4px;
}

.m-radio input[type="radio"] {
    accent-color: #2ca01c;
    /* Đổi màu xanh lá mặc định */
    width: 16px;
    height: 16px;
}

/* ================= TABS ================= */
.m-tabs {
    border: 1px solid #c9ccd2;
    padding-bottom: 16px;
}

.tab-headers {
    display: flex;
    background-color: #f2f2f2;
}

.tab-item {
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    border-right: 1px solid #c9ccd2;
    border-bottom: 1px solid #c9ccd2;
}

.tab-item:hover {
    color: #2ca01c;
}

.tab-item.active {
    background-color: #cce4f9;
    /* Màu xanh lơ nhạt đặc trưng MISA */
    border-bottom: none;
    font-weight: 600;
}

.tab-pane {
    padding: 16px;
}

/* ================= BẢNG NGÂN HÀNG ================= */
.m-table-bank {
    width: 100%;
    border-collapse: collapse;
}

.m-table-bank th,
.m-table-bank td {
    border: 1px solid #c9ccd2;
    padding: 4px;
}

.m-table-bank th {
    background-color: #f2f2f2;
    font-weight: 600;
    text-align: left;
    height: 32px;
    padding-left: 10px;
}

.m-input-td {
    width: 100%;
    height: 28px;
    border: 1px solid transparent;
    /* Ẩn border khi không focus */
    outline: none;
    padding: 0 6px;
    background: transparent;
}

.m-input-td:focus,
.focus-border {
    border: 1px solid #2ca01c;
    background: #fff;
}

.icon-trash {
    color: #555;
    cursor: pointer;
    display: inline-flex;
}

.icon-trash:hover {
    color: #ff0000;
}

.table-actions {
    display: flex;
    gap: 8px;
}

.m-btn-util {
    height: 28px;
    padding: 0 12px;
    background-color: #fff;
    border: 1px solid #8d9096;
    border-radius: 2px;
    cursor: pointer;
    font-weight: 600;
    color: #111;
}

.m-btn-util:hover {
    background-color: #f2f2f2;
}

/* ================= FOOTER ================= */
.m-dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-top: 1px solid #e0e0e0;
}

.footer-right {
    display: flex;
    gap: 8px;
}

.m-btn {
    height: 36px;
    padding: 0 24px;
    border-radius: 3px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
}

.m-btn-secondary {
    background-color: #fff;
    border-color: #8d9096;
    color: #111;
}

.m-btn-secondary:hover {
    background-color: #f2f2f2;
}

.m-btn-primary {
    background-color: #2ca01c;
    color: #fff;
}

.m-btn-primary:hover {
    background-color: #35bf22;
}
</style>