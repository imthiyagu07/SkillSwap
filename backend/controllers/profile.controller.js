import User from "../models/User.model.js";

export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            user.location = req.body.location || user.location;
            user.timezone = req.body.timezone || user.timezone;
            user.profileImage = req.body.profileImage || user.profileImage;
            const updatedUser = await user.save();
            res.json(updatedUser);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const addSkillOffered = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.skillsOffered.push(req.body);
        await user.save();
        res.json(user.skillsOffered);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const removeSkillOffered = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.skillsOffered = user.skillsOffered.filter(
            skill => skill._id.toString() !== req.params.skillId
        );
        await user.save();
        res.json(user.skillsOffered);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const addSkillWanted = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.skillsWanted.push(req.body);
        await user.save();
        res.json(user.skillsWanted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateAvailability = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.availability = req.body.availability;
        await user.save();
        res.json(user.availability);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};