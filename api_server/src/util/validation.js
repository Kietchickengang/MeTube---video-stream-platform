// Validation rules
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;
const USERNAME_MIN_LENGTH = 2;

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email không hợp lệ.' };
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, message: 'Email không đúng định dạng.' };
  }
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Mật khẩu không hợp lệ.' };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, message: `Mật khẩu phải có ít nhất ${PASSWORD_MIN_LENGTH} ký tự.` };
  }
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'Tên không hợp lệ.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < USERNAME_MIN_LENGTH) {
    return { valid: false, message: `Tên phải có ít nhất ${USERNAME_MIN_LENGTH} ký tự.` };
  }
  if (trimmed.length > 100) {
    return { valid: false, message: 'Tên không được vượt quá 100 ký tự.' };
  }
  return { valid: true };
};
