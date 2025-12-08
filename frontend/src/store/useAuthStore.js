import {create} from "zustand";
import { api } from "../services/axios.js";

export const useAuthStore = create((set) => ({
    user: null,
    isCheckingAuth: true,
    loading: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await api.get('/auth/me');
            set({user: res.data});
        } catch (error) {
            set({user: null});
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    register: async (data) => {
        set({ loading: true });
        try {
            const res = await api.post('/auth/register', data);
            set({ user: res.data.newUser });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        } finally {
            set({ loading: false });
        }
    },

    login: async (data) => {
        set({ loading: true });
        try {
            const res = await api.post('/auth/login', data);
            set({ user: res.data.newUser });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
            set({ user: null });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    },
}));