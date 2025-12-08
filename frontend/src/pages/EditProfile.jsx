import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';

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

const EditProfile = () => {
    const { user, checkAuth } = useAuthStore();
    const { updateProfile, addSkillOffered, addSkillWanted, removeSkillOffered } = useProfileStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        location: { city: '', country: '' },
        timezone: ''
    });

    const [newSkillOffered, setNewSkillOffered] = useState({
        skillName: '',
        category: '',
        proficiencyLevel: 'Intermediate',
        description: ''
    });

    const [newSkillWanted, setNewSkillWanted] = useState({
        skillName: '',
        category: ''
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                location: user.location || { city: '', country: '' },
                timezone: user.timezone || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const result = await updateProfile(formData);
        if (result.success) {
            setMessage('Profile updated successfully!');
            await checkAuth(); // Refresh user data
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage(result.message || 'Failed to update profile');
        }
    };

    const handleAddSkillOffered = async (e) => {
        e.preventDefault();
        if (!newSkillOffered.skillName || !newSkillOffered.category) {
            setMessage('Please fill in skill name and category');
            return;
        }

        const result = await addSkillOffered(newSkillOffered);
        if (result.success) {
            setMessage('Skill added successfully!');
            setNewSkillOffered({
                skillName: '',
                category: '',
                proficiencyLevel: 'Intermediate',
                description: ''
            });
            await checkAuth();
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage(result.message || 'Failed to add skill');
        }
    };

    const handleAddSkillWanted = async (e) => {
        e.preventDefault();
        if (!newSkillWanted.skillName || !newSkillWanted.category) {
            setMessage('Please fill in skill name and category');
            return;
        }

        const result = await addSkillWanted(newSkillWanted);
        if (result.success) {
            setMessage('Skill wanted added successfully!');
            setNewSkillWanted({ skillName: '', category: '' });
            await checkAuth();
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage(result.message || 'Failed to add skill');
        }
    };

    const handleRemoveSkill = async (skillId) => {
        const result = await removeSkillOffered(skillId);
        if (result.success) {
            setMessage('Skill removed successfully!');
            await checkAuth();
            setTimeout(() => setMessage(''), 3000);
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

            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Profile</h1>

                {message && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                        {message}
                    </div>
                )}

                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Information</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                maxLength="500"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                            />
                            <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.location.city}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        location: { ...formData.location, city: e.target.value }
                                    })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.location.country}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        location: { ...formData.location, country: e.target.value }
                                    })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Timezone</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.timezone}
                                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                placeholder="e.g., UTC+5:30, EST, PST"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        >
                            Save Profile
                        </button>
                    </form>
                </div>

                {/* Current Skills Offered */}
                {user?.skillsOffered?.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Skills Offered</h2>
                        <div className="space-y-2">
                            {user.skillsOffered.map((skill) => (
                                <div key={skill._id} className="flex justify-between items-center p-3 border rounded-lg">
                                    <div>
                                        <span className="font-semibold">{skill.skillName}</span>
                                        <span className="text-sm text-gray-600 ml-2">({skill.proficiencyLevel})</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveSkill(skill._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add Skill Offered */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Skill Offered</h2>
                    <form onSubmit={handleAddSkillOffered} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Skill Name *</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newSkillOffered.skillName}
                                onChange={(e) => setNewSkillOffered({ ...newSkillOffered, skillName: e.target.value })}
                                placeholder="e.g., React Development"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category *</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newSkillOffered.category}
                                onChange={(e) => setNewSkillOffered({ ...newSkillOffered, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {skillCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Proficiency Level</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newSkillOffered.proficiencyLevel}
                                onChange={(e) => setNewSkillOffered({ ...newSkillOffered, proficiencyLevel: e.target.value })}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                value={newSkillOffered.description}
                                onChange={(e) => setNewSkillOffered({ ...newSkillOffered, description: e.target.value })}
                                placeholder="Describe your experience with this skill..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                        >
                            Add Skill Offered
                        </button>
                    </form>
                </div>

                {/* Add Skill Wanted */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Skill Wanted</h2>
                    <form onSubmit={handleAddSkillWanted} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Skill Name *</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newSkillWanted.skillName}
                                onChange={(e) => setNewSkillWanted({ ...newSkillWanted, skillName: e.target.value })}
                                placeholder="e.g., Guitar Playing"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category *</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newSkillWanted.category}
                                onChange={(e) => setNewSkillWanted({ ...newSkillWanted, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {skillCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                        >
                            Add Skill Wanted
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;