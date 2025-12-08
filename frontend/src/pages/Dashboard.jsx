import { useAuthStore } from '../store/useAuthStore';

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
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <p className="text-gray-600">
                        Welcome to your dashboard! Here you will be able to manage your profile,
                        skills, and sessions.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;