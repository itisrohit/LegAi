const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  chatId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Chat', 
    required: true 
  },
  question: { 
    type: String, 
    required: true 
  },
  answer: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

const Message = model('Message', messageSchema);

module.exports = { Message };
