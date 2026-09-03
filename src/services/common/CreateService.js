const CreateService = async (Request,DataModel)=>{
    try{
        let PostBody = Request.body;
        PostBody.UserEmail = Request.headers['email']
        let data = await DataModel.create(PostBody)
        return {status: "success", data:data}
    }
    catch (e) {
        return {status: "fail", data:e.toString()}
    }
}
module.exports = CreateService