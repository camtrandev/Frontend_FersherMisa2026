<template>
    <div class="m-employee-view">
        <div class="m-page-header">
            <div class="m-page-title-box">
                <h1 class="m-page-title">Nhân viên</h1>
                <a href="#" class="m-back-link">
                    <div class="m-icon mi_icon_chevron_left_blue"></div>
                    Tất cả danh mục
                </a>
            </div>
            <div class="m-page-actions">
                <div class="m-btn-split">
                    <MsButton class="m-btn-main" @click="openAddForm">Thêm</MsButton>
                    <div class="m-btn-divider"></div>
                    <MsButton class="m-btn-dropdown-icon">
                        <div class="m-icon mi_icon_chevron_down_white"></div>
                    </MsButton>
                </div>
            </div>
        </div>

        <div class="m-page-content">
            <div class="m-toolbar">
                <div class="m-toolbar-left">
                    <div class="m-toolbar-icon" style="margin-right: 12px;" title="Thực hiện hàng loạt">
                        <div class="m-icon mi_icon_arrow_check"></div>
                    </div>

                    <MsButton type="secondary" class="btn-dropdown m-btn-util">
                        <span>Thực hiện hàng loạt</span>
                        <div class="m-icon mi_icon_chevron_down"></div>
                    </MsButton>
                </div>

                <div class="m-toolbar-right">
                    <div class="m-search-box">
                        <MsInput placeholder="Tìm theo mã, tên nhân viên" iconRight="m-icon mi_icon_search" />
                    </div>

                    <div class="m-toolbar-icon" title="Lấy lại dữ liệu">
                        <div class="m-icon mi_icon_refresh"></div>
                    </div>
                    <div class="m-toolbar-icon" title="Xuất ra Excel">
                        <div class="m-icon mi_icon_excel"></div>
                    </div>
                    <div class="m-toolbar-icon" title="Tùy chỉnh giao diện">
                        <div class="m-icon mi_icon_setting"></div>
                    </div>
                </div>
            </div>

            <div class="m-table-container">
                <MsTable :columns="tableColumns" :data="displayData" @filter-data="onApplyFilter"
                    @onDeleteRow="openDeleteDialog" @onEditRow="openEditForm" />

                <EmployeeForm :isVisible="showEmployeeForm" :editData="currentEmployeeData" @close="closeEmployeeForm"
                    @save="handleSaveEmployee" />

                <DialogConfirm :isVisible="showDeleteDialog" @close="showDeleteDialog = false"
                    @confirm="handleConfirmDelete">
                    Bạn có thực sự muốn xóa Nhân viên &lt;{{ employeeToDelete?.employeeCode }}&gt; không?
                </DialogConfirm>

                <MsPagination class="m-pagination-fixed" :totalRecords="displayData.length" :pageSize="200"
                    :currentPage="1" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// Import các Base Component
import MsButton from '../../components/base/MsButton.vue';
import MsInput from '../../components/base/MsInput.vue';
import MsTable from '../../components/base/MsTable.vue';
import MsPagination from '../../components/base/MsPagination.vue'
import DialogConfirm from '../../components/base/DialogConfirm.vue'
import EmployeeForm from '../employee/EmployeeForm.vue'

const showDeleteDialog = ref(false); // Trạng thái ẩn/hiện dialog
const employeeToDelete = ref(null);  // Lưu thông tin nhân viên đang chuẩn bị xóa

const showEmployeeForm = ref(false);   // Trạng thái ẩn/hiện form
const currentEmployeeData = ref(null); // Dữ liệu nhân viên đang được chọn để sửa (nếu có)

const tableColumns = ref([
    { label: 'Mã nhân viên', field: 'employeeCode', width: '130px', alignClass: 'text-left', filterable: true },
    { label: 'Tên nhân viên', field: 'employeeName', width: '220px', alignClass: 'text-left', filterable: true },
    { label: 'Mã số thuế', field: 'taxCode', width: '130px', alignClass: 'text-left', filterable: true },
    { label: 'Chức danh', field: 'positionName', width: '150px', alignClass: 'text-left', filterable: true },
    { label: 'Mã đơn vị', field: 'departmentCode', width: '120px', alignClass: 'text-left', filterable: true },
    { label: 'Tên đơn vị', field: 'departmentName', width: '200px', alignClass: 'text-left', filterable: true },
    { label: 'Số tài khoản', field: 'bankAccount', width: '150px', alignClass: 'text-left', filterable: true },
    { label: 'Tên ngân hàng', field: 'bankName', width: '180px', alignClass: 'text-left', filterable: true },
    { label: 'Trạng thái', field: 'status', width: '150px', alignClass: 'text-left', filterable: true },
    { label: 'Số điện thoại di động', field: 'phoneNumber', width: '160px', alignClass: 'text-left', filterable: true },
    { label: 'Giới tính', field: 'genderName', width: '100px', alignClass: 'text-left' },
    { label: 'Ngày sinh', field: 'dateOfBirth', width: '120px', alignClass: 'text-center' },
    { label: 'Số hộ chiếu', field: 'passportNumber', width: '150px', alignClass: 'text-left' },
    { label: 'Số CCCD/ CMND', field: 'identityNumber', width: '160px', alignClass: 'text-left', filterable: true },
    { label: 'Ngày cấp', field: 'identityDate', width: '120px', alignClass: 'text-center' },
    { label: 'Nơi cấp', field: 'identityPlace', width: '200px', alignClass: 'text-left', filterable: true },
    { label: 'Là khách hàng', field: 'isCustomer', width: '130px', alignClass: 'text-center', type: 'checkbox' },
    { label: 'Là nhà cung cấp', field: 'isVendor', width: '140px', alignClass: 'text-center', type: 'checkbox' },
    { label: 'Ngày tạo', field: 'createdDate', width: '120px', alignClass: 'text-center' },
    { label: 'Người tạo', field: 'createdBy', width: '150px', alignClass: 'text-left' },
    { label: 'Ngày sửa', field: 'modifiedDate', width: '120px', alignClass: 'text-center' },
    { label: 'Người sửa', field: 'modifiedBy', width: '150px', alignClass: 'text-left' }
]);

// Dữ liệu mock trích xuất chính xác từ hình ảnh
const mockData = ref([
    { employeeCode: 'BQH', employeeName: 'Bùi Quý Hợp', taxCode: '', positionName: 'Công nhân', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '', bankName: '', status: 'Ngừng sử dụng', phoneNumber: '0912345678', genderName: 'Nam', dateOfBirth: '15/05/1990', passportNumber: '', identityNumber: '001090123456', identityDate: '10/10/2015', identityPlace: 'Hà Nội', isCustomer: false, isVendor: false, createdDate: '01/01/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'BTKP', employeeName: 'Bùi Thị Kim Phượng', taxCode: '0102345678', positionName: 'Thủ kho', departmentCode: 'VP', departmentName: 'Văn phòng', bankAccount: '190333444555', bankName: 'Techcombank', status: 'Đang sử dụng', phoneNumber: '0988777666', genderName: 'Nữ', dateOfBirth: '22/11/1995', passportNumber: 'B1234567', identityNumber: '030195001234', identityDate: '05/06/2018', identityPlace: 'Hà Nội', isCustomer: true, isVendor: true, createdDate: '15/02/2026', createdBy: 'Admin', modifiedDate: '20/02/2026', modifiedBy: 'Admin' },
    { employeeCode: 'DDD', employeeName: 'Đinh Đăng Đại', taxCode: '', positionName: 'Lái xe', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '', bankName: '', status: 'Ngừng sử dụng', phoneNumber: '', genderName: 'Nam', dateOfBirth: '10/02/1988', passportNumber: '', identityNumber: '034088005678', identityDate: '', identityPlace: '', isCustomer: false, isVendor: true, createdDate: '23/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'DHSANG', employeeName: 'Đinh Hữu Sang', taxCode: '0103456789', positionName: 'Công nhân', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '0123456789', bankName: 'Vietcombank', status: 'Ngừng sử dụng', phoneNumber: '0909112233', genderName: 'Nam', dateOfBirth: '05/09/1992', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '10/03/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'DTH', employeeName: 'Đinh Thị Hồng', taxCode: '0104567890', positionName: 'Giám đốc', departmentCode: 'VP', departmentName: 'Văn phòng', bankAccount: '987654321', bankName: 'MB Bank', status: 'Đang sử dụng', phoneNumber: '0977665544', genderName: 'Nữ', dateOfBirth: '12/12/1985', passportNumber: 'C7654321', identityNumber: '001185009876', identityDate: '20/11/2020', identityPlace: 'Cục CSQLHC', isCustomer: false, isVendor: false, createdDate: '01/01/2025', createdBy: 'Admin', modifiedDate: '10/05/2026', modifiedBy: 'Admin' },
    { employeeCode: 'DTH1', employeeName: 'Đinh Thị Hương', taxCode: '', positionName: 'Công nhân', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '', bankName: '', status: 'Ngừng sử dụng', phoneNumber: '0966554433', genderName: 'Nữ', dateOfBirth: '', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '15/04/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'DTHUE', employeeName: 'Đinh Thị Huệ', taxCode: '0105678901', positionName: 'Công nhân', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '1122334455', bankName: 'BIDV', status: 'Ngừng sử dụng', phoneNumber: '', genderName: 'Nữ', dateOfBirth: '25/08/1993', passportNumber: '', identityNumber: '001193001122', identityDate: '15/05/2019', identityPlace: 'Hà Nội', isCustomer: false, isVendor: false, createdDate: '10/01/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'DTTH', employeeName: 'Đào Thị Thu Hường', taxCode: '0106789012', positionName: 'Thủ quỹ', departmentCode: 'VP', departmentName: 'Văn phòng', bankAccount: '5566778899', bankName: 'VietinBank', status: 'Đang sử dụng', phoneNumber: '0933221100', genderName: 'Nữ', dateOfBirth: '08/03/1991', passportNumber: '', identityNumber: '001191003344', identityDate: '02/09/2017', identityPlace: 'Hà Nội', isCustomer: false, isVendor: false, createdDate: '05/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'DVH', employeeName: 'Đào Văn Hiệp', taxCode: '', positionName: 'Nhân viên', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '9988776655', bankName: 'VPBank', status: 'Đang sử dụng', phoneNumber: '0911223344', genderName: 'Nam', dateOfBirth: '14/07/1996', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: true, isVendor: false, createdDate: '12/04/2026', createdBy: 'Admin', modifiedDate: '14/04/2026', modifiedBy: 'Admin' },
    { employeeCode: 'DVHOI', employeeName: 'Đỗ Văn Hội', taxCode: '0107890123', positionName: 'Công nhân', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '', bankName: '', status: 'Ngừng sử dụng', phoneNumber: '0900112233', genderName: 'Nam', dateOfBirth: '30/10/1989', passportNumber: '', identityNumber: '001089005566', identityDate: '12/12/2016', identityPlace: 'Thái Bình', isCustomer: false, isVendor: false, createdDate: '20/03/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'DXH', employeeName: 'Đào Xuân Huân', taxCode: '0108901234', positionName: 'Nhân viên', departmentCode: 'VP', departmentName: 'Văn phòng', bankAccount: '2233445566', bankName: 'ACB', status: 'Đang sử dụng', phoneNumber: '0988123123', genderName: 'Nam', dateOfBirth: '17/06/1994', passportNumber: 'B9876543', identityNumber: '001094007788', identityDate: '25/08/2021', identityPlace: 'Hà Nội', isCustomer: false, isVendor: true, createdDate: '01/02/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'DXT', employeeName: 'Đồng Xuân Tùng', taxCode: '', positionName: 'Công nhân', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '', bankName: '', status: 'Ngừng sử dụng', phoneNumber: '', genderName: 'Nam', dateOfBirth: '02/02/1998', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '18/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NML', employeeName: 'Nghiêm Mạnh Linh', taxCode: '0109012345', positionName: 'Công nhân', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '3344556677', bankName: 'TPBank', status: 'Đang sử dụng', phoneNumber: '0977889900', genderName: 'Nam', dateOfBirth: '19/09/1997', passportNumber: '', identityNumber: '001097009900', identityDate: '10/10/2020', identityPlace: 'Hà Nội', isCustomer: true, isVendor: true, createdDate: '22/04/2026', createdBy: 'Admin', modifiedDate: '25/04/2026', modifiedBy: 'Admin' },
    { employeeCode: 'NTN', employeeName: 'Nguyễn Thị Nên', taxCode: '0101122334', positionName: 'Kế toán', departmentCode: 'PKT', departmentName: 'Phòng Kế toán', bankAccount: '4455667788', bankName: 'Vietcombank', status: 'Đang sử dụng', phoneNumber: '0966778899', genderName: 'Nữ', dateOfBirth: '21/12/1990', passportNumber: '', identityNumber: '001190001234', identityDate: '05/05/2018', identityPlace: 'Hà Nội', isCustomer: false, isVendor: false, createdDate: '05/01/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NTX', employeeName: 'Nguyễn Thị Xoa', taxCode: '', positionName: 'Công nhân', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '', bankName: '', status: 'Ngừng sử dụng', phoneNumber: '0911335577', genderName: 'Nữ', dateOfBirth: '11/11/1992', passportNumber: '', identityNumber: '001192005678', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '14/03/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00001', employeeName: 'lvtho', taxCode: '', positionName: 'Nhân viên', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '', bankName: '', status: 'Đang sử dụng', phoneNumber: '', genderName: 'Nam', dateOfBirth: '', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '24/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00002', employeeName: 'lvtho 2', taxCode: '', positionName: 'Nhân viên', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '', bankName: '', status: 'Đang sử dụng', phoneNumber: '', genderName: 'Nữ', dateOfBirth: '', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '24/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00003', employeeName: 'lvtho 3', taxCode: '0109988776', positionName: 'Lập trình viên', departmentCode: 'PIT', departmentName: 'Phòng IT', bankAccount: '5566778899', bankName: 'Techcombank', status: 'Đang sử dụng', phoneNumber: '0988776655', genderName: 'Nam', dateOfBirth: '01/01/1995', passportNumber: '', identityNumber: '001095001122', identityDate: '10/10/2020', identityPlace: 'Hà Nội', isCustomer: false, isVendor: false, createdDate: '25/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00004', employeeName: 'lvtho 4', taxCode: '', positionName: 'Kiểm thử viên', departmentCode: 'PIT', departmentName: 'Phòng IT', bankAccount: '', bankName: '', status: 'Đang sử dụng', phoneNumber: '0977665544', genderName: 'Nữ', dateOfBirth: '02/02/1996', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '25/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00005', employeeName: 'lvtho 5', taxCode: '0108877665', positionName: 'Trưởng phòng IT', departmentCode: 'PIT', departmentName: 'Phòng IT', bankAccount: '6677889900', bankName: 'Vietcombank', status: 'Đang sử dụng', phoneNumber: '0966554433', genderName: 'Nam', dateOfBirth: '03/03/1988', passportNumber: 'C1122334', identityNumber: '001088003344', identityDate: '15/05/2015', identityPlace: 'Hà Nội', isCustomer: true, isVendor: false, createdDate: '25/05/2026', createdBy: 'Admin', modifiedDate: '26/05/2026', modifiedBy: 'Admin' },
    { employeeCode: 'NV00006', employeeName: 'Trần Thị Mai', taxCode: '', positionName: 'Nhân sự', departmentCode: 'PNS', departmentName: 'Phòng Nhân sự', bankAccount: '', bankName: '', status: 'Đang sử dụng', phoneNumber: '', genderName: 'Nữ', dateOfBirth: '04/04/1994', passportNumber: '', identityNumber: '001194005566', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '20/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00007', employeeName: 'Lê Văn Tám', taxCode: '0107766554', positionName: 'Bảo vệ', departmentCode: 'VP', departmentName: 'Văn phòng', bankAccount: '7788990011', bankName: 'Agribank', status: 'Đang sử dụng', phoneNumber: '0955443322', genderName: 'Nam', dateOfBirth: '05/05/1975', passportNumber: '', identityNumber: '001075007788', identityDate: '20/10/2010', identityPlace: 'Hà Nội', isCustomer: false, isVendor: false, createdDate: '15/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00008', employeeName: 'Phạm Thu Thủy', taxCode: '', positionName: 'Lễ tân', departmentCode: 'VP', departmentName: 'Văn phòng', bankAccount: '8899001122', bankName: 'Sacombank', status: 'Đang sử dụng', phoneNumber: '0944332211', genderName: 'Nữ', dateOfBirth: '06/06/1998', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: true, isVendor: false, createdDate: '10/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00009', employeeName: 'Hoàng Minh Tuấn', taxCode: '0106655443', positionName: 'Kinh doanh', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '9900112233', bankName: 'VIB', status: 'Ngừng sử dụng', phoneNumber: '0933221100', genderName: 'Nam', dateOfBirth: '07/07/1991', passportNumber: '', identityNumber: '001091009900', identityDate: '12/12/2018', identityPlace: 'Đà Nẵng', isCustomer: false, isVendor: true, createdDate: '05/05/2026', createdBy: 'Admin', modifiedDate: '10/05/2026', modifiedBy: 'Admin' },
    { employeeCode: 'NV00010', employeeName: 'Vũ Hải Yến', taxCode: '', positionName: 'Kế toán trưởng', departmentCode: 'PKT', departmentName: 'Phòng Kế toán', bankAccount: '', bankName: '', status: 'Đang sử dụng', phoneNumber: '0922110099', genderName: 'Nữ', dateOfBirth: '08/08/1985', passportNumber: 'D4455667', identityNumber: '001185001122', identityDate: '08/08/2015', identityPlace: 'Hà Nội', isCustomer: false, isVendor: false, createdDate: '01/05/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00011', employeeName: 'Ngô Trọng Đạt', taxCode: '0105544332', positionName: 'Nhân viên IT', departmentCode: 'PIT', departmentName: 'Phòng IT', bankAccount: '1011121314', bankName: 'MB Bank', status: 'Đang sử dụng', phoneNumber: '0911009988', genderName: 'Nam', dateOfBirth: '09/09/1997', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '28/04/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00012', employeeName: 'Trịnh Thanh Bình', taxCode: '', positionName: 'Tạp vụ', departmentCode: 'VP', departmentName: 'Văn phòng', bankAccount: '', bankName: '', status: 'Ngừng sử dụng', phoneNumber: '', genderName: 'Nữ', dateOfBirth: '10/10/1970', passportNumber: '', identityNumber: '001170003344', identityDate: '10/10/2010', identityPlace: 'Nam Định', isCustomer: false, isVendor: false, createdDate: '25/04/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00013', employeeName: 'Bùi Anh Khoa', taxCode: '0104433221', positionName: 'Chuyên viên', departmentCode: 'PNS', departmentName: 'Phòng Nhân sự', bankAccount: '1213141516', bankName: 'Techcombank', status: 'Đang sử dụng', phoneNumber: '0900998877', genderName: 'Nam', dateOfBirth: '11/11/1993', passportNumber: '', identityNumber: '001093005566', identityDate: '11/11/2019', identityPlace: 'Hà Nội', isCustomer: true, isVendor: true, createdDate: '20/04/2026', createdBy: 'Admin', modifiedDate: '22/04/2026', modifiedBy: 'Admin' },
    { employeeCode: 'NV00014', employeeName: 'Lý Thảo Nguyên', taxCode: '', positionName: 'Thực tập sinh', departmentCode: 'PIT', departmentName: 'Phòng IT', bankAccount: '', bankName: '', status: 'Đang sử dụng', phoneNumber: '0899887766', genderName: 'Nữ', dateOfBirth: '12/12/2001', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '15/04/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00015', employeeName: 'Đinh Tuấn Kiệt', taxCode: '0103322110', positionName: 'Trưởng phòng KD', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '1415161718', bankName: 'Vietcombank', status: 'Đang sử dụng', phoneNumber: '0888776655', genderName: 'Nam', dateOfBirth: '13/01/1982', passportNumber: 'E7788990', identityNumber: '001082007788', identityDate: '13/01/2016', identityPlace: 'Hà Nội', isCustomer: false, isVendor: false, createdDate: '10/04/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00016', employeeName: 'Trương Mỹ Lan', taxCode: '', positionName: 'Nhân viên', departmentCode: 'PKT', departmentName: 'Phòng Kế toán', bankAccount: '1617181920', bankName: 'BIDV', status: 'Ngừng sử dụng', phoneNumber: '', genderName: 'Nữ', dateOfBirth: '14/02/1990', passportNumber: '', identityNumber: '001190009900', identityDate: '', identityPlace: '', isCustomer: false, isVendor: true, createdDate: '05/04/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00017', employeeName: 'Tô Vĩnh Diện', taxCode: '0102211009', positionName: 'Công nhân', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '', bankName: '', status: 'Đang sử dụng', phoneNumber: '0866554433', genderName: 'Nam', dateOfBirth: '15/03/1995', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '01/04/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00018', employeeName: 'Lưu Quang Vũ', taxCode: '', positionName: 'Biên tập viên', departmentCode: 'VP', departmentName: 'Văn phòng', bankAccount: '1819202122', bankName: 'VPBank', status: 'Đang sử dụng', phoneNumber: '0855443322', genderName: 'Nam', dateOfBirth: '16/04/1980', passportNumber: '', identityNumber: '001080001122', identityDate: '16/04/2010', identityPlace: 'Hà Nội', isCustomer: true, isVendor: false, createdDate: '28/03/2026', createdBy: 'Admin', modifiedDate: '30/03/2026', modifiedBy: 'Admin' },
    { employeeCode: 'NV00019', employeeName: 'Chu Văn An', taxCode: '0101100998', positionName: 'Cố vấn', departmentCode: 'VP', departmentName: 'Văn phòng', bankAccount: '', bankName: '', status: 'Ngừng sử dụng', phoneNumber: '', genderName: 'Nam', dateOfBirth: '17/05/1972', passportNumber: 'F1122334', identityNumber: '001072003344', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '20/03/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00020', employeeName: 'Hà Kiều Anh', taxCode: '', positionName: 'Nhân viên', departmentCode: 'PNS', departmentName: 'Phòng Nhân sự', bankAccount: '2021222324', bankName: 'ACB', status: 'Đang sử dụng', phoneNumber: '0833221100', genderName: 'Nữ', dateOfBirth: '18/06/1999', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '15/03/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00021', employeeName: 'Võ Nguyên Giáp', taxCode: '0100099887', positionName: 'Bảo vệ', departmentCode: 'VP', departmentName: 'Văn phòng', bankAccount: '', bankName: '', status: 'Đang sử dụng', phoneNumber: '0822110099', genderName: 'Nam', dateOfBirth: '19/07/1984', passportNumber: '', identityNumber: '001084005566', identityDate: '19/07/2015', identityPlace: 'Hà Nội', isCustomer: false, isVendor: false, createdDate: '10/03/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00022', employeeName: 'Mạc Đĩnh Chi', taxCode: '', positionName: 'Lái xe', departmentCode: 'PKD', departmentName: 'Phòng kinh doanh', bankAccount: '2425262728', bankName: 'TPBank', status: 'Ngừng sử dụng', phoneNumber: '', genderName: 'Nam', dateOfBirth: '20/08/1987', passportNumber: '', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: true, createdDate: '05/03/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' },
    { employeeCode: 'NV00023', employeeName: 'Hồ Xuân Hương', taxCode: '0109887766', positionName: 'Nhân sự', departmentCode: 'PNS', departmentName: 'Phòng Nhân sự', bankAccount: '', bankName: '', status: 'Đang sử dụng', phoneNumber: '0800998877', genderName: 'Nữ', dateOfBirth: '21/09/1994', passportNumber: '', identityNumber: '001194007788', identityDate: '21/09/2020', identityPlace: 'Hà Nội', isCustomer: true, isVendor: true, createdDate: '01/03/2026', createdBy: 'Admin', modifiedDate: '05/03/2026', modifiedBy: 'Admin' },
    { employeeCode: 'NV00024', employeeName: 'Nguyễn Du', taxCode: '', positionName: 'Kiểm toán nội bộ', departmentCode: 'PKT', departmentName: 'Phòng Kế toán', bankAccount: '2829303132', bankName: 'Vietcombank', status: 'Đang sử dụng', phoneNumber: '0799887766', genderName: 'Nam', dateOfBirth: '22/10/1989', passportNumber: 'G9988776', identityNumber: '', identityDate: '', identityPlace: '', isCustomer: false, isVendor: false, createdDate: '25/02/2026', createdBy: 'Admin', modifiedDate: '', modifiedBy: '' }
]);

const openAddForm = () => {
    currentEmployeeData.value = null; // Form thêm mới nên dữ liệu truyền vào là null
    showEmployeeForm.value = true;
};

// Hàm chạy khi bấm nút "Sửa" trên từng dòng của MsTable
const openEditForm = (employeeData) => {
    currentEmployeeData.value = employeeData; // Gửi dữ liệu của dòng đó vào form
    showEmployeeForm.value = true;
};

// Hàm chạy khi bấm nút "Hủy" hoặc nút "X" trên Form
const closeEmployeeForm = () => {
    showEmployeeForm.value = false;
};

// Hàm chạy khi bấm "Cất" hoặc "Cất và Thêm" trên Form
const handleSaveEmployee = async ({ data, isSaveAndAdd }) => {
    console.log("[Giả lập API] Dữ liệu chuẩn bị lưu:", data);
    console.log("Loại hành động:", isSaveAndAdd ? "Cất và Thêm mới" : "Cất và Đóng");

    try {
        // [NƠI GHÉP API SAU NÀY]
        if (currentEmployeeData.value) {
            // Có dữ liệu ban đầu -> Đây là hành động Sửa (Update)
            // await axios.put(`.../Employees/${data.employeeId}`, data);
            console.log("Đang gọi API Update...");
        } else {
            // Không có dữ liệu ban đầu -> Đây là hành động Thêm (Create)
            // await axios.post(`.../Employees`, data);
            console.log("Đang gọi API Insert...");
        }

        // Xử lý sau khi lưu thành công
        // await fetchEmployees(); // Load lại bảng dữ liệu

        if (isSaveAndAdd) {
            // Nếu là "Cất và Thêm", giữ nguyên form, xóa trắng dữ liệu cũ đi để nhập tiếp
            currentEmployeeData.value = null;
            // (Bạn sẽ cần logic reset form bên trong EmployeeForm.vue nữa)
        } else {
            // Nếu là "Cất", đóng form lại
            closeEmployeeForm();
        }

    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
    }
};


const activeFilters = ref({}); // Lưu trữ điều kiện lọc hiện tại của các cột

// Hàm nhận tín hiệu Lọc hoặc Bỏ lọc từ component MsTable.vue
const onApplyFilter = ({ field, value, operator }) => {
    const newFilters = { ...activeFilters.value };

    // Nếu giá trị nhập vào bị rỗng VÀ điều kiện KHÔNG PHẢI là (Trống)/(Không trống)
    // => Tức là người dùng muốn Bỏ lọc cột này -> Xóa thông tin lọc của cột
    if ((value === null || value === undefined || value.trim() === '') && !['empty', 'not_empty'].includes(operator)) {
        delete newFilters[field];
    } else {
        // Lưu lại thông tin lọc mới (Trim bỏ dấu cách thừa ở đầu cuối)
        newFilters[field] = {
            value: value ? value.trim() : '',
            operator: operator
        };
    }

    activeFilters.value = newFilters;
};

// Mảng dữ liệu hiển thị tự động tính toán lại khi mockData hoặc activeFilters thay đổi
const displayData = computed(() => {
    return mockData.value.filter(item => {
        // Lặp qua tất cả các cột đang được đặt bộ lọc
        for (const key in activeFilters.value) {
            const filterInfo = activeFilters.value[key];
            if (!filterInfo) continue;

            const op = filterInfo.operator;

            // Ép kiểu về dạng chuỗi viết thường để tìm kiếm không phân biệt hoa/thường
            const itemValueStr = (item[key] === null || item[key] === undefined) ? '' : item[key].toString().toLowerCase();
            const searchValueStr = (filterInfo.value || '').toLowerCase();

            // Áp dụng 8 điều kiện lọc chuẩn
            switch (op) {
                case 'empty': // (Trống)
                    if (itemValueStr !== '') return false;
                    break;
                case 'not_empty': // (Không trống)
                    if (itemValueStr === '') return false;
                    break;
                case 'equals': // Bằng
                    if (itemValueStr !== searchValueStr) return false;
                    break;
                case 'not_equals': // Khác
                    if (itemValueStr === searchValueStr) return false;
                    break;
                case 'contains': // Chứa
                    if (!itemValueStr.includes(searchValueStr)) return false;
                    break;
                case 'not_contains': // Không chứa
                    if (itemValueStr.includes(searchValueStr)) return false;
                    break;
                case 'starts_with': // Bắt đầu với
                    if (!itemValueStr.startsWith(searchValueStr)) return false;
                    break;
                case 'ends_with': // Kết thúc với
                    if (!itemValueStr.endsWith(searchValueStr)) return false;
                    break;
                default: // Mặc định là 'Chứa'
                    if (!itemValueStr.includes(searchValueStr)) return false;
            }
        }

        // Dòng dữ liệu này thỏa mãn tất cả các bộ lọc thì được hiển thị
        return true;
    });
});

const openDeleteDialog = (employeeData) => {
    employeeToDelete.value = employeeData; // Cất dữ liệu nhân viên được click
    showDeleteDialog.value = true;         // Mở popup
};

// Hàm chạy khi người dùng bấm nút "Có" trên Dialog
const handleConfirmDelete = async () => {
    if (!employeeToDelete.value) return;

    // Lấy ra mã hoặc ID (Sau này nối API thì dùng EmployeeId kiểu Guid)
    const recordId = employeeToDelete.value.employeeCode;

    try {
        // [NƠI GHÉP API SAU NÀY] 
        // Ví dụ: await axios.delete(`https://api.yourdomain.com/v1/Employees/${recordId}`);
        console.log(`[Giả lập API] Đang gửi Request XÓA nhân viên: ${recordId}`);

        // --- Xử lý sau khi gọi API thành công ---
        // 1. Ẩn dialog
        showDeleteDialog.value = false;

        // 2. Load lại dữ liệu bảng (Thêm hàm get/fetch danh sách vào đây)
        // Ví dụ: await fetchEmployees(); 

        // (Tạm thời xóa chay trên giao diện để test)
        mockData.value = mockData.value.filter(emp => emp.employeeCode !== recordId);

        // 3. (Tùy chọn) Hiện Toast message báo xóa thành công

    } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
        // Xử lý lỗi: Hiện dialog cảnh báo không xóa được...
    }
};
</script>

<style scoped>
/* Tổng thể trang */
.m-employee-view {
    height: 100%;
    background-color: #f4f5f8;
    height: 100vh;
    padding: 0 0px 20px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
}

/* --- 1. HEADER TRANG --- */
.m-page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px 16px 0 0;
}

.m-page-title-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.m-page-title {
    font-size: 24px;
    font-weight: 700;
    color: #111;
    margin: 0;
}

.m-back-link {
    display: flex;
    align-items: center;
    color: #0075c0;
    text-decoration: none;
    font-size: 13px;
    cursor: pointer;
    margin-top: 4px;
}

.m-back-link .m-icon {
    margin-right: 4px;
}

.m-back-link:hover {
    text-decoration: underline;
}

/* Split Button Thêm */
.m-btn-split {
    display: flex;
    height: 36px;
    border-radius: 3px;
}

.m-btn-main {
    background-color: #2ca01c !important;
    color: #fff !important;
    border: none !important;
    padding: 0 16px !important;
    font-weight: 600 !important;
    border-radius: 30px 0 0 30px;
}

.m-btn-main:hover,
.m-btn-dropdown-icon:hover {
    background-color: #35bf22 !important;
}

.m-btn-divider {
    width: 1px;
    background-color: #fff;
    opacity: 0.3;
}

.m-btn-dropdown-icon {
    background-color: #2ca01c !important;
    border: none !important;
    padding: 0 8px !important;
    min-width: unset !important;
    border-radius: 0 30px 30px 0;
}

/* --- 2. KHỐI NỘI DUNG NỀN TRẮNG --- */
.m-page-content {
    background-color: #ffffff;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-radius: 4px;
    padding: 16px 16px 40px 16px;
    box-sizing: border-box;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

/* --- 3. TOOLBAR --- */
.m-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.m-toolbar-left {
    display: flex;
    align-items: center;

}

.btn-dropdown.m-btn-util {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;

    gap: 6px !important;

    height: 36px !important;
    padding: 0 16px !important;

    border-radius: 20px !important;
    border: 1px solid #8d9096 !important;
    background-color: #fff !important;

    width: fit-content !important;
    line-height: 1 !important;
}
.btn-dropdown.m-btn-util .mi_icon_chevron_down {
    width: 16px !important;
    height: 16px !important;

    margin: 0 !important;
    flex-shrink: 0 !important;

    transform: translateY(5px); /* đẩy xuống */
    opacity: 0.6;
}

.btn-dropdown.m-btn-util span {
    color: #9b9b9b !important;   /* màu xám nhạt */
    font-size: 14px !important;  /* to hơn */
    font-weight: 600 !important; /* đậm vừa */
    
    display: flex !important;
    align-items: center !important;
    line-height: 1 !important;
}


.btn-dropdown.m-btn-util:hover {
    border-color: #111 !important;
    color: #111 !important;
}

.m-btn-util {
    border: 2px solid #e0e0e0 !important;
    border-radius: 30px !important;
    padding: 0 16px !important;
    color: #111 !important;
    font-weight: 600 !important;
    background-color: transparent !important;
    height: 32px !important;
    display: flex;
    align-items: center;
    gap: 8px;
}

.m-toolbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.m-search-box {
    width: 260px;
}

.m-toolbar-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* --- 4. TABLE CONTAINER --- */
.m-table-container {
    height: calc(100vh - 180px);
    position: relative;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    border-bottom: none;
}

/* --- 5. PAGINATION FIXED --- */
.m-pagination-fixed {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    z-index: 10;
    border-top: 1px solid #e0e0e0;
    background-color: #fff;
    padding: 0 12px;
}

/* --- ICON MASK --- */
.m-icon {
    background-repeat: no-repeat;
    background-position: center;
    background: url(../../assets/icons/Sprites-7ba27b53.svg) no-repeat;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
}

.mi_icon_chevron_left_blue {
    background-color: #0075c0;
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>');
    width: 16px;
    height: 16px;
}

.mi_icon_chevron_down_white {
    background-color: #fff;
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>');
    width: 16px;
    height: 16px;
}

.mi_icon_refresh {
    background-position: -424px -200px;
}

.mi_icon_excel {
    background-position: -704px -200px;
}

.mi_icon_setting {
    background-position: -88px -200px;
}

.mi_icon_search {
    background-position: -992px -360px;
}

.mi_icon_chevron_down {
    background-position: -560px -359px;
}

.mi_icon_arrow_check {
    background-position: -256px -143px;
}
</style>