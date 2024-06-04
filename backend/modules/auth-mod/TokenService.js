const jwt = require('jsonwebtoken');
const AuthRepository = require('./AuthRepository'); // Assuming you have a AuthRepository to interact with users

class AccessTokenService {
  constructor(expiresIn) {
    this.secret = process.env.JWT_SECRET || 'default_secret';
    this.expiresIn = expiresIn || '1d';
    this.authRepository = new AuthRepository(); // Initialize AuthRepository
  }

  async generate(userId) {
    try {
      const user = await this.authRepository.getUserById(userId);

      if (user) {
        const { password, ...userWithoutPassword } = user.toObject();

        const accessToken = jwt.sign({ user: userWithoutPassword }, this.secret, {
          expiresIn: this.expiresIn,
        });

        return accessToken;
      }

      return null;
    } catch (error) {
      console.error('Error generating access token:', error);
      return null;
    }
  }

  async generateForVerification(userId) {
    try {
      const user = await this.authRepository.getUserById(userId);
      console.log('user:', user);

      if (user) {
        const { password, ...userWithoutPassword } = user;
        console.log(this.secret)
        const accessToken = jwt.sign({ user: userWithoutPassword }, this.secret, {
          expiresIn: '2m',
        });
        console.log('accessToken:', accessToken);

        return accessToken;
      }

      return null;
    } catch (error) {
      console.log('error:', error);
      return null;
    }
  }

  async verify(token) {
    try {
      const decoded = jwt.verify(token, this.secret);
      console.log(this.secret, decoded)
      return decoded;
    } catch (error) {
      console.error('Error verifying access token:', error);
      return null;
    }
  }
}

module.exports = AccessTokenService;
