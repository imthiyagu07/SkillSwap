import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMatchStore } from '../store/useMatchStore';

const skillCategories = [
    'Programming & Development',
    'Design & Creative',
    'Business & Marketing',
    'Music & Arts',
    'Languages',
    'Cooking & Culinary',
    'Sports & Fitness',
    'Photography & Video',
    'Writing & Content',
    'Teaching & Education',
    'Crafts & DIY',
    'Other'
];

const Discover = () => {
    const { searchResults, loading, searchUsers } = useMatchStore();
    const [filters, setFilters] = useState({
        skill: '',
        category: '',
        location: ''
    });

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        await searchUsers(filters);
    };

    const handleReset = () => {
        setFilters({ skill: '', category: '', location: '' });
        searchUsers({ skill: '', category: '', location: '' });
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
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Discover Skills</h1>

                {/* Search Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by skill..."
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.skill}
                            onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                        />

                        <select
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">All Categories</option>
                            {skillCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Location..."
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={handleSearch}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map((user) => (
                            <div key={user._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={user.profileImage || 'https://avatar.iran.liara.run/public/28'}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {user.location?.city && user.location?.country
                                                ? `${user.location.city}, ${user.location.country}`
                                                : 'Location not set'}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-yellow-500">⭐</span>
                                            <span className="text-sm font-semibold">{user.rating || 0}</span>
                                            <span className="text-sm text-gray-500">({user.reviewCount || 0})</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills Offered */}
                                {user.skillsOffered?.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills Offered:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user.skillsOffered.slice(0, 3).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                                >
                                                    {skill.skillName}
                                                </span>
                                            ))}
                                            {user.skillsOffered.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{user.skillsOffered.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Skills Wanted */}
                                {user.skillsWanted?.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills Wanted:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user.skillsWanted.slice(0, 3).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                                                >
                                                    {skill.skillName}
                                                </span>
                                            ))}
                                            {user.skillsWanted.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{user.skillsWanted.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Link
                                    to={`/profile/${user._id}`}
                                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    View Profile
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No users found. Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Discover;