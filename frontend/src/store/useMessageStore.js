import { create } from 'zustand';
import { api } from '../services/axios';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

export const useMessageStore = create((set, get) => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    socket: null,
    loading: false,
    error: null,

    // Initialize Socket.io connection
    connectSocket: (userId) => {
        const socket = io(SOCKET_URL, {
            withCredentials: true
        });

        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('receive-message', (message) => {
            set((state) => ({
                messages: [...state.messages, message]
            }));
        });

        set({ socket });
    },

    // Disconnect socket
    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },

    // Get all conversations
    getConversations: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get('/messages/conversations');
            set({ conversations: res.data, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message });
            return { success: false };
        }
    },

    // Get or create conversation
    getOrCreateConversation: async (participantId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/messages/conversation', { participantId });
            set({ currentConversation: res.data, loading: false });

            // Join socket room for this conversation
            const { socket } = get();
            if (socket) {
                socket.emit('join-conversation', res.data._id);
            }

            return { success: true, conversation: res.data };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message });
            return { success: false };
        }
    },

    // Get messages for a conversation
    getMessages: async (conversationId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/messages/${conversationId}`);
            set({ messages: res.data, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message });
            return { success: false };
        }
    },

    // Send message
    sendMessage: async (conversationId, content) => {
        set({ error: null });
        try {
            const res = await api.post('/messages', { conversationId, content });

            // Emit socket event
            const { socket } = get();
            if (socket) {
                socket.emit('send-message', res.data);
            }

            set((state) => ({
                messages: [...state.messages, res.data]
            }));

            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message });
            return { success: false, message: error.response?.data?.message };
        }
    },

    // Mark messages as read
    markAsRead: async (conversationId) => {
        try {
            await api.put(`/messages/${conversationId}/read`);
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    },

    // Clear current conversation
    clearCurrentConversation: () => {
        set({ currentConversation: null, messages: [] });
    }
}));