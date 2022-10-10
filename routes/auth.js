require('dotenv').config();
const router = require('express').Router();
const {check,validationResult} = require('express-validator');
const {users} = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup',[
    check('email','Please provide a valid email')
    .isEmail(),
    check('password','Please provide a password that is greater than 6 characters')
    .isLength({
        min:6
    })
],async (req,res)=>{
    const {password, email} = req.body;

    //Validate the input
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            errors:errors.array(),
        });
    }

    //Validate if user doesnot already exist.
    let user = users.find((user) => {
        return user.email === email;
    });

    if(user) {
        res.status(422).json({
            msg:"User already exists",
        });
    }

    let hashedpassword = await bcrypt.hash(password,10);

    users.push({
        email:email,
        password:hashedpassword
    });

    const token = await jwt.sign({
        email:email,
    },process.env.SECRET,{
        expiresIn:360000000,
    });

    res.json({token});

    // console.log(hashedpassword);


    // return res.status(200).json({msg:"Validation passed"});
});


router.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    let user = users.find((user=>{
        return user.email === email;
    }));

    if(!user) {
        return res.status(422).json({'errors':[
            {
                'msg':'Invalid credentials',
            }
        ]})
    }

    let isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch) {
        return res.status(400).json({'errors':[
            {
                'msg':'Invalid credentials',
            }
        ]})
    }

    const token = await jwt.sign({
        email:email,
    },"jebefheo80ejofefbjkvejhvuohokbhvhugihi",{
        expiresIn:360000000,
    });

    res.json({token});
});

router.get('/all',(req,res)=>{
    res.json(users);
});
 
module.exports = router; 