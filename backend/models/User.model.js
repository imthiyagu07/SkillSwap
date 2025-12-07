import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, lowercase: true},
  password: {type: String, required: true, minlength: 6},
  bio: {type: String, maxlength: 500},
  profileImage: {type: String, default: ''},
  skillsOffered: [{
    skillName: String,
    category: String,
    proficiencyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    description: String
  }],
  skillsWanted: [{skillName: String, category: String, desiredLevel: String}],
  availability: [{
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    timeSlots: [{startTime: String, endTime: String}]
  }],
  rating: {type: Number, default: 0},
  reviewCount: {type: Number, default: 0},
  location: {city: String, country: String},
  timezone: String
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;