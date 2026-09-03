const mongoose = require("mongoose");
const CreateParentChildsService = async (Request, ParentModel, ChildsModel, JoinPropertyName) =>{

    // Create transaction session
    const session = await mongoose.startSession();

    try{

        // Begin Transaction
        await session.startTransaction();

        // 1st DB Process Parent creation
        let Parent = Request.body['Parent'];
        Parent.UserEmail= Request.headers['email'];
        let ParentCreation = await ParentModel.create([Parent],{ session });

        //2nd DB Process Child create
                let Childs = Request.body['Childs'];
                await Childs.forEach((element) =>{
                    element[JoinPropertyName] = ParentCreation[0]['_id'];
                    element['UserEmail']=Request.headers['email'];
                })
                let ChildsCreation = await ChildsModel.insertMany(Childs,{ session });

        // Transaction Success
        await session.commitTransaction();
        session.endSession();
        return{status:"success",Parent:ParentCreation,Childs:ChildsCreation}
            }
            catch (e) {
                // Roll Back Transaction if Fail
                await session.abortTransaction();
                session.endSession();
                return {status: "fail", data: e}
            }
}
module.exports = CreateParentChildsService