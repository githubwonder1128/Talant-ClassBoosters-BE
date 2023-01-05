import User from '../modals/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'async-jsonwebtoken';
import { setting } from '../config/keys.js';

const { secretOrKey } = setting
export const login = async (req, res) => {
    try {
        const { email, password } = req.body?.data;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Email is not exist."});
        }
        const user_password = user.password;
        const isMatch = await bcrypt.compare(password, user_password);
        if (!isMatch) {
            return res.json({ success: false, message: "Password isnot correct."});
        }
        const payload = { email: user.email, name: user.name };
        const [token, err] = await jwt.sign(payload,secretOrKey, { expiresIn: 3600 });
        return res.json({ success: true, message: "successfully logined!", user, access_token: token});
    } catch (error) {
        
    }
}

export const register = async (req, res) => {
    try {
        const { email, password, displayName } = req.body;
        const IsExist = await User.find({ email });
        if (IsExist.length > 0) {
            return res.json({ success: false, message: "email is exist."});
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            role: "admin",
            displayName,
            email,
            password: hashPassword
        });
        await newUser.save();
        const payload = { email, displayName };
        const [token, err] = await jwt.sign(payload,secretOrKey, { expiresIn: 3600 });
        const cloneUser = await User.findOne({ email });
        return res.json({ success: true, message: "successfully created!", user: cloneUser, access_token: token});

    } catch (error) {
        return res.json({ success: false, message: "error occured"});
    }
}

export const accessToken = async (req, res) => {
    try {
        const { access_token } = req.body.data;
        //verify token
        const [decoded, error] = await jwt.verify(access_token,secretOrKey, { expiresIn: 3600 });
        if (error) {
            return res.status(401).json({ error: "Invalid access token detected" });
        }
        const { email } = decoded;
        const user = await User.findOne({ email });

        const payload = { email: user.email, displayName: user.displayName };
        const updateToken = await jwt.sign(payload, secretOrKey, { expiresIn: 3600 });
        return res.json({ success: true, access_token: updateToken });
    } catch (error) {
        
    }
}