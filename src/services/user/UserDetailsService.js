const UserDetailsService = async (Request, DataModel) => {
    try {
        const data = await DataModel.aggregate([
            { $match: { email: Request.headers['email'] } },
            { $project: { _id: 0, email: 1, firstName: 1, lastName: 1, mobile: 1, photo: 1 } }
        ]);
        return { status: 'success', data };
    }
    catch (e) {
        return { status: 'fail', data: e.toString() };
    }
};

module.exports = UserDetailsService;
