import Session from '../models/Session.model.js';

export const createSession = async (req, res) => {
    try {
        const session = await Session.create({
            requester: req.user._id,
            recipient: req.body.recipient,
            skill: req.body.skill,
            description: req.body.description,
            scheduledDate: req.body.scheduledDate,
            duration: req.body.duration
        });

        const populatedSession = await Session.findById(session._id)
            .populate('requester', 'name email profileImage')
            .populate('recipient', 'name email profileImage');

        res.status(201).json(populatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            $or: [{ requester: req.user._id }, { recipient: req.user._id }]
        })
            .populate('requester', 'name email profileImage')
            .populate('recipient', 'name email profileImage')
            .sort({ scheduledDate: 1 });

        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (req.body.status === 'accepted' || req.body.status === 'rejected') {
            if (session.recipient.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }
        }

        session.status = req.body.status || session.status;
        session.meetingLink = req.body.meetingLink || session.meetingLink;
        session.notes = req.body.notes || session.notes;

        const updatedSession = await session.save();
        res.json(updatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.requester.toString() !== req.user._id.toString() &&
            session.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await session.deleteOne();
        res.json({ message: 'Session deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};