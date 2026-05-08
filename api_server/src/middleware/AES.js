import CryptoJS from 'crypto-js';

// Generate Key (32) & IV (16) from SECRET_KEY
const getParsers = (SECRET_KEY) => {
    const key = CryptoJS.enc.Utf8.parse(CryptoJS.SHA256(SECRET_KEY).toString().substring(0, 32));
    const iv = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(SECRET_KEY).toString().substring(0, 16));
    return { key, iv };
};

// Encryption
export const encrypting = (SECRET_KEY, data) => {
    if (!data || !SECRET_KEY) return "";
    
    const { key, iv } = getParsers(SECRET_KEY);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

// Decryption
export const decrypting = (SECRET_KEY, data) => {
    if (!data || !SECRET_KEY) return "";

    try {
        const { key, iv } = getParsers(SECRET_KEY);
        const ciphertext = CryptoJS.enc.Hex.parse(data);

        const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const result = decrypted.toString(CryptoJS.enc.Utf8);
        if (!result) throw new Error();
        return result;
    } catch (err) {
        console.error("Decrypt failed: ", err);
        return "Malformed data due to failed decryption";
    }
}