// models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat', // Relational link to the Chat model
    required: true,
    index: true, // Indexing makes loading specific chat history fast
  },
  role: {
    type: String,
    enum: ['user', 'system', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);