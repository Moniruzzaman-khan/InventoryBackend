const OTPSModel = require('../../models/Users/OTPSModel');
const { HashPassword } = require('../../utility/PasswordUtility');

const OTP_VALID_MINUTES = 10;

const UserResetPassService = async (Request, DataModel) => {
    const email = String(Request.body.email || '').trim().toLowerCase();
    const OTPCode = String(Request.body.OTP || '');
    const NewPass = String(Request.body.password || '');

    if (!email || !OTPCode || !NewPass) {
        return { status: 'fail', data: 'Invalid request' };
    }

    try {
        const expiry = new Date(Date.now() - OTP_VALID_MINUTES * 60 * 1000);
        const otp = await OTPSModel.findOneAndUpdate(
            { email, otp: OTPCode, status: 1, createdDate: { $gte: expiry } },
            { $set: { status: 2 } },
            { new: false }
        );

        if (!otp) {
            return { status: 'fail', data: 'Invalid or expired OTP' };
        }

        const PassUpdate = await DataModel.updateOne(
            { email },
            { $set: { password: HashPassword(NewPass) } }
        );

        return { status: 'success', data: PassUpdate };
    }
    catch (e) {
        return { status: 'fail', data: e.toString() };
    }
};

module.exports = UserResetPassService;
