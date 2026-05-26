<template>
    <div class="m-combobox">
        <div class="m-combobox-inner">
            <input type="text" class="m-input" :placeholder="placeholder" :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)" />
            <div class="m-combobox-action">
                <div class="m-icon mi_icon_chevron_down"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: String,
    placeholder: String
});
</script>

<style scoped>
.m-combobox {
    position: relative;
    width: 100%;
}

.m-combobox-inner {
    display: flex;
    align-items: center;
    border: 1px solid #babec5;
    border-radius: 4px;
    height: 32px;
    box-sizing: border-box;
    background-color: #fff;
    transition: border-color 0.2s;
}

.m-combobox-inner:focus-within {
    border-color: #2ca01c;
}

.m-combobox-inner .m-input {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 12px;
    background-color: transparent;
    font-size: 13px;
}

.m-combobox-action {
    width: 32px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
}

.m-combobox-action:hover {
    background-color: #e0e0e0;
}

.m-icon {
    background-color: #737373;
    width: 16px;
    height: 16px;
    -webkit-mask-repeat: no-repeat;
}

.mi_icon_chevron_down {
    -webkit-mask-position: -64px -312px;
    /* Tọa độ giả định */
}
</style>