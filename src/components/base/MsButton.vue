<template>
    <button class="m-btn" :class="[`m-btn-${type}`, { 'has-icon': icon }]" @click="$emit('click')">
        <div v-if="icon" class="m-icon m-btn-icon" :class="icon"></div>
        <div class="m-btn-text">
            <slot></slot>
        </div>
    </button>
</template>

<script setup>
defineProps({
    // type: 'primary' (mặc định - nền xanh), 'secondary' (viền trắng/xám)
    type: { type: String, default: 'primary' },
    icon: { type: String, default: '' } // VD: 'mi_icon_add'
});
</script>

<style scoped>
.m-btn {
    height: 36px;
    /* Chuẩn chiều cao nút MISA */
    padding: 0 16px;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: all 0.2s ease;
    border: none;
    outline: none;
}

.m-btn-text {
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
}

.m-btn-text .m-icon {
    flex-shrink: 0;
}

/* Nút chính (Nền xanh) */
.m-btn-primary {
    background-color: #2ca01c;
    /* Màu xanh lá đặc trưng nút bấm MISA */
    color: #ffffff;
}

.m-btn-primary:hover {
    background-color: #35bf22;
}

/* Nút phụ (Viền, chữ đen) */
.m-btn-secondary {
    background-color: transparent;
    border: 1px solid #8d9096;
    color: #111;
}

.m-btn-secondary:hover {
    background-color: #d2d3d6;
}

.has-icon {
    padding-left: 12px;
    /* Đẩy text ra một chút nếu có icon */
    gap: 8px;
}

.m-icon {
    /* Tái sử dụng kỹ thuật mask-image của bạn */
    background-color: currentColor;
    /* Lấy theo màu chữ của nút */
    -webkit-mask-repeat: no-repeat;
    width: 16px;
    height: 16px;
}
</style>