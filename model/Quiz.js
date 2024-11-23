const mongoose = require('mongoose');

const quizschema = new mongoose.Schema({
        created_by:{
            type:mongoose.Types.ObjectId,
            ref:'user'
        },
        name:{
            type:String,
            required:true,
            unique:true
        },
        question_list:[
            {
                question_number: {
                    type:Number,
                    required:true
                },
                question :String,
                options:{

                }
            }
        ],

        answer:{},
        
        is_published:{
            type:Boolean,
            default:false
        }
    },
    {timestamps:true}
);

const Quiz = mongoose.model('Quiz', quizschema);

module.exports=Quiz;