<template>
    <label class="m-radio-container">
        <input type="radio" :name="name" :value="value" :checked="modelValue === value"
            @change="$emit('update:modelValue', value)" />
        <span class="m-radio-mark"></span>
        <span class="m-radio-label">{{ label }}</span>
    </label>
</template>

<script setup>
defineProps({
    modelValue: [String, Number, Boolean],
    value: [String, Number, Boolean],
    name: String, // Gom nhóm radio
    label: String
});
</script>

<style scoped>
.m-radio-container {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    user-select: none;
}

.m-radio-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.m-radio-mark {
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 1px solid #afafaf;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.m-radio-container:hover input~.m-radio-mark {
    border-color: #2ca01c;
}

.m-radio-container input:checked~.m-radio-mark {
    border-color: #2ca01c;
}

/* Chấm tròn xanh ở giữa khi chọn */
.m-radio-mark::after {
    content: "";
    display: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #2ca01c;
}

.m-radio-container input:checked~.m-radio-mark::after {
    display: block;
}

.m-radio-label {
    margin-left: 8px;
    font-size: 13px;
}
</style>