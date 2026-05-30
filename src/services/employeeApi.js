import axios from 'axios';

const API_BASE_URL = 'https://localhost:7244/api/v1';

const employeeApi = {
    // ====================================================
    // 1. LẤY DỮ LIỆU & PHÂN TRANG
    // ====================================================
    getEmployeesPaging(params) {
        return axios.get(`${API_BASE_URL}/Employees/paging`, { params });
    },
    
    getEmployeeById(id) {
        return axios.get(`${API_BASE_URL}/Employees/${id}`);
    },
    
    getDepartments() {
        return axios.get(`${API_BASE_URL}/Departments`);
    },

    // ====================================================
    // 2. THÊM, SỬA, XÓA (CRUD)
    // ====================================================
    createEmployee(data) {
        return axios.post(`${API_BASE_URL}/Employees`, data);
    },
    
    updateEmployee(id, data) {
        return axios.put(`${API_BASE_URL}/Employees/${id}`, data);
    },
    
    deleteEmployee(id) {
        return axios.delete(`${API_BASE_URL}/Employees/${id}`);
    },
    
    deleteMultipleEmployees(data) {
        // Xóa nhiều nhân viên (thường API sẽ nhận một list ID trong body)
        return axios.delete(`${API_BASE_URL}/Employees`, { data }); 
    },

    // ====================================================
    // 3. CÁC NGHIỆP VỤ BỔ TRỢ & EXPORT
    // ====================================================
    getNewCode() {
        return axios.get(`${API_BASE_URL}/Employees/new-code`);
    },
    
    checkDuplicateCode(employeeCode) {
        // Có thể API yêu cầu truyền params, bạn điều chỉnh lại key cho khớp với Backend nếu cần nhé
        return axios.get(`${API_BASE_URL}/Employees/check-duplicate-code`, {
            params: { employeeCode }
        });
    },

    checkDuplicateCodesList(codes) {
        // Sử dụng POST để gửi mảng dữ liệu (Array) qua Body
        return api.post(`${BASE_URL}/check-duplicate-codes`, codes);
    },
    
    updateStatus(data) {
        return axios.put(`${API_BASE_URL}/Employees/status`, data);
    },
    
    exportExcel(params) {
        return axios.get(`${API_BASE_URL}/Employees/export`, {
            params,
            responseType: 'blob' // Bắt buộc giữ nguyên để tải file đúng định dạng
        });
    }
};

export default employeeApi;