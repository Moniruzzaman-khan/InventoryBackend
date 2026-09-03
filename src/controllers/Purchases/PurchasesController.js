const ParentModel = require("../../models/Purchases/PurchaseModel");
const ChildsModel = require("../../models/Purchases/PurchaseProductsModel");
const CreateParentChildsService = require("../../services/common/CreateParentChildsService");
const DataModel = require("../../models/Products/ProductsModel");
const ListOneJoinService = require("../../services/common/ListOneJoinService");
const DeleteParentChildsService = require("../../services/common/DeleteParentChildsService");

exports.CreatePurchases = async (req,res)=>{
    let Result = await CreateParentChildsService(req,ParentModel,ChildsModel,'PurchaseID')
    res.status(200).json(Result)
}

exports.PurchasesList=async (req, res) => {
    let SearchRgx = {"$regex": req.params.searchKeyword, "$options": "i"}
    let SearchArray=[{VatTax: SearchRgx},{Discount: SearchRgx},{OtherCost: SearchRgx},{GrandCost: SearchRgx},{ShippingCost: SearchRgx},{Note: SearchRgx},{'suppliers.Name': SearchRgx},{'suppliers.Address': SearchRgx},{'suppliers.Phone': SearchRgx},{'suppliers.Email': SearchRgx}]
    let JoinStage= {$lookup: {from: "suppliers", localField: "SuppliersID", foreignField: "_id", as: "suppliers"}}
    let Result=await ListOneJoinService(req,DataModel,SearchArray,JoinStage);
    res.status(200).json(Result)
}

exports.PurchasesDelete=async (req, res) => {
    let Result=await  DeleteParentChildsService(req,ParentModel,ChildsModel,'PurchaseID')
    res.status(200).json(Result)
}