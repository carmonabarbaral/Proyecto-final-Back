const MessageModel = require('../src/models/message.model');

class MessageManager {
  async getMessages() {
    try {
      const messages = await MessageModel.find();
      return messages;
    } catch (error) {
      throw new Error('Error while fetching messages');
    }
  }

  async getMessageById(id) {
    try {
      const message = await MessageModel.findById(id);
      return message;
    } catch (error) {
      throw new Error('Error while fetching message by ID');
    }
  }

  async createMessage(user, message) {
    try {
      const newMessage = new MessageModel({ user, message });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      throw new Error('Error while creating message');
    }
  }

  async updateMessage(id, user, message) {
    try {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        id,
        { user, message },
        { new: true }
      );
      return updatedMessage;
    } catch (error) {
      throw new Error('Error while updating message');
    }
  }

  async deleteMessage(id) {
    try {
      await MessageModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error while deleting message');
    }
  }
}

module.exports = MessageManager;