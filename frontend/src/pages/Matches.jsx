import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMatchStore } from '../store/useMatchStore';

const Matches = () => {
    const { matches, loading, getMatches } = useMatchStore();

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        await getMatches();
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
                    <h1 className="text-3xl font-bold text-gray-800">Your Matches</h1>
                    <p className="text-gray-600 mt-2">
                        Users ranked by skill compatibility based on what you offer and want to learn
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : matches.length > 0 ? (
                    <div className="space-y-4">
                        {matches.map((match, index) => (
                            <div
                                key={match.user._id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                            >
                                <div className="flex items-start gap-6">
                                    {/* Rank Badge */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                    index === 2 ? 'bg-orange-600' :
                                                        'bg-blue-500'
                                            }`}>
                                            #{index + 1}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={match.user.profileImage || 'https://via.placeholder.com/80'}
                                                    alt={match.user.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-800">{match.user.name}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {match.user.location?.city && match.user.location?.country
                                                            ? `${match.user.location.city}, ${match.user.location.country}`
                                                            : 'Location not set'}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <span className="text-yellow-500">⭐</span>
                                                        <span className="text-sm font-semibold">{match.user.rating || 0}</span>
                                                        <span className="text-sm text-gray-500">({match.user.reviewCount || 0})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Match Score */}
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-green-600">{match.matchScore}</div>
                                                <div className="text-sm text-gray-500">Compatibility</div>
                                            </div>
                                        </div>

                                        {/* Match Details */}
                                        {match.matches && match.matches.length > 0 && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                                <h4 className="text-sm font-semibold text-green-800 mb-2">
                                                    🎯 Skill Matches ({match.matches.length})
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {match.matches.map((skillMatch, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-white border border-green-300 rounded px-3 py-1"
                                                        >
                                                            <span className="text-sm font-medium text-gray-800">
                                                                {skillMatch.skill}
                                                            </span>
                                                            <span className="text-xs text-gray-500 ml-2">
                                                                ({skillMatch.type === 'wanted-offered' ? 'You want, they offer' : 'You offer, they want'})
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Skills Preview */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {match.user.skillsOffered?.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">They Offer:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {match.user.skillsOffered.slice(0, 3).map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                                            >
                                                                {skill.skillName}
                                                            </span>
                                                        ))}
                                                        {match.user.skillsOffered.length > 3 && (
                                                            <span className="text-xs text-gray-500">
                                                                +{match.user.skillsOffered.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {match.user.skillsWanted?.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">They Want:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {match.user.skillsWanted.slice(0, 3).map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                                                            >
                                                                {skill.skillName}
                                                            </span>
                                                        ))}
                                                        {match.user.skillsWanted.length > 3 && (
                                                            <span className="text-xs text-gray-500">
                                                                +{match.user.skillsWanted.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/profile/${match.user._id}`}
                                                className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                            >
                                                View Profile
                                            </Link>
                                            <Link
                                                to={`/messages/${match.user._id}`}
                                                className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                            >
                                                Send Message
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg mb-4">No matches found yet</p>
                        <p className="text-gray-400 mb-6">
                            Add skills you offer and want to learn to find compatible users!
                        </p>
                        <Link
                            to="/edit-profile"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Update Your Skills
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Matches;