import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from '../service/userService.js';
import { validateEmail, validatePassword, validateName } from '../util/validation.js';

const JWT_SECRET = process.env.JWT_SECRET || 'metube_secret_key';
const COOKIE_NAME = 'metube_token';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({ message: nameValidation.message });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ message: emailValidation.message });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const existingUser = await UserService.getByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: 'Email đã được dùng. Vui lòng sử dụng email khác.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserService.createUser({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      role: 'user',
    });

    return res.status(201).json({ message: 'Tạo tài khoản thành công.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ khi tạo tài khoản.', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });
    }

    const user = await UserService.getByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    req.session.user = payload;

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
    });

    return res.status(200).json({ message: 'Đăng nhập thành công.', user: payload });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ khi đăng nhập.', error: err.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie(COOKIE_NAME);
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Không thể đăng xuất.' });
    }

    return res.status(200).json({ message: 'Đăng xuất thành công.' });
  });
};

export const getProfile = (req, res) => {
  const user = req.session?.user;
  if (!user) {
    return res.status(401).json({ message: 'Chưa đăng nhập.' });
  }

  return res.status(200).json({ user });
};

export const changePassword = async (req, res) => {
  try {
    const user = req.session?.user;
    if (!user) {
      return res.status(401).json({ message: 'Chưa đăng nhập.' });
    }

    const { oldPassword, newPassword } = req.body;

    const oldPasswordValidation = validatePassword(oldPassword);
    if (!oldPasswordValidation.valid) {
      return res.status(400).json({ message: oldPasswordValidation.message });
    }

    const newPasswordValidation = validatePassword(newPassword);
    if (!newPasswordValidation.valid) {
      return res.status(400).json({ message: newPasswordValidation.message });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: 'Mật khẩu mới không được giống mật khẩu cũ.' });
    }

    const userData = await UserService.getUserById(user.id);
    if (!userData) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    const passwordIsValid = await bcrypt.compare(oldPassword, userData.passwordHash);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Mật khẩu cũ không đúng.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserService.updatePassword(user.id, hashedPassword);

    return res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ khi đổi mật khẩu.', error: err.message });
  }
};
