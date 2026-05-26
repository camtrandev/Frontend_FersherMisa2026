<template>
    <div class="m-dialog-overlay" v-if="isVisible">
        <div class="m-dialog-box">
            <div class="m-dialog-content">
                <div class="m-dialog-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L1 21h22L12 2z" fill="#F4B301" />
                        <path d="M11 16h2v2h-2v-2zm0-7h2v5h-2V9z" fill="#fff" />
                    </svg>
                </div>
                
                <div class="m-dialog-text">
                    <slot>Bạn có thực sự muốn xóa bản ghi này không?</slot>
                </div>
            </div>

            <div class="m-dialog-divider"></div>

            <div class="m-dialog-footer">
                <button class="m-btn m-btn-secondary" @click="handleCancel">Không</button>
                <button class="m-btn m-btn-primary" @click="handleConfirm">Có</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Khai báo props để nhận trạng thái hiển thị từ Component cha
const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false
    }
});

// Khai báo các sự kiện emit ngược lại Component cha
const emit = defineEmits(['close', 'confirm']);

// Hàm xử lý khi bấm "Không"
const handleCancel = () => {
    emit('close');
};

// Hàm xử lý khi bấm "Có"
const handleConfirm = () => {
    emit('confirm');
};
</script>

<style scoped>
/* Lớp mờ (Backdrop) bao phủ toàn màn hình */
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
    z-index: 9999;
}

/* Hộp thoại chính */
.m-dialog-box {
    background-color: #ffffff;
    width: 420px;
    border-radius: 4px;
    padding: 32px 32px 24px 32px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    font-family: Arial, sans-serif;
    box-sizing: border-box;
}

/* Khu vực nội dung: chứa Icon và Text */
.m-dialog-content {
    display: flex;
    align-items: flex-start; /* Icon và text thẳng hàng phía trên */
    gap: 16px;
    margin-bottom: 24px;
}

/* Cấu hình kích thước Icon */
.m-dialog-icon {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
}

/* Chữ trong hộp thoại */
.m-dialog-text {
    font-size: 14px;
    color: #111111;
    line-height: 1.5;
    padding-top: 6px; /* Căn nhẹ cho chữ cân đối với icon */
}

/* Kẻ ngang phân cách */
.m-dialog-divider {
    height: 1px;
    background-color: #e0e0e0;
    margin-bottom: 20px;
}

/* Footer: Đẩy 2 nút ra 2 góc */
.m-dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Cấu hình chung cho Nút bấm */
.m-btn {
    height: 36px;
    padding: 0 24px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;
}

/* Nút phụ ("Không") */
.m-btn-secondary {
    background-color: #ffffff;
    border: 1px solid #8d9096;
    color: #111111;
}

.m-btn-secondary:hover {
    background-color: #f2f2f2;
}

/* Nút chính ("Có" - Chuẩn màu xanh lá MISA) */
.m-btn-primary {
    background-color: #2ca01c;
    border: 1px solid #2ca01c;
    color: #ffffff;
}

.m-btn-primary:hover {
    background-color: #35bf22;
}
</style>