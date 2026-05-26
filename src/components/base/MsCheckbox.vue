<template>
    <label class="m-checkbox-container">
        <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
        <span class="m-checkmark"></span>
        <span v-if="label" class="m-checkbox-label">{{ label }}</span>
    </label>
</template>

<script setup>
defineProps({
    modelValue: Boolean,
    label: { type: String, default: '' }
});
</script>

<style scoped>
.m-checkbox-container {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    user-select: none;
}

/* Ẩn checkbox thật của trình duyệt */
.m-checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

/* Tạo ô vuông custom */
.m-checkmark {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 1px solid #afafaf;
    border-radius: 3px;
    transition: all 0.2s;
    box-sizing: border-box;
}

/* Khi hover */
.m-checkbox-container:hover input~.m-checkmark {
    border-color: #2ca01c;
}

/* Khi được check */
.m-checkbox-container input:checked~.m-checkmark {
    border-color: #2ca01c;
    /* background-color: #2ca01c; -> MISA thường để nền trắng và icon tích màu xanh */
}

/* Tạo dấu tích (dùng pseudo-element hoặc mask image) */
.m-checkmark::after {
    content: "";
    display: none;
    /* Nếu dùng ảnh mask-image thì thay đoạn border dưới này bằng background/mask */
    width: 5px;
    height: 10px;
    border: solid #2ca01c;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-bottom: 2px;
    /* Chỉnh nhẹ cho cân tâm */
}

.m-checkbox-container input:checked~.m-checkmark::after {
    display: block;
}

.m-checkbox-label {
    margin-left: 8px;
    font-size: 13px;
}
</style>