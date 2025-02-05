const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  chatId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Chat', 
    required: true 
  },
  user: { 
    type: String, 
    required: true 
  },
  bot: { 
    type: String, 
    required: false //change it later 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

const Message = model('Message', messageSchema);

module.exports = { Message };
