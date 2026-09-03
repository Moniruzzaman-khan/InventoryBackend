const { HashPassword } = require('../../utility/PasswordUtility');

const UserUpdateService = async (Request, DataModel) => {
    try {
        const UserEmail = Request.headers['email'];
        const PostBody = { ...Request.body };

        // Email is the identity from the JWT and must not be changed here.
        delete PostBody.email;

        // Never store or return a plaintext password.
        if (PostBody.password) {
            PostBody.password = HashPassword(PostBody.password);
        } else {
            delete PostBody.password;
        }

        const data = await DataModel.updateOne({ email: UserEmail }, PostBody);
        return { status: 'success', data };
    }
    catch (e) {
        return { status: 'fail', data: e.toString() };
    }
};

module.exports = UserUpdateService;
