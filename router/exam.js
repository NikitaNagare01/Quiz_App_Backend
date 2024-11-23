const express=require('express')
const router = express.Router();
const fetchuser= require('../middleware/fetchuser');
const Quiz = require('../model/Quiz');
const Result = require('../model/Result');

// get /exam/quiz
router.post('/quiz',fetchuser, async(req,res)=>{
    try{

        const id= req.body.quizid;

        if(!id){
            return res.status(422).json({status:false,message:'Quiz not found', data:id});
        }

        const quiz= await Quiz.findById(id,{name:1, question_list:1, created_by:1});
        if(!quiz){
          return   res.status(422).json({status:false, message:"Quiz not found", data:quiz});
        }

       
       return res.status(201).json({status:true, message:"Quiz found successfully", data:quiz});

    }catch(err){
        // res.send('error');
        console.log(err);
    }
})


// post /exam/submit
router.post('/submit',fetchuser,async(req, res)=>{
   
    try{

        const id= req.body.quizid;
        const attempted_question= req.body.attempted_question;

        if(!id){
            return res.status(422).json({status:false,message:'Quiz not found', data:id});
        }

        const quiz= await Quiz.findById(id,{answer:1});
        if(!quiz){
          return   res.status(422).json({status:false, message:"Quiz not found", data:quiz});
        }


        
        
        const answers = quiz.answer;
        
        const userid=req.user.id;
        const allquestions= Object.keys(answers);
        const total = allquestions.length;
        
        let score=0;
        
        for(let i=0; i<total; i++){
            let question_number = allquestions[i];
            if(!!attempted_question[question_number] && answers[question_number]== attempted_question[question_number]){
                score=score+1;
            }
        }
        
        
        const resultexist = await Result.findOne({userid:req.user.id, quizid:id});
        if(resultexist){

            resultexist.score=score;
            resultexist.total=total;
            // resultexist.quizname=quiz.name;

            const n = await resultexist.addname(quiz.name);
            // console.log(quiz.name);

            await resultexist.save()

            return   res.status(201).json({status:true, message:"Score calculated", data:resultexist});
        }else{

            const result = new Result({ userid:userid, quizid:id, score:score, total:total});
            const n2 = await result.addname(quiz.name);
            const data = await result.save();
    
           
           return res.status(201).json({status:true, message:"Score calculated", data:quiz, total, score, resultid:data._id});
        }

    }catch(err){
        // res.send('error');
        console.log(err);
    }
})











// get all quiz 
router.get('/getallquiz', fetchuser, async(req, res)=>{

    try{

        
        const quiz= await Quiz.find({});
        
       
       return res.status(201).json({status:true, message:"Quiz found successfully", data:quiz});

    }catch(err){
        // res.send('error');
        console.log(err);
    }

})


// user specific quiz

router.get('/userquiz', fetchuser, async(req, res)=>{
    try{
        const quiz= await Quiz.find({created_by:req.user.id});

        return res.status(201).json({status:true, message:"Quiz found successfully", data:quiz});
    }catch(err){
        // res.send('error');
        console.log(err);
    }
})


module.exports = router