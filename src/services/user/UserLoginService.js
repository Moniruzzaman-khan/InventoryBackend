const { HashPassword, VerifyPassword } = require('../../utility/PasswordUtility');
const CreateToken = require('../../utility/CreateToken');

const UserLoginService = async (Request, DataModel) => {
    try {
        const email = String(Request.body.email || '').trim().toLowerCase();
        const password = String(Request.body.password || '');

        if (!email || !password) {
            return { status: 'Unauthorized' };
        }

        const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const user = await DataModel.findOne({ email: { $regex: `^${escapedEmail}$`, $options: 'i' } });
        if (!user || !VerifyPassword(password, user.password)) {
            return { status: 'Unauthorized' };
        }

        // Upgrade old plaintext passwords after a successful login.
        if (!user.password.startsWith('pbkdf2$')) {
            user.password = HashPassword(password);
            await user.save();
        }

        const token = await CreateToken(user.email);
        const data = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile,
            photo: user.photo
        };

        return { status: 'success', token, data };
    }
    catch (e) {
        return { status: 'fail', data: e.toString() };
    }
};

module.exports = UserLoginService;
