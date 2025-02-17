const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
const authController = {
    //REGISTER
    registerUser: async(req, res) => {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
    
      //create new user
      const newUser = await new User ({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //save to db
      const user = await newUser.save();
      res.status(200).json(user);

    } catch (error) {
        res.status(500).json(error)
      }
    },

    //Generate accestoken
    generateAccesToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
       process.env.JWT_ACCESS_KEY,
       {expiresIn: "1d"
        });
    },

    //Generate refreshToken
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
                    admin: user.admin
                },
               process.env.JWT_REFRESH_KEY,
               {expiresIn: "365d"
        });
    },

    //login 
    loginUser: async(req, res)=> {
        try {
            const user = await User.findOne({username: req.body.username});
            if(!user){
                return res.status(404).json("Wrong username!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if(!validPassword) {
                return res.status(404).json("Wrong password!");
            }
            if(user && validPassword) {
                const accessToken = authController.generateAccesToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure:false,
                    path:"/",
                    sameSite:"strict",
                })
                const {password, ...others} = user._doc;
                res.status(200).json({...others,accessToken});
            }
        } catch (error) {
            res.status(500).json(error)
        }
    },
    
    requestRefreshToken: async(req, res) => {
        //lấy refreshToken từ user
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json("you're not authenticated");
        if(!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (error, user) =>{
            if(error) {
                console.log(error);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            //Create new access and refresh
            const newAccessToken = authController.generateAccesToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure:false,
                path:"/",
                sameSite:"strict",
            });
            res.status(200).json({accessToken: newAccessToken});
        });
    },

    changePassword: async (req, res) => {
        console.log(req.body);  
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id; 
    
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
    
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect." });
            }
    
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            
            user.password = hashedNewPassword;
            await user.save();
    
            return res.status(200).json({ message: "Password changed successfully." });
        } catch (error) {
            return res.status(500).json({ message: "An error occurred while changing password.", error });
        }
    },

    //LOG OUT
    userLogout: async(req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("logout ok");
    }

    
}
module.exports = authController;