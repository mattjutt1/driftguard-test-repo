/**
 * NEW FEATURE: User Authentication
 * This should trigger DriftGuard security analysis
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserAuth {
  constructor() {
    this.users = new Map();
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret'; // DriftGuard should flag weak default
  }

  async registerUser(username, password) {
    if (!username || !password) {
      throw new Error('Username and password required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    this.users.set(username, {
      username,
      password: hashedPassword,
      createdAt: new Date()
    });

    return { success: true, message: 'User registered successfully' };
  }

  async loginUser(username, password) {
    const user = this.users.get(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { username: user.username },
      this.jwtSecret,
      { expiresIn: '1h' }
    );

    return { token, user: { username: user.username } };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = UserAuth;