import { create } from 'zustand';
import { api } from '../services/axios';

export const useSessionStore = create((set) => ({
    sessions: [],
    loading: false,
    error: null,

    // Get all sessions (sent and received)
    getSessions: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get('/session');
            set({ sessions: res.data, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        }
    },

    // Create a new session request
    createSession: async (sessionData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/session', sessionData);
            set((state) => ({
                sessions: [res.data, ...state.sessions],
                loading: false
            }));
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        }
    },

    // Update session status (accept, reject, complete, cancel)
    updateSession: async (sessionId, updateData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/session/${sessionId}`, updateData);
            set((state) => ({
                sessions: state.sessions.map(session =>
                    session._id === sessionId ? res.data : session
                ),
                loading: false
            }));
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        }
    },

    // Delete a session
    deleteSession: async (sessionId) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/session/${sessionId}`);
            set((state) => ({
                sessions: state.sessions.filter(session => session._id !== sessionId),
                loading: false
            }));
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        }
    }
}));