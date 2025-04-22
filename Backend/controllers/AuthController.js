import { compare } from "bcrypt";
import User from "../models/userSchema.js"
import jwt from 'jsonwebtoken'
import { renameSync, unlinkSync } from 'fs'


const maxAge = 3 * 24 * 60 * 60 * 1000

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: maxAge })
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send("Email and password is required")
        }

        const user = await User.create({ email, password })

        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })

        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
            },
        })
    } catch (error) {
        console.log("error while sign up", error)
        return res.status(500).send("Internal server error")
    }
}


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send("Email and password is required.")
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send("User with the given email not found.")
        }

        const auth = await compare(password, user.password)
        if (!auth) {
            return res.status(400).send("Password is incorrect")
        }

        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })

        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.profilePicture,
                color: user.color
            },
        })
    } catch (error) {
        console.log("error while sign up", error)
        return res.status(500).send("Internal server error")
    }
}


export const getUserInfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId)

        if (!userData) {
            return res.status(404).send("User with the given id Not found .")
        }

        return res.status(201).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.profilePicture,
            color: userData.color
        })
    } catch (error) {
        console.log("error while sign up", error)
        return res.status(500).send("Internal server error")
    }
}


export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req
        const { firstName, lastName, color } = req.body

        if (!firstName || !lastName) {
            return res.status(400).send("FirstName , LastName and Color is Required .")
        }

        const userData = await User.findByIdAndUpdate(userId, {
            firstName, lastName, color, profileSetup: true
        }, { new: true, runValidators: true })

        return res.status(201).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.profilePicture,
            color: userData.color
        })
    } catch (error) {
        console.log("error while sign up", error)
        return res.status(500).send("Internal server error")
    }
}


export const addProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required")
        }

        const date = Date.now()
        let fileName = "uploads/profiles/" + date + req.file.originalname
        renameSync(req.file.path, fileName)

        const updatedUser = await User.findByIdAndUpdate(req.userId, { profilePicture: fileName }, { new: true, runValidators: true })

        return res.status(200).json({
            image: updatedUser.profilePicture
        })
    } catch (error) {
        console.log("error while Uplaod image", error)
        return res.status(500).send("Internal server error")
    }
}


export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).send("User not found");
        }
        if(user.profilePicture){
            unlinkSync(user.profilePicture)
        }
        user.profilePicture = null;
        await user.save()
        return res.status(200).send("Profile image Removed Successfully")
    } catch (error) {
        console.log("error while Deleteing image", error)
        return res.status(500).send("Internal server error")
    }
}


export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"})
        return res.status(200).send("Logout Successfully.")
    } catch (error) {
        console.log("error while Logout", error)
        return res.status(500).send("Internal server error")
    }
}