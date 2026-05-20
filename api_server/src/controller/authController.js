import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserService } from "../service/userService.js";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../util/validation.js";

const JWT_SECRET = process.env.JWT_SECRET || "metube_secret_key";

// =======================
// REGISTER
// =======================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserService.createUser({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      role: "user",
    });

    return res.status(201).json({
      message: "Register success",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Register failed",
      error: err.message,
    });
  }
};

// =======================
// LOGIN (JWT ONLY)
// =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await UserService.getByEmail(email.toLowerCase());

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("metube_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login success",
      user: payload,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

// =======================
// LOGOUT (JWT ONLY)
// =======================
export const logout = (req, res) => {
  res.clearCookie("metube_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.status(200).json({
    message: "Logout success",
  });
};

// =======================
// GET PROFILE (JWT ONLY)
// =======================
export const getProfile = (req, res) => {
  try {
    const token = req.cookies?.metube_token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    return res.status(200).json({
      user: decoded,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

// =======================
// CHANGE PASSWORD (JWT ONLY)
// =======================
export const changePassword = async (req, res) => {
  try {
    const token = req.cookies?.metube_token; // 👈 FIX

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const { oldPassword, newPassword } = req.body;

    const userData = await UserService.getUserById(decoded.id);

    if (!userData) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValid = await bcrypt.compare(oldPassword, userData.passwordHash);

    if (!isValid) {
      return res.status(401).json({
        message: "Old password incorrect",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await UserService.updatePassword(decoded.id, hashed);

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Change password failed",
      error: err.message,
    });
  }
};
