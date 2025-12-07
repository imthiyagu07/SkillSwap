import Review from '../models/Review.model.js';
import User from '../models/User.model.js';
import Session from '../models/Session.model.js';

const updateUserRating = async (userId) => {
    const reviews = await Review.find({ reviewee: userId });
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    await User.findByIdAndUpdate(userId, {
        rating: avgRating.toFixed(1),
        reviewCount: reviews.length
    });
};

export const createReview = async (req, res) => {
    try {
        const { reviewee, session, rating, comment, skillTaught } = req.body;

        const sessionDoc = await Session.findById(session);
        if (!sessionDoc || sessionDoc.status !== 'completed') {
            return res.status(400).json({ message: 'Can only review completed sessions' });
        }

        if (sessionDoc.requester.toString() !== req.user._id.toString() &&
            sessionDoc.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const review = await Review.create({
            reviewer: req.user._id,
            reviewee,
            session,
            rating,
            comment,
            skillTaught
        });

        await updateUserRating(reviewee);

        const populatedReview = await Review.findById(review._id)
            .populate('reviewer', 'name profileImage')
            .populate('reviewee', 'name');

        res.status(201).json(populatedReview);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already reviewed this session' });
        }
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name profileImage')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewer: req.user._id })
            .populate('reviewee', 'name profileImage')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};