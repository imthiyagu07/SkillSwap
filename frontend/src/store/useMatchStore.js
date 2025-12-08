import { create } from 'zustand';
import { api } from '../services/axios';

export const useMatchStore = create((set) => ({
    matches: [],
    searchResults: [],
    loading: false,
    error: null,

    getMatches: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get('/match');
            set({ matches: res.data, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        }
    },

    searchUsers: async (filters) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams();
            if (filters.skill) params.append('skill', filters.skill);
            if (filters.category) params.append('category', filters.category);
            if (filters.location) params.append('location', filters.location);

            const res = await api.get(`/match/search?${params.toString()}`);
            set({ searchResults: res.data, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        }
    },

    clearSearch: () => set({ searchResults: [] })
}));