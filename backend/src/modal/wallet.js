const mongoose=require("mongoose");

const struct =mongoose.Schema({
    startDate:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    selectOption:{
        type:String,
        require:true
    },
    amount:{
        type:Number,
        require:true
    },
    summary:{
        type:String,
        require:true
    }

})
const result=mongoose.model("Wallet",struct)
module.exports=result