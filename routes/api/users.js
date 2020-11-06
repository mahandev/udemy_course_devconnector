const { json } = require('express');
const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require("bcryptjs");
const { check, validationResult } = require('express-validator')
const User = require('../../models/User');

//create a router
const router = express.Router();

// @route   POST api/users
// @Desc    REgister a new user
// @access  Public
router.post('/', [
    check('name', "Name is Required").not().isEmpty(),
    check('email', "Please include a Valid Email").isEmail(),
    check('password', "Please include a password which is more than 6 characters").isLength({min:6})
],async (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const {name,email,password} = req.body;
    //See if user exists
    
    try{
        let user = await User.findOne({ email })
        if(user){
            res.status(400).json({ errors: [{msg: 'User already exists'}]})
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm',
        })
        
        const salt = await bcrypt.genSalt(10);
        user = new User({
            name,
            email,
            avatar,
            password,
        });

        user.password = await bcrypt.hash(password, salt);

        

        await user.save();



        res.send("User Registered");
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error")

    }
});

module.exports = router;