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
                                <input type="text" v-model="employee.employeeCode" class="m-input"
                                    :class="{ 'm-input-error': errors.employeeCode }" :title="errors.employeeCode"
                                    ref="inputCode" />
                            </div>
                            <div class="form-group w-60">
                                <label>Tên <span class="required">*</span></label>
                                <input type="text" v-model="employee.fullName" class="m-input"
                                    :class="{ 'm-input-error': errors.fullName }" :title="errors.fullName"
                                    @blur="validateField('fullName')" @input="clearErrorIfValid('fullName')" />
                            </div>
                        </div>
                        <div class="form-row mt-2">
                            <div class="form-group w-100" ref="comboboxRef">
                                <label>Đơn vị <span class="required">*</span></label>
                                <div class="m-combobox" :class="{ 'm-combobox-error': errors.departmentId }"
                                    :title="errors.departmentId">
                                    <input type="text" v-model="departmentText" class="m-combobox-input"
                                        @input="handleDeptInput" @blur="validateField('departmentId')"
                                        @focus="showDeptList = true" />
                                    <div class="m-combobox-btn" @click="showDeptList = !showDeptList">
                                        <svg width="12" height="12" viewBox="0 0 24 24">
                                            <polygon points="6,9 12,15 18,9" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div class="m-combobox-data" v-if="showDeptList">
                                        <table class="m-table-combo">
                                            <thead>
                                                <tr>
                                                    <th class="w-30">Mã đơn vị</th>
                                                    <th class="w-70">Tên đơn vị</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="dept in filteredDepartments" :key="dept.id"
                                                    @click="selectDepartment(dept)">
                                                    <td>{{ dept.code }}</td>
                                                    <td>{{ dept.name }}</td>
                                                </tr>
                                                <tr v-if="filteredDepartments.length === 0">
                                                    <td colspan="2" class="text-center"
                                                        style="color:#999; padding: 10px;">Không có dữ liệu</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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
                                <input type="text" v-model="employee.passportNumber" class="m-input" />
                            </div>
                        </div>
                        <div class="form-row mt-2">
                            <div class="form-group w-60 pr-1">
                                <label>Số CMND/CCCD</label>
                                <input type="text" v-model="employee.identityNumber" class="m-input"
                                    :class="{ 'm-input-error': errors.identityNumber }" :title="errors.identityNumber"
                                    @blur="validateField('identityNumber')"
                                    @input="clearErrorIfValid('identityNumber')" />
                            </div>
                            <div class="form-group w-40">
                                <label>Ngày cấp</label>
                                <input type="date" v-model="employee.issueDate" class="m-input" />
                            </div>
                        </div>
                        <div class="form-row mt-2">
                            <div class="form-group w-100">
                                <label>Nơi cấp</label>
                                <input type="text" v-model="employee.issuePlace" class="m-input" />
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
                                <select v-model="employee.receivableAccountId" class="m-input m-select">
                                    <option value="131">131</option>
                                    <option value="1311">1311</option>
                                </select>
                            </div>

                            <div class="form-group w-50" v-if="isVendor">
                                <label>TK công nợ phải trả</label>
                                <select v-model="employee.payableAccountId" class="m-input m-select">
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
                                    <input type="text" class="m-input text-right"
                                        :value="formatCurrency(employee.agreedSalary)"
                                        @input="onSalaryInput('agreedSalary', $event)"
                                        @focus="$event.target.select()" />
                                </div>
                                <div class="form-group w-25 pr-1">
                                    <label>Hệ số lương</label>
                                    <input type="text" class="m-input text-right"
                                        :value="formatDecimal(employee.salaryCoefficient)"
                                        @input="onCoefficientInput($event)" @focus="$event.target.select()"
                                        @blur="onCoefficientBlur($event)" />
                                </div>
                                <div class="form-group w-50">
                                    <label>Lương đóng bảo hiểm</label>
                                    <input type="text" class="m-input text-right"
                                        :value="formatCurrency(employee.insuranceSalary)"
                                        @input="onSalaryInput('insuranceSalary', $event)"
                                        @focus="$event.target.select()" />
                                </div>
                            </div>
                            <div class="form-row mt-2">
                                <div class="form-group w-25 pr-1">
                                    <label>Mã số thuế</label>
                                    <input type="text" class="m-input" v-model="employee.taxCode" />
                                </div>
                                <div class="form-group w-50 pr-1">
                                    <label>Loại hợp đồng <span class="required">*</span></label>
                                    <select class="m-input m-select" v-model="employee.contractType">
                                        <option value="0">Không cư trú</option>
                                        <option value="1">Cư trú và có HĐLĐ từ 3 tháng trở lên</option>
                                        <option value="2">Cư trú và không ký HĐLĐ/HĐLĐ dưới 3 tháng</option>
                                    </select>
                                </div>
                                <div class="form-group w-25">
                                    <label>Số người phụ thuộc</label>
                                    <input type="number" class="m-input text-right"
                                        v-model="employee.numberOfDependents" />
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
                                    <input type="text" v-model="employee.mobilePhoneNumber" class="m-input"
                                        :class="{ 'm-input-error': errors.mobilePhoneNumber }"
                                        :title="errors.mobilePhoneNumber" @blur="validateField('mobilePhoneNumber')"
                                        @input="clearErrorIfValid('mobilePhoneNumber')" />
                                </div>
                                <div class="form-group w-25 pr-1">
                                    <label>ĐT cố định</label>
                                    <input type="text" v-model="employee.landlinePhoneNumber" class="m-input"
                                        :class="{ 'm-input-error': errors.landlinePhoneNumber }"
                                        :title="errors.landlinePhoneNumber" @blur="validateField('landlinePhoneNumber')"
                                        @input="clearErrorIfValid('landlinePhoneNumber')" />
                                </div>
                                <div class="form-group w-25">
                                    <label>Email</label>
                                    <input type="text" v-model="employee.email" class="m-input"
                                        :class="{ 'm-input-error': errors.email }" :title="errors.email"
                                        @blur="validateField('email')" @input="clearErrorIfValid('email')" />
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

        <div class="m-msg-overlay" v-if="showErrorDialog">
            <div class="m-msg-box">
                <div class="m-msg-body">
                    <div class="m-msg-icon">
                        <div class="icon-warning-red">!</div>
                    </div>
                    <div class="m-msg-content">
                        {{ errorMessages[0] }}
                    </div>
                </div>
                <div class="m-msg-footer">
                    <button class="m-btn m-btn-primary btn-close-msg" @click="closeErrorDialog">Đóng</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useEmployeeStore } from '../../stores/Employee.store';

const props = defineProps({
    isVisible: { type: Boolean, default: false },
    editData: { type: Object, default: null } // Có dữ liệu => Sửa, Null => Thêm mới
});

// Thêm sự kiện 'saveSuccess' để báo cho màn hình danh sách load lại bảng
const emit = defineEmits(['close', 'save', 'saveSuccess']);

const employeeStore = useEmployeeStore();

// Trạng thái các Checkbox động
const isCustomer = ref(false);
const isVendor = ref(false);
const activeTab = ref(1);

// dùng nextTick như một callback
const focusCodeInput = () => {
    nextTick(() => {
        if (inputCode.value) {
            inputCode.value.focus();
            inputCode.value.select(); // Hàm này để bôi đen toàn bộ text trong ô
        }
    });
};


// ==========================================
// 1. KHỞI TẠO DỮ LIỆU & RESET FORM
// ==========================================
// Tạo khung chuẩn khớp 100% với API Backend
const defaultEmployee = {
    employeeId: null, // Dùng để phân biệt POST hay PUT
    employeeCode: '',
    fullName: '',
    departmentId: '',
    positionName: '',
    dateOfBirth: '',
    gender: '1', // Sẽ ép về kiểu số khi lưu
    passportNumber: '',
    identityNumber: '',
    issueDate: '',
    issuePlace: '',
    receivableAccountId: '131',
    payableAccountId: '331',
    address: '',
    mobilePhoneNumber: '',
    landlinePhoneNumber: '',
    email: '',
    agreedSalary: 0,
    salaryCoefficient: 0,
    insuranceSalary: 0,
    taxCode: '',
    contractType: 0,
    numberOfDependents: 0
};

const employee = ref({ ...defaultEmployee });
const bankAccounts = ref([
    { accountNumber: '', bankName: '', branch: '', province: '', focused: false }
]);

// Hàm Reset: Xóa trắng form và gọi mã tự động
const resetForm = async () => {
    employee.value = { ...defaultEmployee };
    isCustomer.value = false;
    isVendor.value = false;
    departmentText.value = '';
    activeTab.value = 1;
    bankAccounts.value = [{ accountNumber: '', bankName: '', branch: '', province: '', focused: false }];

    Object.keys(errors.value).forEach(key => errors.value[key] = '');

    try {
        const newCode = await employeeStore.fetchNewCode();
        employee.value.employeeCode = newCode;
        
        // GỌI FOCUS Ở ĐÂY SAU KHI CÓ MÃ MỚI
        focusCodeInput(); 
    } catch (error) {
        console.error("Lỗi khi lấy mã nhân viên mới:", error);
    }
};

// ==========================================
// 2. STATE VALIDATE VÀ MESSAGE BOX
// ==========================================
const errors = ref({
    employeeCode: '',
    fullName: '',
    departmentId: '',
    identityNumber: '',
    mobilePhoneNumber: '',
    landlinePhoneNumber: '',
    email: ''
});
const showErrorDialog = ref(false);
const errorMessages = ref([]);
const inputCode = ref(null);

const closeErrorDialog = () => {
    showErrorDialog.value = false;
    if (errors.value.employeeCode) inputCode.value?.focus();
};

// ==========================================
// 3. COMBOBOX ĐƠN VỊ
// ==========================================
const departments = ref([]);
const showDeptList = ref(false);
const departmentText = ref('');
const comboboxRef = ref(null);

const handleClickOutside = (event) => {
    if (comboboxRef.value && !comboboxRef.value.contains(event.target)) {
        showDeptList.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    fetchDepartments();
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const filteredDepartments = computed(() => {
    if (!departmentText.value) return departments.value;
    return departments.value.filter(d =>
        d.name.toLowerCase().includes(departmentText.value.toLowerCase()) ||
        d.code.toLowerCase().includes(departmentText.value.toLowerCase())
    );
});

// Hàm hứng dữ liệu phòng ban chuẩn chỉ từ API
const fetchDepartments = async () => {
    try {
        // Gọi API thông qua Store
        const data = await employeeStore.fetchAllDepartments();

        // Map dữ liệu từ API vào cấu trúc mảng departments của Form
        // Lưu ý: Hãy kiểm tra Console để chắc chắn Backend trả về tên biến là gì 
        // (thường trong .NET MISA là departmentId, departmentCode, departmentName)
        departments.value = data.map(item => ({
            id: item.departmentId,       // Id phòng ban
            code: item.departmentCode,   // Mã phòng ban
            name: item.departmentName    // Tên phòng ban
        }));

        // Nếu đang ở chế độ Sửa, cần cập nhật lại text hiển thị cho Combobox sau khi đã có dữ liệu
        if (props.editData && props.editData.departmentId) {
            const dept = departments.value.find(d => d.id === props.editData.departmentId);
            if (dept) departmentText.value = dept.name;
        }

    } catch (error) {
        console.error("Lỗi lấy danh sách phòng ban: ", error);
    }
};

const selectDepartment = (dept) => {
    employee.value.departmentId = dept.id;
    departmentText.value = dept.name;
    showDeptList.value = false;
    clearErrorIfValid('departmentId');
};

const handleDeptInput = () => {
    employee.value.departmentId = '';
    showDeptList.value = true;
    clearErrorIfValid('departmentId');
};

// ==========================================
// 4. XỬ LÝ FORMAT TIỀN TỆ VÀ TÍNH TOÁN LƯƠNG
// ==========================================
const formatCurrency = (value) => {
    if (!value) return '0';
    const strValue = value.toString().replace(/\D/g, '');
    return strValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const onSalaryInput = (field, event) => {
    let rawValue = event.target.value.replace(/\./g, '');
    if (rawValue === '') rawValue = '0';
    rawValue = rawValue.replace(/\D/g, '');
    employee.value[field] = parseInt(rawValue, 10);
    event.target.value = formatCurrency(employee.value[field]);
};

const formatDecimal = (value) => {
    if (!value) return '0,00';
    let val = parseFloat(value);
    if (isNaN(val)) return '0,00';
    return val.toFixed(2).replace('.', ',');
};

const onCoefficientInput = (event) => {
    let val = event.target.value.replace(/[^0-9,]/g, '');
    const parts = val.split(',');
    if (parts.length > 2) val = parts[0] + ',' + parts.slice(1).join('');
    event.target.value = val;
    let floatVal = parseFloat(val.replace(',', '.'));
    employee.value.salaryCoefficient = isNaN(floatVal) ? 0 : floatVal;
};

const onCoefficientBlur = (event) => {
    event.target.value = formatDecimal(employee.value.salaryCoefficient);
};

// Tự động tính Lương đóng bảo hiểm
watch(
    () => [employee.value.agreedSalary, employee.value.salaryCoefficient],
    ([newSalary, newCoef]) => {
        if (newSalary !== undefined && newCoef !== undefined) {
            const salary = Number(newSalary) || 0;
            const coef = Number(newCoef) || 0;
            employee.value.insuranceSalary = Math.round(salary * coef);
        }
    }
);

// ==========================================
// 5. VALIDATE
// ==========================================
const validateField = (field) => {
    let isValid = true;
    const value = (employee.value[field] || '').toString().trim();
    const numberRegex = /^[0-9]+$/;
    const mobileRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (field) {
        case 'employeeCode':
            if (!value) { errors.value.employeeCode = 'Mã không được để trống.'; isValid = false; }
            else errors.value.employeeCode = ''; break;
        case 'fullName':
            if (!value) { errors.value.fullName = 'Tên không được để trống.'; isValid = false; }
            else errors.value.fullName = ''; break;
        case 'departmentId':
            if (!employee.value.departmentId) { errors.value.departmentId = 'Đơn vị không được để trống.'; isValid = false; }
            else errors.value.departmentId = ''; break;
        case 'identityNumber':
            if (value && !numberRegex.test(value)) { errors.value.identityNumber = 'Số CMND/CCCD chỉ được phép nhập số.'; isValid = false; }
            else errors.value.identityNumber = ''; break;
        case 'mobilePhoneNumber':
            if (value) {
                if (!numberRegex.test(value)) { errors.value.mobilePhoneNumber = 'Điện thoại di động chỉ được phép nhập số.'; isValid = false; }
                else if (!mobileRegex.test(value)) { errors.value.mobilePhoneNumber = 'Điện thoại di động không đúng định dạng.'; isValid = false; }
                else errors.value.mobilePhoneNumber = '';
            } else errors.value.mobilePhoneNumber = ''; break;
        case 'landlinePhoneNumber':
            if (value) {
                if (!numberRegex.test(value)) { errors.value.landlinePhoneNumber = 'Điện thoại cố định chỉ được phép nhập số.'; isValid = false; }
                else if (value.length < 8 || value.length > 11) { errors.value.landlinePhoneNumber = 'Điện thoại cố định phải từ 8 - 11 số.'; isValid = false; }
                else errors.value.landlinePhoneNumber = '';
            } else errors.value.landlinePhoneNumber = ''; break;
        case 'email':
            if (value && !emailRegex.test(value)) { errors.value.email = 'Email không đúng định dạng.'; isValid = false; }
            else errors.value.email = ''; break;
    }
    return isValid;
};

const clearErrorIfValid = (field) => {
    if (errors.value[field]) validateField(field);
};

// ==========================================
// 6. XỬ LÝ BẢNG NGÂN HÀNG
// ==========================================
const addBankRow = () => {
    bankAccounts.value.push({ accountNumber: '', bankName: '', branch: '', province: '', focused: false });
};

const removeBankRow = (index) => {
    bankAccounts.value.splice(index, 1);
    if (bankAccounts.value.length === 0) addBankRow();
};

const clearAllBankRows = () => {
    bankAccounts.value = [];
    addBankRow();
};

// ==========================================
// 7. LƯU (POST/PUT) VÀ THEO DÕI PROPS
// ==========================================
const closeForm = () => {
    emit('close');
};

const formatToDateString = (dateString) => {
    if (!dateString) return null;
    return dateString.split('T')[0];
};

const saveForm = async (isSaveAndAdd) => {
    // =========================================================================
    // 1. CHẠY VALIDATE TOÀN BỘ CÁC TRƯỜNG 
    // =========================================================================
    const validationResults = [
        validateField('employeeCode'),
        validateField('fullName'),
        validateField('departmentId'),
        validateField('identityNumber'),
        validateField('mobilePhoneNumber'),
        validateField('landlinePhoneNumber'),
        validateField('email')
    ];

    // Kiểm tra xem có bất kỳ trường nào trả về false không
    const isValid = validationResults.every(result => result === true);

    if (!isValid) {
        errorMessages.value = ['Vui lòng kiểm tra lại các trường bị viền đỏ!'];
        showErrorDialog.value = true;
        return;
    }

    // =========================================================================
    // 2. CHUẨN BỊ PAYLOAD (Ép kiểu chuẩn xác)
    // =========================================================================
    const payload = {
        employeeCode: employee.employeeCode?.trim(),
        fullName: employee.value.fullName?.trim(),
        departmentId: employee.value.departmentId,
        positionName: employee.value.positionName?.trim(),

        // Đã bọc qua hàm cắt chuỗi để hết cảnh báo vàng
        dateOfBirth: formatToDateString(employee.value.dateOfBirth),
        issueDate: formatToDateString(employee.value.issueDate),

        gender: employee.value.gender !== null ? Number(employee.value.gender) : null,
        identityNumber: employee.value.identityNumber?.trim(),
        issuePlace: employee.value.issuePlace?.trim(),
        passportNumber: employee.value.passportNumber?.trim(),

        isCustomer: !!isCustomer.value,
        isSupplier: !!isVendor.value,

        receivableAccountId: employee.value.receivableAccountId,
        payableAccountId: employee.value.payableAccountId,

        agreedSalary: Number(employee.value.agreedSalary) || 0,
        salaryCoefficient: Number(employee.value.salaryCoefficient) || 0,
        insuranceSalary: Number(employee.value.insuranceSalary) || 0,

        taxCode: employee.value.taxCode?.trim(),
        contractType: Number(employee.value.contractType) || 0,
        numberOfDependents: Number(employee.value.numberOfDependents) || 0,

        address: employee.value.address?.trim(),
        mobilePhoneNumber: employee.value.mobilePhoneNumber?.trim(),
        landlinePhoneNumber: employee.value.landlinePhoneNumber?.trim(),
        email: employee.value.email?.trim(),

        // ================================================================
        // MAP DANH SÁCH NGÂN HÀNG 
        // ================================================================
        bankAccounts: bankAccounts.value
            .filter(b => b.accountNumber && b.accountNumber.trim() !== '') // Bỏ qua dòng trống
            .map(b => {
                const bankItem = {
                    bankAccountNumber: b.accountNumber.trim(),
                    bankName: b.bankName?.trim(),
                    bankBranch: b.branch?.trim(),
                    bankProvince: b.province?.trim()
                };

                // KỸ THUẬT QUAN TRỌNG: Chỉ thêm Id vào cục JSON nếu Id có tồn tại. 
                // Nếu không có, bỏ qua luôn, tuyệt đối không gán = null để C# không bị lỗi.
                if (b.bankAccountId) {
                    bankItem.bankAccountId = b.bankAccountId;
                }
                if (employee.value.employeeId) {
                    bankItem.employeeId = employee.value.employeeId;
                }

                return bankItem;
            })
    };

    // =========================================================================
    // 3. SANITIZE DATA (Dọn rác dữ liệu - Chống lỗi 400 Bad Request của .NET)
    // =========================================================================

    // Nếu là thao tác SỬA, ta mới nhét employeeId vào Payload
    if (employee.value.employeeId) {
        payload.employeeId = employee.value.employeeId;
    }

    // Biến chuỗi rỗng "" của các trường Guid thành null
    if (payload.departmentId === "") payload.departmentId = null;
    if (payload.receivableAccountId === "") payload.receivableAccountId = null;
    if (payload.payableAccountId === "") payload.payableAccountId = null;

    // =========================================================================
    // 4. GỌI API & XỬ LÝ KẾT QUẢ
    // =========================================================================
    

    try {
        if (payload.employeeId) {
            // ================== CHẾ ĐỘ SỬA ==================
            await employeeStore.updateEmployeeInfo(payload.employeeId, payload);
            emit('saveSuccess'); // Gọi ra màn ngoài để load lại danh sách dữ liệu mới

            // Theo yêu cầu: Sửa xong dù ấn "Cất" hay "Cất và Thêm" thì cũng ĐÓNG form
            closeForm();
        } else {
            // =============== CHẾ ĐỘ THÊM MỚI ===============
            await employeeStore.createNewEmployee(payload);
            emit('saveSuccess'); // Gọi ra màn ngoài để load lại danh sách dữ liệu mới

            if (isSaveAndAdd) {
                // Ấn "Cất và Thêm": KHÔNG đóng form, xóa trắng và lấy mã NV mới
                await resetForm();
            } else {
                // Ấn "Cất": Đóng form
                closeForm();
            }
        }
    } catch (error) {
        console.error(" ~ [LỖI API]:", error.response?.data);

        // Chuẩn hóa bắt lỗi theo cấu trúc Exception của MISA
        const responseData = error.response?.data;

        if (responseData) {
            const errorMsg = responseData.userMsg || responseData.UserMsg || responseData.devMsg || 'Có lỗi xảy ra, vui lòng liên hệ MISA.';
            errorMessages.value = [errorMsg];
        } else {
            errorMessages.value = ['Không thể kết nối đến máy chủ.'];
        }

        showErrorDialog.value = true;
    }
};

// ==========================================
// THEO DÕI DỮ LIỆU TRUYỀN VÀO (CHẾ ĐỘ SỬA)
// ==========================================
watch(
    () => props.editData,
    async (newData) => {
        console.log("🛠️ [DEBUG] Dữ liệu truyền vào Form:", newData || "Thêm mới");

        if (newData) {
            // 1. Ánh xạ dữ liệu cơ bản
            employee.value = { ...defaultEmployee, ...newData };

            // 2. Xử lý các thuộc tính đặc thù (Kiểu dữ liệu)
            employee.value.gender = newData.gender != null ? String(newData.gender) : '1';
            isCustomer.value = !!newData.isCustomer;
            isVendor.value = !!newData.isSupplier;

            // 3. Xử lý định dạng ngày tháng
            employee.value.dateOfBirth = newData.dateOfBirth?.split('T')[0] || '';
            employee.value.issueDate = newData.issueDate?.split('T')[0] || '';

            // 4. Map tên đơn vị (Dùng optional chaining an toàn hơn)
            const matchedDept = departments.value.find(d => d.id === newData.departmentId);
            departmentText.value = matchedDept ? matchedDept.name : (newData.departmentName || '');

            // 5. Cấu trúc lại bảng ngân hàng
            bankAccounts.value = (newData.bankAccounts?.length > 0) 
                ? newData.bankAccounts.map(b => ({
                    bankAccountId: b.bankAccountId,
                    accountNumber: b.bankAccountNumber || '',
                    bankName: b.bankName || '',
                    branch: b.bankBranch || '',
                    province: b.bankProvince || '',
                    focused: false
                }))
                : [{ bankAccountId: null, accountNumber: '', bankName: '', branch: '', province: '', focused: false }];
        } else {
            // Trường hợp Thêm mới
            await resetForm();
        }

        // 6. GỌI FOCUS VÀ BÔI ĐEN SAU KHI ĐỔ DỮ LIỆU
        // Hàm này đảm bảo DOM đã sẵn sàng
        focusCodeInput();
    },
    { immediate: true }
);

watch(
    () => props.isVisible,
    (newValue) => {
        if (newValue) {
            // Khi form mở ra (Dù là Thêm mới hay Sửa), tiến hành focus vào ô Mã
            focusCodeInput();
        }
    }
);


</script>

<style scoped>
/* ================= TỔNG QUAN & OVERLAY (GIỮ NGUYÊN CỦA BẠN) ================= */
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
    border-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
}

/* ================= HEADER (GIỮ NGUYÊN CỦA BẠN) ================= */
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

.m-input-readonly:focus {
    border-color: #babec5 !important;
    /* Không nháy xanh viền khi focus */
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

/* ================= BODY & FORM GRID (GIỮ NGUYÊN CỦA BẠN) ================= */
.m-dialog-body {
    padding: 24px;
    flex: 1;
}

.info-layout {
    display: flex;
    gap: 24px;
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
    width: 16px;
    height: 16px;
}

/* ================= TABS (GIỮ NGUYÊN CỦA BẠN) ================= */
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
    border-bottom: none;
    font-weight: 600;
}

.tab-pane {
    padding: 16px;
}

/* ================= BẢNG NGÂN HÀNG (GIỮ NGUYÊN CỦA BẠN) ================= */
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

/* ================= FOOTER (GIỮ NGUYÊN CỦA BẠN) ================= */
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

/* ================= BỔ SUNG MỚI: COMBOBOX, VALIDATE, MESSAGE BOX ================= */
/* 1. Validate */
.m-input-error {
    border: 1px solid #e81e1e !important;
}

.m-input-error:focus,
.m-input-error:hover {
    outline: none;
    border-color: #e81e1e !important;
}

/* 2. Combobox Đơn vị */
.m-combobox {
    display: flex;
    position: relative;
    border: 1px solid #babec5;
    border-radius: 2px;
    height: 32px;
    background: #fff;
    box-sizing: border-box;
}

.m-combobox.m-combobox-error {
    border-color: #e81e1e !important;
}

.m-combobox:hover {
    border-color: #e2e2e2;
}

.m-combobox-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 0 10px;
    font-size: 13px;
    border-radius: 2px 0 0 2px;
}

.m-combobox-btn {
    width: 32px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-left: 1px solid #e0e0e0;
}

.m-combobox-btn:hover {
    background: #e0e0e0;
}

.m-combobox-data {
    position: absolute;
    top: 100%;
    left: -1px;
    right: -1px;
    background: #fff;
    border: 1px solid #babec5;
    z-index: 100;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
}

.m-table-combo {
    width: 100%;
    border-collapse: collapse;
}

.m-table-combo th {
    background: #f4f5f8;
    padding: 8px 10px;
    font-size: 13px;
    font-weight: 600;
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
}

.m-table-combo td {
    padding: 8px 10px;
    font-size: 13px;
    cursor: pointer;
    border-bottom: none;
}

.m-table-combo tr:hover td {
    background: #ebedf0;
    color: #2ca01c;
}

/* 3. Message Box Lỗi */
.m-msg-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.m-msg-box {
    background: #fff;
    width: 444px;
    border-radius: 3px;
    padding: 32px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.m-msg-body {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.m-msg-icon {
    margin-right: 16px;
}

.icon-warning-red {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #e81e1e;
    color: white;
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.m-msg-content {
    font-size: 14px;
    color: #111;
    padding-top: 5px;
}

.m-msg-footer {
    display: flex;
    justify-content: center;
    border-top: 1px solid #b8bcc3;
    padding-top: 20px;
}

.btn-close-msg {
    background: #2ca01c;
    color: #fff;
    border: none;
    padding: 8px 24px;
    border-radius: 3px;
    cursor: pointer;
    font-weight: 600;
}

.btn-close-msg:hover {
    background: #35bf22;
}
</style>

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