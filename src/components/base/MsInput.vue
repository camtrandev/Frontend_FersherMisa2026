<template>
    <div class="m-input-wrapper">
        <input type="text" class="m-input" :class="{ 'has-icon-right': iconRight }" :placeholder="placeholder"
            :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />

        <div v-if="iconRight" class="m-input-icon-right m-icon" :class="iconRight"></div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Khai báo các thuộc tính mà MsInput sẽ nhận từ cha (như placeholder, iconRight, v-model)
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    iconRight: {
        type: String,
        default: '' // Nhận tên class của icon (ví dụ: 'mi_icon_search')
    }
});

// Khai báo sự kiện để v-model hoạt động được
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
/* Box bọc ngoài để làm gốc tọa độ cho icon */
.m-input-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
}

/* Ô input chuẩn */
.m-input {
    width: 100%;
    height: 32px;
    padding: 0 10px;
    border: 1px solid #babec5;
    border-radius: 3px;
    outline: none;
    box-sizing: border-box;
    font-size: 13px;
    font-family: Arial, sans-serif;
    color: #111;
    transition: border-color 0.15s ease;
}

/* Đổi màu viền khi click vào nhập */
.m-input:focus {
    border-color: #2ca01c;
}

/* QUAN TRỌNG: Nếu có icon bên phải, phải tăng khoảng cách padding bên phải để chữ không bị gõ đè lên icon */
.m-input.has-icon-right {
    padding-right: 32px;
}

/* Định vị icon nổi lên trên ô input, nằm sát mép phải */
.m-input-icon-right {
    position: absolute;
    right: 8px;
    /* Cách mép phải 8px */
    top: 50%;
    transform: translateY(-50%);
    /* Căn giữa theo chiều dọc chuẩn xác */
    width: 16px;
    height: 16px;
    cursor: pointer;
    /* Hiển thị bàn tay để người dùng biết có thể bấm (như nút search) */
}

/* Class chung cho icon, lấy ảnh từ Sprite SVG 
  (Đảm bảo đường dẫn này đúng với vị trí file ảnh của bạn) 
*/
.m-icon {
    background: url('../../assets/icons/Sprites-7ba27b53.svg') no-repeat;
}

/* Tọa độ của icon Search 
  (Bạn hãy thay đổi tọa độ background-position dưới đây cho khớp với icon kính lúp trong file ảnh của bạn)
*/
.mi_icon_search {
    background-position: -992px -360px;
    /* SỬA LẠI TỌA ĐỘ NÀY NẾU CẦN */
}
</style>