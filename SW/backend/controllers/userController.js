const User = require("../models/User")

const userController = {
    //GET ALL USERS
    getAllUsers: async(req,res) =>{
        try {
            const user = await User.find();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error)
        }
    },

    //Delete users
    deleteUsers: async(req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("delete ok")
        } 
        catch (error) {
            res.status(500).json(error)
        }
    },
    updateUserStatus: async (req, res) => {
        const userId = req.params.id;
        const { can_open } = req.body;
        if (typeof can_open !== 'boolean') {
            return res.status(400).json({ message: 'Invalid input: can_open should be a boolean' });
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { can_open },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'User status updated successfully', user: updatedUser });
        } catch (error) {
            console.error('Error updating user status:', error);
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    }
};




module.exports = userController;