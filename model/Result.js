const mongoose = require('mongoose');

const resultschema = new mongoose.Schema({
        userid:{
            type:mongoose.Types.ObjectId,
            required:true,
            ref:'user'
        },
        quizid:{
            type:mongoose.Types.ObjectId,
            required:true,
            ref:'quiz'
        },
        score:{
            type:Number,
            required:true
        },
        total:{
            type:Number,
            required:true
        },
        quizname:{
            type:String,
        }
    },
    {timestamps:true}
);

resultschema.methods.addname = async function(name){
    try{
        this.quizname = name;
        await this.save();
        return this.quizname;
    }catch(err){
        console.log(err);
    }
}

const Result = mongoose.model('Result', resultschema);

module.exports=Result;