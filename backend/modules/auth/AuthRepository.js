const { User, RefreshToken } = require('./UserModel');
const jwt = require('jsonwebtoken');


class AuthRepository {
  async addUser(firstName, lastName, email, password, verified = false) {
    try {
      const newUser = await User.create({
        Firstname: firstName,
        Lastname: lastName,
        Email: email,
        Password: password,
        verified,
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ Email: email });
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updatedFields) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async updateVerifToken (userId, token) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, { Token: token }, { new: true });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async markUserAsVerified(userId) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, { Verified: true }, { new: true });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async markUserAsBlacklisted(userId) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, { isBlacklisted: true }, { new: true });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async removeUserFromBlacklist(userId) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, { isBlacklisted: false }, { new: true });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async generateRefreshToken(userId) {
    try {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })
      const newToken = await RefreshToken.create({
        userId,
        token,
      });
      return newToken;
    } catch (error) {
      throw error;
    }
  }

  async replaceToken(userId) {
    try {
      const newToken = await RefreshToken.findOneAndUpdate({ userId }, { token: jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' }) }, { new: true });
      return newToken;
    } catch (error) {
      throw error;
    }
  }

  async getTokenByUserId(userId) {
    try {
      const token = await RefreshToken.findOne({ userId });
      return token;
    } catch (error) {
      throw error;
    }
  }

  async destroyToken(userId) {
    try {
      const deletedToken = await RefreshToken.findOneAndDelete({ userId });
      return deletedToken;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthRepository;