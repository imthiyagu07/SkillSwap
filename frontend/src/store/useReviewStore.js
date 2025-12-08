import { create } from 'zustand';
import { api } from '../services/axios';

export const useReviewStore = create((set) => ({
    reviews: [],
    loading: false,
    error: null,

    getUserReviews: async (userId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/reviews/user/${userId}`);
            set({ reviews: res.data});
            return { success: true };
        } catch (error) {
            set({error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        } finally {
            set({ loading: false });
        }
    },

    createReview: async (reviewData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/reviews', reviewData);
            set((state) => ({ reviews: [res.data, ...state.reviews] }));
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        } finally {
            set({ loading: false });
        }
    }
}));