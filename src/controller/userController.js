const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const calculateDistance = require("../utils/distance")


// Create a new user
exports.createUser = async (req,res) => {
    try {
        const {name, email,password,address,latitude,longitude}= req.body

        if(!name || !email || !password || !address || !latitude || !longitude){
            return res.status(400).json({
                status_code:400,
                message:"All fields are required"})
        }

        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(400).json({
                status_code:400,
                message:"User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await userModel.create({
            name,
            email,
            password:hashedPassword,
            address,
            latitude,
            longitude
        })

        const token = jwt.sign(
            {id:newUser._id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        )
        res.cookie("token",token,{
                    httpOnly:true,
        })
        res.status(201).json({
          status_code: 201,
          message: "User created successfully",
          data: {
            name: newUser.name,
            email: newUser.email,
            address: newUser.address,
            latitude: newUser.latitude,
            longitude: newUser.longitude,
            status: newUser.status,
            register_at: newUser.createdAt,
          },
          token
        });

        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

// Change status of all users
exports.changeStatus = async (req,res) => {
    try {
        await userModel.updateMany(
          {},
          [
            {
              $set: {
                status: {
                  $cond: [{ $eq: ["$status", "active"] }, "inactive", "active"],
                },
              },
            },
          ],
          { updatePipeline: true },
        );

        res.status(200).json({
            status_code:200,
            message:"Status changed successfully"})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            status_code:500,
            message:"Internal server error"})
    }
}

// Calculate distance

exports.getDistance = async (req,res) => {
    try {
        const userId = req.user.id
        const {latitude,longitude} = req.query
        
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                status_code:404,
                message:"User not found"})
        }

        const distance = calculateDistance(
            user.latitude,
            user.longitude,
            parseFloat(latitude),
            parseFloat(longitude)
        )

        res.status(200).json({
            status_code:200,
            message:"Distance calculated successfully",
            distance:distance.toFixed(2)+" km"
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            status_code:500,
            message:"Internal server error"})
    }
    
}

// Get User Listing

exports.userListing = async (req,res) => {
    try {
        const {weekNumber} = req.query

        if(!weekNumber){
            return res.status(400).json({
                status_code:400,
                message:"Week number is required"
            })
        }

        const weekNumbers = weekNumber.split(",").map(Number) 

        const mongoDays = weekNumbers.map(day=> day+1)

        const users = await userModel.aggregate([
            {
                $addFields:{
                    dayOfWeek:{$dayOfWeek:"$createdAt"}
                }
            },
            {
                $match:{
                    dayOfWeek:{$in:mongoDays}
                }
            },
            {
                $project:{
                    name:1,
                    email:1,
                    dayOfWeek:1,
                }
            }
        ])

        const dayMap = {
            1:"Sunday",
            2:"Monday",
            3:"Tuesday",
            4:"Wednesday",
            5:"Thursday",
            6:"Friday",
            7:"Saturday"
        }
        const result = {}
        users.forEach((user)=>{
            const dayName = dayMap[user.dayOfWeek]
            if(!result[dayName]){
                result[dayName] = []
            }
            result[dayName].push({
                name:user.name,
                email:user.email
            })
        })
        res.status(200).json({
            status_code:200,
            message:"User listing retrieved successfully",
            data:result
        })


    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            status_code:500,
            message:"Internal server error"})   
    }
}
