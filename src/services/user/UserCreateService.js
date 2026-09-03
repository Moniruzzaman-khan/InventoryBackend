const { HashPassword } = require('../../utility/PasswordUtility');

const UserCreateService = async (Request, DataModel) => {
    try {
        const PostBody = { ...Request.body };
        PostBody.email = String(PostBody.email || '').trim().toLowerCase();

        if (!PostBody.email || !PostBody.password) {
            return { status: 'fail', data: 'Email and password are required' };
        }

        PostBody.password = HashPassword(PostBody.password);
        const data = await DataModel.create(PostBody);
        return { status: 'success', data };
    }
    catch (e) {
        return { status: 'fail', data: e.toString(), keyPattern: e.keyPattern };
    }
};

module.exports = UserCreateService;
