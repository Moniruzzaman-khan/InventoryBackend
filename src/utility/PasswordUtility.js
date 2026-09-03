const crypto = require('crypto');

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

const HashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
    return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
};

const VerifyPassword = (password, storedPassword) => {
    if (!password || !storedPassword) return false;

    // Backward compatibility for users created before password hashing was added.
    if (!storedPassword.startsWith('pbkdf2$')) {
        return password === storedPassword;
    }

    const [, iterations, salt, storedHash] = storedPassword.split('$');
    if (!iterations || !salt || !storedHash) return false;

    const hash = crypto.pbkdf2Sync(password, salt, Number(iterations), KEY_LENGTH, DIGEST).toString('hex');
    const a = Buffer.from(hash, 'hex');
    const b = Buffer.from(storedHash, 'hex');

    return a.length === b.length && crypto.timingSafeEqual(a, b);
};

module.exports = { HashPassword, VerifyPassword };
