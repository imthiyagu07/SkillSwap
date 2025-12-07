import User from '../models/User.model.js';
import { calculateMatchScore } from '../utils/matchingAlgorithm.js';

export const getMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const allUsers = await User.find({ _id: { $ne: req.user._id } }).select('-password');

        const matchedUsers = allUsers.map(user => {
            const { score, matches } = calculateMatchScore(currentUser, user);
            return {
                user,
                matchScore: score,
                matches
            };
        }).filter(match => match.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore);

        res.json(matchedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { skill, category, location } = req.query;
        let query = {};

        if (skill) {
            query['skillsOffered.skillName'] = { $regex: skill, $options: 'i' };
        }

        if (category) {
            query['skillsOffered.category'] = category;
        }

        if (location) {
            query['location.city'] = { $regex: location, $options: 'i' };
        }

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};