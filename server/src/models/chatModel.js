const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: false //Change it later
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Chat = model('Chat', chatSchema);

module.exports = { Chat };
