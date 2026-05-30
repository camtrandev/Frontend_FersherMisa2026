<template>
    <div class="m-setting-overlay" v-if="isVisible" @click.self="closeSetting">

        <div class="m-setting-drawer" :class="{ 'is-fullscreen': isFullScreen }">

            <div class="btn-toggle-size" @click="toggleFullScreen" :title="isFullScreen ? 'Thu gọn' : 'Mở rộng'">
                <div class="m-icon" :class="isFullScreen ? 'mi_icon_chevron_right' : 'mi_icon_chevron_left'"></div>
            </div>

            <div class="m-setting-header">
                <h2>Tùy chỉnh giao diện</h2>
                <div class="header-actions">
                    <div class="m-icon mi_icon_help" title="Trợ giúp"></div>
                    <div class="m-icon mi_icon_close" title="Đóng" @click="closeSetting"></div>
                </div>
            </div>

            <div class="m-setting-toolbar">
                <div class="search-box">
                    <input type="text" v-model="searchQuery" placeholder="Nhập từ khóa tìm kiếm" class="m-input" />
                    <div class="m-icon mi_icon_search search-icon"></div>
                </div>
                <div class="mode-toggle">
                    <a href="#" @click.prevent="isEditMode = !isEditMode" class="text-link">
                        {{ isEditMode ? 'Ẩn tên cột hiển thị và độ rộng' : 'Sửa tên cột hiển thị và độ rộng' }}
                    </a>
                </div>
            </div>

            <div class="m-setting-content">
                <table class="m-table-setting">
                    <thead>
                        <tr>
                            <th class="col-drag"></th>
                            <th class="col-check text-center">
                                <label class="m-checkbox-label">
                                    <input type="checkbox" v-model="isAllChecked" @change="toggleCheckAll">
                                    <span class="checkmark"></span>
                                </label>
                            </th>
                            <th class="col-name">Tên cột dữ liệu</th>

                            <template v-if="isEditMode">
                                <th class="col-edit-name">Tên cột trên giao diện</th>
                                <th class="col-width">Độ rộng</th>
                                <th class="col-pin text-center">Cố định cột</th>
                            </template>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="col in displayedColumns" :key="col.field" draggable="true"
                            @dragstart="onDragStart(col.field, $event)" @dragover.prevent
                            @dragenter.prevent="onDragEnter(col.field)" @drop="onDrop(col.field)" @dragend="onDragEnd"
                            :class="{ 'drag-over': draggedOverField === col.field, 'dragging': draggedField === col.field }">

                            <td class="col-drag text-center">
                                <div class="icon-drag-handler"></div>
                            </td>

                            <td class="col-check text-center">
                                <label class="m-checkbox-label">
                                    <input type="checkbox" v-model="col.visible">
                                    <span class="checkmark"></span>
                                </label>
                            </td>

                            <td class="col-name">{{ col.originalLabel }}</td>

                            <template v-if="isEditMode">
                                <td class="col-edit-name">
                                    <input type="text" v-model="col.label" class="m-input-td" />
                                </td>
                                <td class="col-width">
                                    <input type="number" v-model="col.widthNum" class="m-input-td" />
                                </td>
                                <td class="col-pin text-center">
                                    <label class="m-checkbox-label">
                                        <input type="checkbox" v-model="col.pinned">
                                        <span class="checkmark"></span>
                                    </label>
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </table>

                <div class="toggle-show-all" v-if="filteredColumns.length > 10 && !searchQuery">
                    <a href="#" @click.prevent="showAllColumns = !showAllColumns" class="text-link">
                        {{ showAllColumns ? 'Ẩn bớt' : 'Hiển thị thêm' }}
                    </a>
                </div>
            </div>

            <div class="m-setting-footer">
                <button class="m-btn m-btn-secondary" @click="closeSetting">Hủy</button>
                <div class="footer-right">
                    <button class="m-btn m-btn-secondary" @click="resetToDefault">Lấy mẫu ngầm định</button>
                    <button class="m-btn m-btn-primary" @click="saveSetting">Cất</button>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    isVisible: { type: Boolean, default: false },
    columns: { type: Array, required: true }
});

const emit = defineEmits(['close', 'save']);

const isFullScreen = ref(false);
const isEditMode = ref(false);
const searchQuery = ref('');
const showVideo = ref(false);
const showAllColumns = ref(false);

const localColumns = ref([]);

watch(() => props.isVisible, (newVal) => {
    if (newVal) {
        localColumns.value = props.columns.map(col => ({
            ...col,
            originalLabel: col.originalLabel || col.label,
            visible: col.visible !== false,
            pinned: col.pinned || false,
            widthNum: parseInt(col.width?.replace('px', '')) || 150
        }));
        searchQuery.value = '';
        showAllColumns.value = false;
    } else {
        showVideo.value = false;
    }
});

const toggleFullScreen = () => {
    isFullScreen.value = !isFullScreen.value;
};

const closeSetting = () => {
    emit('close');
};

const saveSetting = () => {
    const finalColumns = localColumns.value.map(col => ({
        ...col,
        width: `${col.widthNum}px`
    }));
    emit('save', finalColumns);
    closeSetting();
};

const resetToDefault = () => {
    localColumns.value = props.columns.map(col => ({
        ...col,
        label: col.originalLabel || col.label,
        visible: true,
        pinned: false,
        widthNum: parseInt(col.width?.replace('px', '')) || 150
    }));
};

// Lọc theo tìm kiếm
const filteredColumns = computed(() => {
    if (!searchQuery.value) return localColumns.value;
    const query = searchQuery.value.toLowerCase();
    return localColumns.value.filter(col =>
        col.originalLabel.toLowerCase().includes(query)
    );
});

// Giới hạn hiển thị 10 dòng
const displayedColumns = computed(() => {
    if (showAllColumns.value || searchQuery.value) {
        return filteredColumns.value;
    }
    return filteredColumns.value.slice(0, 10);
});

// Ẩn/hiện hàng loạt dựa theo danh sách đã lọc (Chuẩn UX MISA)
const isAllChecked = computed({
    get: () => filteredColumns.value.length > 0 && filteredColumns.value.every(c => c.visible),
    set: (val) => filteredColumns.value.forEach(c => c.visible = val)
});

const toggleCheckAll = (e) => {
    isAllChecked.value = e.target.checked;
};

// =====================================
// XỬ LÝ DRAG & DROP BẰNG FIELD
// =====================================
const draggedField = ref(null);
const draggedOverField = ref(null);

const onDragStart = (field, event) => {
    draggedField.value = field;
    event.dataTransfer.effectAllowed = 'move';
    setTimeout(() => event.target.style.opacity = "0.5", 0);
};

const onDragEnter = (field) => {
    draggedOverField.value = field;
};

const onDrop = (targetField) => {
    if (draggedField.value && draggedField.value !== targetField) {
        const fromIndex = localColumns.value.findIndex(c => c.field === draggedField.value);
        const toIndex = localColumns.value.findIndex(c => c.field === targetField);

        if (fromIndex !== -1 && toIndex !== -1) {
            const itemToMove = localColumns.value.splice(fromIndex, 1)[0];
            localColumns.value.splice(toIndex, 0, itemToMove);
        }
    }
    draggedField.value = null;
    draggedOverField.value = null;
};

const onDragEnd = (event) => {
    event.target.style.opacity = "1";
    draggedField.value = null;
    draggedOverField.value = null;
};
</script>

<style scoped>
* {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    font-size: 13px;
}

.m-setting-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
}

.m-setting-drawer {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 40%;
    background-color: #fff;
    box-shadow: -3px 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.m-setting-drawer.is-fullscreen {
    width: 95% !important;
}

.btn-toggle-size {
    position: absolute;
    top: 50%;
    left: -16px;
    width: 16px;
    height: 48px;
    background-color: #fff;
    border: 1px solid #c9ccd2;
    border-right: none;
    border-radius: 4px 0 0 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
    transform: translateY(-50%);
    z-index: 10;
    transition: all 0.2s ease;
}

.btn-toggle-size:hover {
    background-color: #f2f2f2;
}

.m-setting-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
}

.m-setting-header h2 {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: #111;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.header-actions .m-icon {
    cursor: pointer;
    opacity: 0.7;
}

.header-actions .m-icon:hover {
    opacity: 1;
}

.m-setting-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px 16px 24px;
}

.search-box {
    position: relative;
    width: 250px;
}

.search-box .m-input {
    width: 100%;
    height: 32px;
    padding: 0 32px 0 12px;
    border: 1px solid #babec5;
    border-radius: 2px;
}

.search-box .m-input:focus {
    border-color: #2ca01c;
    outline: none;
}

.search-icon {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 16px;
    height: 16px;
    opacity: 0.6;
}

.text-link {
    color: #0075c0;
    text-decoration: none;
    cursor: pointer;
    font-weight: 500;
}

.text-link:hover {
    text-decoration: underline;
}

.m-setting-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 24px;
}

.m-table-setting {
    width: 100%;
    border-collapse: collapse;
}

.m-table-setting thead th {
    position: sticky;
    top: 0;
    background-color: #f2f2f2;
    border-top: 1px solid #c9ccd2;
    border-bottom: 1px solid #c9ccd2;
    padding: 10px;
    font-weight: 600;
    text-align: left;
    z-index: 2;
}

.m-table-setting tbody td {
    padding: 8px 10px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #fff;
    transition: background-color 0.2s;
}

.m-table-setting tbody tr:hover td {
    background-color: #f3f8f8;
}

.m-table-setting tbody tr.drag-over td {
    border-top: 2px solid #2ca01c;
}

.toggle-show-all {
    margin-top: 12px;
    margin-bottom: 16px;
    margin-left: 54px;
}

.text-center {
    text-align: center !important;
}

.col-drag {
    width: 40px;
    cursor: grab;
}

.col-check {
    width: 40px;
}

.col-name {
    min-width: 150px;
    font-weight: 500;
}

.col-edit-name {
    width: 200px;
}

.col-width {
    width: 100px;
}

.col-pin {
    width: 80px;
}

.icon-drag-handler {
    background: url(../../assets/icons/Sprites-7ba27b53.svg) no-repeat;
    width: 16px;
    height: 16px;
    border: 2px dotted #a1a1a1;
    display: inline-block;
    cursor: grab;
    opacity: 0.4;
    background-position: -416px -360px;
}

.m-table-setting tbody tr:hover .icon-drag-handler {
    opacity: 1;
}

.m-table-setting tbody tr:active .icon-drag-handler {
    cursor: grabbing;
}

.m-input-td {
    width: 100%;
    height: 32px;
    padding: 0 8px;
    border: 1px solid #babec5;
    border-radius: 2px;
    outline: none;
}

.m-input-td:focus {
    border-color: #2ca01c;
}

.m-checkbox-label {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    width: 18px;
    height: 18px;
}

.m-checkbox-label input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.checkmark {
    position: absolute;
    top: 0;
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

.m-setting-footer {
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

.m-video-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.m-video-box {
    background-color: #fff;
    width: 750px;
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: zoomIn 0.3s ease-out;
}

.m-video-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background-color: #f2f2f2;
    border-bottom: 1px solid #e0e0e0;
}

.m-video-header h3 {
    margin: 0;
    font-size: 18px;
    color: #111;
}

.m-video-body {
    padding: 0;
    background-color: #000;
    display: flex;
}

@keyframes zoomIn {
    from {
        transform: scale(0.95);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.m-icon {
    width: 24px;
    height: 24px;
    background-color: #555;
    mask-size: cover;
    -webkit-mask-size: cover;
}

.mi_icon_chevron_left {
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>');
}

.mi_icon_chevron_right {
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>');
}

.mi_icon_close {
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
}

.mi_icon_help {
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-2.5c0-.55.22-1.05.59-1.42l1.2-1.2C13.1 9.5 13.5 9 14 9c1.1 0 2 .9 2 2 0 .5-.2 1-.53 1.25z"/></svg>');
}
</style>