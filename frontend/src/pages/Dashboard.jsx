import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">SkillSwap</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user?.name}</span>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <p className="text-gray-600 mb-6">
                        Welcome to your dashboard! Here you can manage your profile, skills, and sessions.
                    </p>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link
                            to={`/profile/${user?._id}`}
                            className="block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                        >
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">👤 View My Profile</h3>
                            <p className="text-sm text-gray-600">See how others view your profile</p>
                        </Link>

                        <Link
                            to="/edit-profile"
                            className="block p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
                        >
                            <h3 className="text-lg font-semibold text-green-800 mb-2">✏️ Edit Profile</h3>
                            <p className="text-sm text-gray-600">Update your info and manage skills</p>
                        </Link>

                        <Link
                            to="/discover"
                            className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition"
                        >
                            <h3 className="text-lg font-semibold text-purple-800 mb-2">🔍 Discover Skills</h3>
                            <p className="text-sm text-gray-600">Find people to learn from</p>
                        </Link>

                        <Link
                            to="/matches"
                            className="block p-6 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition"
                        >
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">🎯 My Matches</h3>
                            <p className="text-sm text-gray-600">See your skill compatibility matches</p>
                        </Link>

                        <Link
                            to="/sessions"
                            className="block p-6 bg-pink-50 border border-pink-200 rounded-lg hover:bg-pink-100 transition"
                        >
                            <h3 className="text-lg font-semibold text-pink-800 mb-2">📅 Sessions</h3>
                            <p className="text-sm text-gray-600">Manage your learning sessions</p>
                        </Link>

                        <Link
                            to="/messages"
                            className="block p-6 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
                        >
                            <h3 className="text-lg font-semibold text-indigo-800 mb-2">💬 Messages</h3>
                            <p className="text-sm text-gray-600">Chat with other users</p>
                        </Link>
                    </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills Offered</h3>
                        <p className="text-3xl font-bold text-blue-600">{user?.skillsOffered?.length || 0}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills Wanted</h3>
                        <p className="text-3xl font-bold text-purple-600">{user?.skillsWanted?.length || 0}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Rating</h3>
                        <p className="text-3xl font-bold text-yellow-600">
                            ⭐ {user?.rating || 0} ({user?.reviewCount || 0})
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;