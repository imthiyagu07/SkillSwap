import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMessageStore } from '../store/useMessageStore';
import { useAuthStore } from '../store/useAuthStore';

const Messages = () => {
    const { userId } = useParams();
    const { user } = useAuthStore();
    const {
        conversations,
        currentConversation,
        messages,
        loading,
        connectSocket,
        disconnectSocket,
        getConversations,
        getOrCreateConversation,
        getMessages,
        sendMessage,
        clearCurrentConversation
    } = useMessageStore();

    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        connectSocket(user?._id);
        loadConversations();

        return () => {
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        if (userId) {
            loadConversation(userId);
        }
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadConversations = async () => {
        await getConversations();
    };

    const loadConversation = async (participantId) => {
        const result = await getOrCreateConversation(participantId);
        if (result.success && result.conversation) {
            await getMessages(result.conversation._id);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentConversation) return;

        const result = await sendMessage(currentConversation._id, newMessage);
        if (result.success) {
            setNewMessage('');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getOtherParticipant = (conversation) => {
        return conversation.participants.find(p => p._id !== user?._id);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white shadow-sm p-4 mb-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">SkillSwap Messages</h1>
                    <Link to="/dashboard" className="text-blue-600 hover:underline">
                        Back to Dashboard
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 pb-8">
                <div className="bg-white rounded-lg shadow h-[calc(100vh-200px)] flex">
                    {/* Conversations List */}
                    <div className="w-1/3 border-r">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold">Conversations</h2>
                        </div>
                        <div className="overflow-y-auto h-[calc(100%-60px)]">
                            {conversations.length > 0 ? (
                                conversations.map((conv) => {
                                    const otherUser = getOtherParticipant(conv);
                                    return (
                                        <button
                                            key={conv._id}
                                            onClick={() => {
                                                clearCurrentConversation();
                                                loadConversation(otherUser._id);
                                            }}
                                            className={`w-full p-4 border-b hover:bg-gray-50 text-left ${currentConversation?._id === conv._id ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={otherUser.profileImage || 'https://avatar.iran.liara.run/public/28'}
                                                    alt={otherUser.name}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold truncate">{otherUser.name}</p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {conv.lastMessage?.content || 'No messages yet'}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    <p>No conversations yet</p>
                                    <p className="text-sm mt-2">Start chatting with someone!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {currentConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b flex items-center gap-3">
                                    {(() => {
                                        const otherUser = getOtherParticipant(currentConversation);
                                        return (
                                            <>
                                                <img
                                                    src={otherUser.profileImage || 'https://avatar.iran.liara.run/public/28'}
                                                    alt={otherUser.name}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div>
                                                    <h3 className="font-semibold">{otherUser.name}</h3>
                                                    <Link
                                                        to={`/profile/${otherUser._id}`}
                                                        className="text-sm text-blue-600 hover:underline"
                                                    >
                                                        View Profile
                                                    </Link>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((message) => {
                                        const isOwn = message.sender._id === user?._id;
                                        return (
                                            <div
                                                key={message._id}
                                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${isOwn
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-200 text-gray-800'
                                                        }`}
                                                >
                                                    <p>{message.content}</p>
                                                    <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                                        {new Date(message.createdAt).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                <p>Select a conversation to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;