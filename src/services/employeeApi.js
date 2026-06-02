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
        return axios.get(`${API_BASE_URL}/Employees/check-duplicate-code`, {
            params: { employeeCode }
        });
    },

    
    checkDuplicateCodesList(codes) {
        return axios.post(`${API_BASE_URL}/Employees/check-duplicate-codes`, JSON.stringify(codes), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
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