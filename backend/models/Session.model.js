import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  requester: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  skill: {type: String, required: true},
  description: String,
  scheduledDate: {type: Date, required: true},
  duration: {type: Number, default: 60},
  status: {type: String, enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'], default: 'pending'},
  meetingLink: String,
  notes: String
}, {timestamps: true});

const Session = mongoose.model('Session', sessionSchema);

export default Session;