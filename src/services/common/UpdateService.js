const UpdateService = async (Request,DataModel) =>{
    try{
        let UserEmail = Request.headers['email'];
        let id = Request.params.id;
        let PostBody = Request.body;
        let data = await DataModel.updateOne({_id:id,UserEmail:UserEmail},PostBody);
        return {status: "success", data:data}
    }
    catch (e) {
        return {status: "fail", data:e.toString()}
    }
}
module.exports = UpdateService