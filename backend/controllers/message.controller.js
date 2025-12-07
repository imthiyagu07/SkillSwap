import Message from '../models/Message.model.js';
import Conversation from '../models/Conversation.model.js';

export const getOrCreateConversation = async (req, res) => {
    try {
        const { participantId } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, participantId] }
        }).populate('participants', 'name email profileImage')
            .populate('lastMessage');

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user._id, participantId]
            });
            conversation = await conversation.populate('participants', 'name email profileImage');
        }

        res.json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id
        })
            .populate('participants', 'name email profileImage')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user._id,
            content
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            updatedAt: Date.now()
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name email profileImage');

        const io = req.app.get('io');
        io.to(conversationId).emit('receive-message', populatedMessage);

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversation: req.params.conversationId
        })
            .populate('sender', 'name email profileImage')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        await Message.updateMany(
            {
                conversation: req.params.conversationId,
                sender: { $ne: req.user._id },
                read: false
            },
            { read: true }
        );

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};