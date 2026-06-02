<template>
    <div class="m-filter-popover" @click.stop="showOperatorDropdown = false">
        <div class="filter-item text-pin">
            <div class="m-icon mi_icon_pin"></div>
            <span>Cố định cột này</span>
        </div>

        <div class="filter-divider"></div>

        <div class="filter-condition">
            <span>Lọc {{ column.label }}</span>

            <div class="condition-type-wrapper" @click.stop>
                <span class="condition-type" @click="showOperatorDropdown = !showOperatorDropdown">
                    {{ selectedOperator.label }}
                    <div class="m-icon mi_icon_chevron_down_blue" style="width: 14px; height: 14px;"></div>
                </span>

                <ul v-if="showOperatorDropdown" class="operator-dropdown">
                    <li v-for="op in operators" :key="op.value" class="operator-item"
                        :class="{ 'active': op.value === selectedOperator.value }" @click="selectOperator(op)">
                        {{ op.label }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="filter-input-wrapper">
            <input type="text" class="m-input" v-model="filterValue" placeholder="Nhập giá trị lọc"
                :disabled="['empty', 'not_empty'].includes(selectedOperator.value)" />
        </div>

        <div class="filter-actions">
            <button class="m-btn btn-secondary" @click="handleClear">Bỏ lọc</button>
            <button class="m-btn btn-primary" @click="handleFilter">Lọc</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted} from 'vue';

const props = defineProps({
    column: { type: Object, required: true },
    currentFilter: { type: Object, default: () => ({ value: '', operator: 'contains' }) }
});

const emit = defineEmits(['onFilter', 'onClear', 'close']);

// 8 điều kiện lọc
const operators = [
    { label: '(Trống)', value: 'empty' },
    { label: '(Không trống)', value: 'not_empty' },
    { label: 'Bằng', value: 'equals' },
    { label: 'Khác', value: 'not_equals' },
    { label: 'Chứa', value: 'contains' },
    { label: 'Không chứa', value: 'not_contains' },
    { label: 'Bắt đầu với', value: 'starts_with' },
    { label: 'Kết thúc với', value: 'ends_with' }
];

const selectedOperator = ref(operators.find(op => op.value === props.currentFilter.operator) || operators[4]);
const filterValue = ref(props.currentFilter.value || '');
const showOperatorDropdown = ref(false);

const selectOperator = (op) => {
    selectedOperator.value = op;
    showOperatorDropdown.value = false;

    // Tự xóa ô input nếu chọn Trống/Không trống
    if (['empty', 'not_empty'].includes(op.value)) {
        filterValue.value = '';
    }
};

const handleFilter = () => {
    emit('onFilter', {
        field: props.column.field,
        value: filterValue.value,
        operator: selectedOperator.value.value
    });
    emit('close');
};

const handleClear = () => {
    filterValue.value = '';
    selectedOperator.value = operators[4];
    emit('onClear', props.column.field);
    emit('close');
};
</script>

<style scoped>
.m-filter-popover {
    position: absolute;
    top: calc(100% + 4px);
    left: -10px;
    width: 350px;
    background-color: #ffffff;
    border: 1px solid #babec5;
    border-radius: 2px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    z-index: 999;
    padding: 20px;
    cursor: default;
    font-weight: 400;
    text-transform: none;
    color: #111111;
    font-family: Arial, sans-serif;
}

.filter-item {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-size: 13px;
    margin-bottom: 12px;
}

.mi_icon_pin {
    background: url('../../assets/icons/Sprites-7ba27b53.svg') no-repeat;
    background-position: -1600px -192px;
    width: 16px;
    height: 16px;
}

.filter-divider {
    height: 1px;
    background-color: #e0e0e0;
    margin-bottom: 16px;
}

.filter-condition {
    display: flex;
    justify-content: flex-start;
    gap: 16px;
    font-size: 13px;
    margin-bottom: 12px;
    align-items: center;
}

.condition-type-wrapper {
    position: relative;
}

.condition-type {
    color: #0075c0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
}

.operator-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background-color: #fff;
    border: 1px solid #babec5;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style: none;
    padding: 2px 0;
    width: 160px;
    z-index: 1000;
}

.operator-item {
    padding: 8px 16px;
    font-size: 13px;
    color: #111;
    cursor: pointer;
    transition: background-color 0.2s;
}

.operator-item:hover {
    background-color: #e8e9ec;
}

.operator-item.active {
    color: #00a54f;
    background-color: #e5e5e5;
}

.mi_icon_chevron_down_blue {
    background: url('../../assets/icons/Sprites-7ba27b53.svg') no-repeat;
    background-position: -176px -360px;
}

.filter-input-wrapper {
    margin-bottom: 20px;
}

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

.m-input:disabled {
    background-color: #f2f2f2;
    cursor: not-allowed;
}

.m-input::placeholder {
    color: #999;
    font-style: italic;
}

.m-input:not(:disabled):hover,
.m-input:not(:disabled):focus {
    border-color: #00a54f;
}

.filter-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.m-btn {
    height: 34px;
    padding: 0 20px;
    border-radius: 3px;
    cursor: pointer;
    font-family: Arial, sans-serif;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-secondary {
    background: #ffffff;
    border: 1px solid #8d9096;
    color: #111;
}

.btn-secondary:hover {
    background-color: #d2d3d6;
}

.btn-primary {
    background-color: #2ca01c;
    color: white;
    border: 1px solid transparent;
}

.btn-primary:hover {
    background-color: #35bf22;
}
</style>