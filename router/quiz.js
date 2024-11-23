const express = require('express');
const router= express.Router();
const fetchuser= require('../middleware/fetchuser');
const {body, validationResult, validator}= require('express-validator');
const Quiz=require('../model/Quiz');
const { trusted } = require('mongoose');

router.get('/check', fetchuser, async(req, res, next)=>{
    // next('error');
    res.send("from user fetchuser");
})




// create
// post /quiz/create
router.post('/create',fetchuser,[
    body('name', 'Enter a valid Name').isLength({min:3})
], async(req, res)=>{

    const error= validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }
    
    try{
        const {name, question_list, answer, }=req.body;

        let qz= await Quiz.findOne({name:name});
        if(qz){
            return res.status(422).json({status:false,message:'Enter Unique Name', data:qz});
        }

        const created_by=req.user.id;

        const quiz = new Quiz({created_by, name, question_list, answer})
        await quiz.save();

       return res.status(201).json({status:true, message:"Quiz created successfully", data:quiz});

    }catch(err){
        // res.send('error');
        console.log(err);
    }
   

    
})



// get
// get /quiz/get
router.get('/get', fetchuser,async(req, res)=>{
    try{

        const id= req.body.quizid;

        if(!id){
            return res.status(422).json({status:false,message:'Quiz not found', data:id});
        }

        const quiz= await Quiz.findById(id,{name:1, question_list:1, answer:1, created_by:1});
        if(!quiz){
          return   res.status(422).json({status:false, message:"Quiz not found", data:quiz});
        }

        if(quiz.created_by.toString() !== req.user.id){
           return res.status(403).json({status:false, message:"You are not authorized", data:{}});
        }

       return res.status(201).json({status:true, message:"Quiz found successfully", data:quiz});

    }catch(err){
        // res.send('error');
        console.log(err);
    }
})


// update
// put /quiz/update
router.put('/update',[
    body('name', 'Enter a valid Name').isLength({min:3})
], fetchuser,async(req, res)=>{
    
    const error= validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }

    try{
        const {name, question_list, answer, }=req.body;

        const id= req.body.quizid;

        if(!id){
            return res.status(422).json({status:false,message:'Quiz not found', data:id});
        }
        
        const quiz= await Quiz.findById(id);
        if(!quiz){
           return res.status(422).json({status:false, message:"Quiz not found", data:quiz});
        }

        
        if(quiz.created_by.toString() !== req.user.id){
           return res.status(403).json({status:false, message:"You are not authorized", data:{}});
        }


        quiz.name=name;
        quiz.question_list=question_list;
        quiz.answer=answer;

        await quiz.save();

       return res.status(201).json({status:true, message:"Quiz Updated successfully", data:quiz});
        

    }catch(err){
        // res.send('error');
        console.log(err);
    }
   

})


// delete
// delete /quiz/delete
router.delete('/delete',fetchuser, async(req, res)=>{

    try{

        const id= req.body.quizid;

        if(!id){
            return res.status(422).json({status:false,message:'Quiz not found', data:id});
        }

        let quiz= await Quiz.findById(id);
        if(!quiz){
          return  res.status(422).json({status:false, message:"Quiz not found", data:quiz});
        }

        
        if(quiz.created_by.toString() !== req.user.id){
           return res.status(403).json({status:false, message:"You are not authorized", data:{}});
        }else{

            quiz=await Quiz.deleteOne({_id:id});
            
           return res.status(201).json({status:true, message:"Quiz deleted successfully", data:quiz});
        }



    }catch(err){
        // res.send('error');
        console.log(err);
    }

})



//publish
// patch /quiz/publish
router.patch('/publish', fetchuser,async(req, res)=>{
    
    
    try{

        const id= req.body.quizid;

        if(!id){
            return res.status(422).json({status:false,message:'Quiz not found', data:id});
        }

        let quiz= await Quiz.findById(id);
        if(!quiz){
           return res.status(422).json({status:false, message:"Quiz not found", data:quiz});
        }

        
        if(quiz.created_by.toString() !== req.user.id){
          return  res.status(403).json({status:false, message:"You are not authorized", data:{}});
        }


        quiz.is_published=true;

        await quiz.save();
        
       return res.status(201).json({status:true, message:"Quiz published successfully", data:quiz});

    }catch(err){
        // res.send('error');
        console.log(err);
    }

})






module.exports = router