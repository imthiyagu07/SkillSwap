import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/useProfileStore';
import { useReviewStore } from '../store/useReviewStore';
import { useAuthStore } from '../store/useAuthStore';

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { profile, loading, getProfile } = useProfileStore();
    const { reviews, getUserReviews } = useReviewStore();

    useEffect(() => {
        if (userId) {
            getProfile(userId);
            getUserReviews(userId);
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile not found</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:underline"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const isOwnProfile = user?._id === profile._id;

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
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-start gap-6">
                        <img
                            src={profile.profileImage || 'https://avatar.iran.liara.run/public/50'}
                            alt={profile.name}
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
                                    <p className="text-gray-600 mt-1">
                                        {profile.location?.city && profile.location?.country
                                            ? `${profile.location.city}, ${profile.location.country}`
                                            : 'Location not set'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-yellow-500 text-xl">⭐</span>
                                        <span className="text-lg font-semibold">{profile.rating || 0}</span>
                                        <span className="text-gray-500">({profile.reviewCount || 0} reviews)</span>
                                    </div>
                                </div>
                                {isOwnProfile && (
                                    <Link
                                        to="/edit-profile"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Edit Profile
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
                    <p className="text-gray-700">{profile.bio || 'No bio yet'}</p>
                </div>

                {/* Skills Offered */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills Offered</h2>
                    {profile.skillsOffered?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {profile.skillsOffered.map((skill) => (
                                <div key={skill._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                    <h3 className="text-lg font-semibold text-gray-800">{skill.skillName}</h3>
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                                        {skill.category}
                                    </span>
                                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2 ml-2">
                                        {skill.proficiencyLevel}
                                    </span>
                                    {skill.description && (
                                        <p className="text-gray-600 text-sm mt-2">{skill.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No skills offered yet</p>
                    )}
                </div>

                {/* Skills Wanted */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills Wanted</h2>
                    {profile.skillsWanted?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {profile.skillsWanted.map((skill) => (
                                <div key={skill._id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                                    <h3 className="text-lg font-semibold text-gray-800">{skill.skillName}</h3>
                                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mt-2">
                                        {skill.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No skills wanted yet</p>
                    )}
                </div>

                {/* Reviews */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b pb-4 last:border-b-0">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={review.reviewer?.profileImage || 'https://via.placeholder.com/50'}
                                            alt={review.reviewer?.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{review.reviewer?.name}</h4>
                                                    <div className="text-yellow-500">
                                                        {'⭐'.repeat(review.rating)}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mt-2">{review.comment}</p>
                                            {review.skillTaught && (
                                                <p className="text-sm text-gray-500 mt-1">Skill: {review.skillTaught}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No reviews yet</p>
                    )}
                </div>

                {/* Message Button */}
                {!isOwnProfile && (
                    <div className="mt-6">
                        <Link
                            to={`/messages/${userId}`}
                            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                            Send Message
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;