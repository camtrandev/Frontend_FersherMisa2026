import { defineStore } from 'pinia';
import employeeApi from '../services/employeeApi';

export const useEmployeeStore = defineStore('employee', {
    state: () => ({
        employees: [],
        departments: [],
        totalRecords: 0,
        currentEmployee: null,
        newEmployeeCode: '',
        isLoading: false,
        error: null,
    }),

    getters: {
        getEmployees: (state) => state.employees,
        getTotalRecords: (state) => state.totalRecords,
        getLoadingStatus: (state) => state.isLoading,
    },

    actions: {
        // ====================================================
        // 1. LẤY DỮ LIỆU & PHÂN TRANG
        // ====================================================
        async fetchEmployeesPaging(params) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await employeeApi.getEmployeesPaging(params);

                console.log('--- LOG TỪ STORE ---');
                console.log('1. Toàn bộ Response API:', response);
                console.log('2. Dữ liệu thực tế (response.data):', response.data);

                // --- ĐÃ SỬA TẠI ĐÂY ---
                // Sử dụng .data (viết thường) để lấy mảng nhân viên 
                // và .totalRecords (viết thường) để lấy tổng số bản ghi
                this.employees = response.data.data || [];
                this.totalRecords = response.data.totalRecords || 0;
                // ----------------------

                console.log('3. State "employees" sau khi gán:', this.employees);
                console.log('--------------------');

                return response.data;
            } catch (error) {
                this.error = error.response?.data || error.message;
                console.error('Lỗi khi lấy danh sách nhân viên:', error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchAllDepartments() {
            try {
                const response = await employeeApi.getDepartments();
                // Gán dữ liệu trả về vào state
                this.departments = response.data; 
                return response.data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách phòng ban:', error);
                throw error;
            }
        },

        async fetchEmployeeById(id) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await employeeApi.getEmployeeById(id);

                // Nếu API trả về trực tiếp object nhân viên
                this.currentEmployee = response.data;
                return this.currentEmployee;
            } catch (error) {
                this.error = error.response?.data || error.message;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async checkDuplicateCodesList(codes) {
            try {
                // Gọi sang file employeeApi.js
                const response = await employeeApi.checkDuplicateCodesList(codes);
                
                // Trả về dữ liệu (mảng các Object chứa employeeCode và isValid)
                return response.data; 
            } catch (error) {
                console.error('Lỗi khi kiểm tra mã nhân viên hàng loạt:', error);
                throw error;
            }
        },

        // ====================================================
        // 2. THÊM, SỬA, XÓA (CRUD)
        // ====================================================
        async createNewEmployee(data) {
            this.isLoading = true;
            try {
                const response = await employeeApi.createEmployee(data);
                return response.data;
            } catch (error) {
                this.error = error.response?.data || error.message;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async updateEmployeeInfo(id, data) {
            this.isLoading = true;
            try {
                const response = await employeeApi.updateEmployee(id, data);
                return response.data;
            } catch (error) {
                this.error = error.response?.data || error.message;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async removeEmployee(id) {
            this.isLoading = true;
            try {
                const response = await employeeApi.deleteEmployee(id);
                return response.data;
            } catch (error) {
                this.error = error.response?.data || error.message;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async removeMultipleEmployees(employeeIds) {
            this.isLoading = true;
            try {
                const response = await employeeApi.deleteMultipleEmployees(employeeIds);
                return response.data;
            } catch (error) {
                this.error = error.response?.data || error.message;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        // ====================================================
        // 3. CÁC NGHIỆP VỤ BỔ TRỢ & EXPORT
        // ====================================================
        async fetchNewCode() {
            try {
                const response = await employeeApi.getNewCode();
                // Giả định API trả về chuỗi mã mới trực tiếp
                this.newEmployeeCode = response.data;
                return this.newEmployeeCode;
            } catch (error) {
                console.error('Lỗi khi lấy mã nhân viên mới:', error);
                throw error;
            }
        },

        async checkCodeDuplicate(employeeCode) {
            try {
                const response = await employeeApi.checkDuplicateCode(employeeCode);
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        async changeEmployeeStatus(data) {
            this.isLoading = true;
            try {
                const response = await employeeApi.updateStatus(data);
                return response.data;
            } catch (error) {
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async exportEmployeesToExcel(params) {
            this.isLoading = true;
            try {
                const response = await employeeApi.exportExcel(params);

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Danh_sach_nhan_vien.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                return true;
            } catch (error) {
                console.error('Lỗi khi xuất file Excel:', error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        }
    }
});