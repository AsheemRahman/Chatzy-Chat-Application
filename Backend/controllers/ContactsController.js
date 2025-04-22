import User from "../models/userSchema.js"


export const SearchContact = async (req, res, next) => {
    try {
        const { searchTerm } = req.body

        if (searchTerm === null || searchTerm === undefined) {
            return res.status(400).send("searchTerm is required")
        }

        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}{}|[\]\\]/g, "\\$&")

        const regex = new RegExp(sanitizedSearchTerm, "i")

        const contacts = await User.find({ $and: [{ _id: { $ne: req.UserId } }, { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }] })

        return res.status(200).json({ contacts })
    } catch (error) {
        console.log("error while Search Contact", error)
        return res.status(500).send("Internal server error")
    }
}