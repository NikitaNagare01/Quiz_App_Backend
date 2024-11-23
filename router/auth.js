const express = require('express')
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const JWT_SECRET=process.env.JWT_SECRET;

const router= express.Router();

router.get('/',(req, res)=>{
    res.send('from router');
})



// ********************* user/:userid *********************

// router.get('/:userid',async(req, res)=>{
//     try{
//         const userID=req.params.userid;
//         const user=await User.findById(userID);
//         if(!user){
//             res.send.json({status:"error", message:"No user found", data:{}});
//         }else{
//             res.send.json({status:"success", message:"User found", data:{user:user}});
//         }
//     }catch(err){
//         console.log(err);
//         res.status(500).send.json({status:"error",message:"Something went wrong",data:{}});
//     }
// })







// ************** REGISTRATION ****************
router.post('/register',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter valid password').isLength({min:5})
],async(req,res)=>{
    console.log(req.body);

    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({status:false,message:"Username should contain minimum 3 character and password should contain atleast 5 character"});
    }

    try{
        const{name, email, password, cpassword}=req.body;

        const userexist=await User.findOne({email:email});
        if(userexist){
            return res.status(422).json({status:false,message:'Email already exist', data:userexist});
        }else if(password!=cpassword){
            return res.status(422).json({status:false,message:'Password are not matching', data:{}});
        }

        // to hash the password with the help of salt and hash method present inside the bcrypt
        const salt= await bcrypt.genSalt(10);
        const bpassword = await bcrypt.hash(password, salt);

        const user = new User({name:name, email:email, password:bpassword});
        await user.save();

        // to create the token with the help of the jsonwebtoken
        const data={
            user:{
                id:user._id
            }
        }
        const token= jwt.sign(data,JWT_SECRET);

        res.status(201).json({status:true,message:'User registered successfully', token:token});

    }catch(err){
        res.status(500).json({status:false,message:'Internal error',data:{}});
    }

})





// ***************************** LOGIN ***********************

router.post('/login',[
    body('email','Enter valid email').isEmail(),
    body('password','Enter valid email').isLength({min:5})
],async(req, res)=>{

    console.log(req.body);

    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json(error);
    }

    try{

        const{email, password}=req.body;

        const userexist= await User.findOne({email:email});
        console.log(userexist);
        if(!userexist){
            return res.status(400).json({status:false,message:"Invalid Credentials"});
        }

        //to compare the password with the help of the bcrypt hashing
        const passwordcompare = await bcrypt.compare(password, userexist.password);
        if(!passwordcompare){
            return res.status(400).json({status:false,message:"Invalid credentials"});
        }

        // to create the token of the user
        const data={
            user:{
                id:userexist._id
            }
        }
        const token= jwt.sign(data,JWT_SECRET);

        // to store the token inside the cookie
        res.cookie('token',token,{
            expires:new Date(Date.now()+25000000000)
        })

        return res.json({status:true,message:"Successfully logged in", token:token});
    }catch(err){
        return res.status(500).json({status:true,message:'Internal error',data:{}});
    }

});







// **************************** UPDATE USER **********************

router.put('/update',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter valid password').isLength({min:5})
],async(req, res)=>{

    console.log(req.body);

    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json(error);
    }

    try{
        const useremail = req.body.email;
        const user= await User.findOne({email:useremail});
        if(!user){
            return res.status(400).json({status:false,message:"User not found"});
        }

        // to hash the password with the help of salt and hash method present inside the bcrypt
        const salt= await bcrypt.genSalt(10);
        const bpassword = await bcrypt.hash(req.body.password, salt);


        user.name = req.body.name;
        user.password = bpassword;
        await user.save()
        res.json({status:true, message:"updated successfully", data:{user:user}});
    }catch(err){
        console.log(err);
        res.status(500).json({status:false, message:"Something went wrong", data:{}});
    }
})


module.exports=router;