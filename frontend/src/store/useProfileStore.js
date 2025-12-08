import { create } from 'zustand';
import { api } from '../services/axios';

export const useProfileStore = create((set, get) => ({
    profile: null,
    loading: false,
    error: null,

    getProfile: async (userId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/profile/${userId}`);
            set({ profile: res.data});
            return { success: true, data: res.data };
        } catch (error) {
            set({error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        } finally {
            set({ loading: false });
        }
    },

    updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put('/profile', profileData);
            set({ profile: res.data});
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        } finally {
            set({ loading: false });
        }
    },

    addSkillOffered: async (skill) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/profile/skills/offered', skill);
            const currentProfile = get().profile;
            set({profile: { ...currentProfile, skillsOffered: res.data }});
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        } finally {
            set({ loading: false });
        }
    },

    removeSkillOffered: async (skillId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.delete(`/profile/skills/offered/${skillId}`);
            const currentProfile = get().profile;
            set({profile: { ...currentProfile, skillsOffered: res.data }});
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        } finally {
            set({ loading: false });
        }
    },

    addSkillWanted: async (skill) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/profile/skills/wanted', skill);
            const currentProfile = get().profile;
            set({profile: { ...currentProfile, skillsWanted: res.data }});
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        } finally {
            set({ loading: false });
        }
    },

    updateAvailability: async (availability) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put('/profile/availability', { availability });
            const currentProfile = get().profile;
            set({profile: { ...currentProfile, availability: res.data }});
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        } finally {
            set({ loading: false });
        }
    },

    clearProfile: () => set({ profile: null, error: null })
}));