import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSessionStore } from '../store/useSessionStore';
import { useAuthStore } from '../store/useAuthStore';
import ReviewModal from '../components/ReviewModal';

const Sessions = () => {
    const { user } = useAuthStore();
    const { sessions, loading, getSessions, updateSession, deleteSession } = useSessionStore();
    const [filter, setFilter] = useState('all'); // all, pending, accepted, completed
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        loadSessions();
    }, []);

    const handleReview = (session) => {
        setSelectedSession(session);
        setShowReviewModal(true);
    };

    const loadSessions = async () => {
        await getSessions();
    };

    const handleAccept = async (sessionId) => {
        const result = await updateSession(sessionId, { status: 'accepted' });
        if (result.success) {
            await loadSessions();
        }
    };

    const handleReject = async (sessionId) => {
        const result = await updateSession(sessionId, { status: 'rejected' });
        if (result.success) {
            await loadSessions();
        }
    };

    const handleComplete = async (sessionId) => {
        const result = await updateSession(sessionId, { status: 'completed' });
        if (result.success) {
            await loadSessions();
        }
    };

    const handleCancel = async (sessionId) => {
        if (window.confirm('Are you sure you want to cancel this session?')) {
            const result = await updateSession(sessionId, { status: 'cancelled' });
            if (result.success) {
                await loadSessions();
            }
        }
    };

    const handleDelete = async (sessionId) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            const result = await deleteSession(sessionId);
            if (result.success) {
                await loadSessions();
            }
        }
    };

    const filteredSessions = sessions.filter(session => {
        if (filter === 'all') return true;
        return session.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white shadow-sm p-4 mb-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">SkillSwap</h1>
                    <Link to="/dashboard" className="text-blue-600 hover:underline">
                        Back to Dashboard
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">My Sessions</h1>
                    <p className="text-gray-600 mt-2">Manage your skill exchange sessions</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-3 font-medium ${filter === 'all'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            All Sessions
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-6 py-3 font-medium ${filter === 'pending'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('accepted')}
                            className={`px-6 py-3 font-medium ${filter === 'accepted'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Accepted
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-6 py-3 font-medium ${filter === 'completed'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {/* Sessions List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredSessions.length > 0 ? (
                    <div className="space-y-4">
                        {filteredSessions.map((session) => {
                            const isRequester = session.requester._id === user?._id;
                            const otherUser = isRequester ? session.recipient : session.requester;

                            return (
                                <div key={session._id} className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={otherUser.profileImage || 'https://avatar.iran.liara.run/public/28'}
                                                alt={otherUser.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {isRequester ? 'Session with' : 'Session from'} {otherUser.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">Skill: {session.skill}</p>
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getStatusColor(session.status)}`}>
                                                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">📅 Scheduled Date</p>
                                            <p className="font-medium">
                                                {new Date(session.scheduledDate).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(session.scheduledDate).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">⏱️ Duration</p>
                                            <p className="font-medium">{session.duration} minutes</p>
                                        </div>
                                    </div>

                                    {session.description && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600">Description</p>
                                            <p className="text-gray-800">{session.description}</p>
                                        </div>
                                    )}

                                    {session.meetingLink && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600">Meeting Link</p>
                                            <a
                                                href={session.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {session.meetingLink}
                                            </a>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 flex-wrap">
                                        {!isRequester && session.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAccept(session._id)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleReject(session._id)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                        {session.status === 'accepted' && (
                                            <>
                                                <button
                                                    onClick={() => handleComplete(session._id)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                                >
                                                    Mark as Completed
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(session._id)}
                                                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}

                                        {session.status === 'completed' && (
                                            <button
                                                onClick={() => handleReview(session)}
                                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                                            >
                                                Leave Review
                                            </button>
                                        )}

                                        {(session.status === 'rejected' || session.status === 'cancelled') && (
                                            <button
                                                onClick={() => handleDelete(session._id)}
                                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                                            >
                                                Delete
                                            </button>
                                        )}

                                        <Link
                                            to={`/profile/${otherUser._id}`}
                                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg mb-4">No sessions found</p>
                        <p className="text-gray-400 mb-6">Start discovering skills and request sessions!</p>
                        <Link
                            to="/discover"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Discover Skills
                        </Link>
                    </div>
                )}
            </div>

            {showReviewModal && selectedSession && (
                <ReviewModal
                    session={selectedSession}
                    onClose={() => {
                        setShowReviewModal(false);
                        setSelectedSession(null);
                    }}
                    onSuccess={() => {
                        loadSessions();
                    }}
                />
            )}
        </div>
    );
};

export default Sessions;