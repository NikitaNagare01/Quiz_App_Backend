const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Result = require('../model/Result');
const router = express.Router();


//get /report

router.post('/resultid',fetchuser ,async(req,res)=>{
    try{

        const resultid= req.body.resultid;
        if(!resultid){
            return res.status(422).json({status:false,message:'Invalid resultid', data:resultid});
        }

        const result= await Result.findById(resultid);
        if(!result){
          return   res.status(404).json({status:false, message:"Result not found", data:result});
        }

        if(result.userid.toString() !== req.user.id){
            return res.status(403).json({status:false, message:"You are not authorized", data:{}});
        }

        return res.status(201).json({status:true, message:"Result found", data:result});

    }catch(err){
        // res.send('error');
        console.log(err);
    }
})




router.get('/allresult', fetchuser, async(req, res)=>{

    try{

        const result= await Result.find({userid:req.user.id});
        

        return res.status(201).json({status:true, message:"Result found", data:result});

    }catch(err){
        // res.send('error');
        console.log(err);
    }

})


module.exports = router