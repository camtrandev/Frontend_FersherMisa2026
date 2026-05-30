<template>
    <div class="step-1-layout">
        <div class="s1-left">
            <div class="upload-title">
                <span class="icon-clip">📎</span> Chọn tệp Excel
                <span class="max-size">Dung lượng tối đa 20MB</span>
            </div>

            <div class="upload-box" :class="{ 'has-file': fileName }">
                <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" class="file-input-hidden"
                    id="fileUpload" />

                <div v-if="!fileName" class="upload-empty">
                    <label for="fileUpload" class="upload-label">Kéo/thả tệp vào đây hoặc bấm vào đây</label>
                </div>

                <div v-else class="upload-filled">
                    <span class="file-name">{{ fileName }} ({{ fileSize }})</span>
                    <span class="file-remove" @click="clearFile" title="Xóa tệp">x</span>
                </div>
            </div>

            <div class="download-links">
                <a href="#">Tải tệp mẫu cơ bản ⬇</a>
                <a href="#">Tải tệp mẫu đầy đủ ⬇</a>
            </div>

            <div class="config-row">
                <div class="config-group w-50">
                    <label>Sheet chứa dữ liệu</label>
                    <select class="m-input m-select">
                        <option>DanhSachNhanVien</option>
                    </select>
                </div>
                <div class="config-group w-50">
                    <label>Dòng tiêu đề là dòng số</label>
                    <input type="number" class="m-input" value="1" />
                </div>
            </div>

            <div class="import-method">
                <label class="method-title">Phương thức nhập</label>
                <label class="m-radio"><input type="radio" name="method" checked><span>Thêm mới</span></label>
                <label class="m-radio"><input type="radio" name="method"><span>Cập nhật</span></label>
            </div>
        </div>

        <div class="s1-right">
            <div class="hint-box">
                <div class="hint-header">
                    <span class="icon-bulb">💡</span> Gợi ý
                </div>
                <ul class="hint-list">
                    <li><b>Tải tệp mẫu cơ bản</b> để nhập những thông tin cơ bản.</li>
                    <li><b>Tải tệp mẫu đầy đủ</b> để nhập tất cả các thông tin.</li>
                    <li>Các thiết lập trong quá trình nhập sẽ được lưu để sử dụng trong các lần tiếp sau.</li>
                    <li><b>Thêm mới:</b> Dữ liệu trên tệp mà chưa có trên hệ thống thì sẽ được thêm mới vào. Dữ liệu
                        trên tệp mà đã có trên hệ thống sẽ không được cập nhật vào.</li>
                    <li><b>Cập nhật:</b> Dữ liệu trên tệp mà chưa có trên hệ thống thì sẽ được thêm mới vào. Dữ liệu
                        trên tệp mà đã có trên hệ thống sẽ được cập nhật vào.</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';

const emit = defineEmits(['file-loaded', 'file-cleared']);

const fileName = ref('');
const fileSize = ref('');

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    fileName.value = file.name;
    fileSize.value = (file.size / 1024).toFixed(2) + ' kb';

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Đọc dữ liệu theo mảng 2 chiều
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const rawData = [];
        // Chạy từ i = 1 để bỏ qua dòng 0 (dòng tiêu đề)
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;

            // Ánh xạ ĐÚNG CHUẨN index dựa trên file Excel mẫu
            rawData.push({
                employeeCode: row[0] ? String(row[0]).trim() : '',       // Cột A (0): Mã NV
                fullName: row[1] ? String(row[1]).trim() : '',           // Cột B (1): Tên NV
                genderName: row[2] ? String(row[2]).trim() : '',         // Cột C (2): Giới tính
                dateOfBirth: row[3] ? String(row[3]).trim() : '',        // Cột D (3): Ngày sinh
                identityNumber: row[4] ? String(row[4]).trim() : '',     // Cột E (4): Số CMND/CCCD
                positionName: row[8] ? String(row[8]).trim() : '',       // Cột I (8): Chức danh
                departmentCode: row[9] ? String(row[9]).trim() : '',     // Cột J (9): Mã đơn vị
                departmentName: row[10] ? String(row[10]).trim() : '',   // Cột K (10): Tên đơn vị
                bankAccountNumber: row[20] ? String(row[20]).trim() : '',// Cột U (20): Số tài khoản
                bankName: row[21] ? String(row[21]).trim() : '',         // Cột V (21): Tên ngân hàng

                status: '',
                errorMsg: ''
            });
        }

        emit('file-loaded', rawData);
    };
    reader.readAsArrayBuffer(file);
};

const clearFile = () => {
    fileName.value = '';
    fileSize.value = '';
    document.getElementById('fileUpload').value = '';
    emit('file-cleared');
};
</script>

<style scoped>
.step-1-layout {
    display: flex;
    flex-direction: row;
    gap: 40px;
    height: 100%;
}

.s1-left {
    flex: 6;
}

.s1-right {
    flex: 4;
}

.upload-title {
    margin-bottom: 8px;
    font-weight: bold;
}

.max-size {
    color: #999;
    font-weight: normal;
    margin-left: 8px;
    font-size: 12px;
}

.upload-box {
    border: 1px dashed #ccc;
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    margin-bottom: 12px;
    position: relative;
}

.file-input-hidden {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.upload-empty {
    text-align: center;
    color: #999;
    font-size: 14px;
}

.upload-filled {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e0e0e0;
    padding: 8px 12px;
    border-radius: 4px;
    z-index: 2;
    position: relative;
    background: #fff;
}

.file-name {
    color: #111;
    font-weight: 500;
}

.file-remove {
    color: red;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
}

.download-links {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
}

.download-links a {
    color: #0075c0;
    text-decoration: none;
    font-size: 13px;
}

.download-links a:hover {
    text-decoration: underline;
}

.config-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
}

.config-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 13px;
}

.w-50 {
    width: 50%;
}

.m-input,
.m-select {
    width: 100%;
    height: 32px;
    border: 1px solid #babec5;
    border-radius: 3px;
    padding: 0 10px;
    box-sizing: border-box;
}

.m-input:focus,
.m-select:focus {
    border-color: #2ca01c;
    outline: none;
}

.method-title {
    display: block;
    margin-bottom: 12px;
    font-weight: bold;
    font-size: 14px;
}

.m-radio {
    margin-right: 24px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.hint-box {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 16px;
}

.hint-header {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.hint-list {
    padding-left: 20px;
    margin: 0;
    color: #111;
    font-size: 13px;
    line-height: 1.6;
}

.hint-list li {
    margin-bottom: 8px;
}
</style>