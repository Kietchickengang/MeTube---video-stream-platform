import { createTimestamps } from '../util/helper.js';
import { UserModel } from '../model/userModel.js';

export const UserService = {
  async createUser(data) {
    return UserModel.create(createTimestamps(data));
  },

  async getByEmail(email) {
    return UserModel.findByEmail(email);
  },

  async getUserById(id) {
    return UserModel.findById(id);
  },

  async updatePassword(id, hashedPassword) {
    return UserModel.updatePasswordById(id, hashedPassword);
  },
};
