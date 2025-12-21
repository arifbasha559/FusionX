import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  _id: { type: String }, // Custom ID from frontend
  userId: { type: String, required: true, index: true },
  title: { type: String, default: 'New Chat' },
  model: { type: String, default: 'deepseek' },
  
  // 👇 EMBED MESSAGES DIRECTLY HERE
  messages: [{
    role: { type: String, required: true },
    content: { type: String, required: true },
    model: { type: String }, // Optional: track which model generated this specific message
    mode: { type: String }   // Optional: track mode (text/code)
  }]
  
}, { timestamps: true, _id: false });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);