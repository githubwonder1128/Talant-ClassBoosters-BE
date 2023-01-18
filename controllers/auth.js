import User from '../modals/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'async-jsonwebtoken';
import { setting } from '../config/keys.js';

const { secretOrKey } = setting
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({ success: false, message: "Email is not exist."});
        }
        const user_password = user.password;
        const isMatch = await bcrypt.compare(password, user_password);
        if (!isMatch) {
            return res.status(500).json({ success: false, message: "Password isnot correct."});
        }
        const payload = { email: user.email, name: user.name };
        const [token, err] = await jwt.sign(payload,secretOrKey, { expiresIn: 3600 });
        console.log(user, token);
        return res.json({ success: true, message: "successfully logined!", user, accessToken: token});
    } catch (error) {
        console.log(error)
    }
}

export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const IsExist = await User.find({ email });
        if (IsExist.length > 0) {
            return res.status(500).json({ success: false, message: "email is exist."});
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            role: "admin",
            firstName,
            lastName,
            email,
            password: hashPassword
        });
        await newUser.save();
        const payload = { email, firstName, lastName };
        const [token, err] = await jwt.sign(payload,secretOrKey, { expiresIn: 3600 });
        const cloneUser = await User.findOne({ email });
        return res.json({ success: true, message: "successfully created!", user: cloneUser, accessToken: token});

    } catch (error) {
        return res.status(500).json({ success: false, message: "error occured"});
    }
}

export const accessToken = async (req, res) => {
    try {
        const { accessToken } = req.body;
        //verify token
        const [decoded, error] = await jwt.verify(accessToken,secretOrKey, { expiresIn: 3600 });
        if (error) {
            return res.status(401).json({ error: "Invalid access token detected" });
        }
        const { email } = decoded;
        const user = await User.findOne({ email });

        const payload = { email: user.email, firstName: user.firstName, lastName: user.lastName };
        const [token, err] = await jwt.sign(payload, secretOrKey, { expiresIn: 3600 });
        return res.json({ success: true, accessToken: token, user });
    } catch (error) {
        
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id, email, password, firstName, lastName } = req.body;
        const IsExist = await User.find({ _id: { $ne: id},email });
        if (IsExist.length > 0) {
            return res.json({ success: false, message: "email is exist."});
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const updateUser = {
            email,
            password,
            firstName,
            lastName,
            password: hashPassword
        }

        const payload = { email, firstName, lastName };
        const [token, err] = await jwt.sign(payload,secretOrKey, { expiresIn: 3600 });

        await User.findByIdAndUpdate(id, updateUser);
        const cloneUser = await User.findById(id);

        return res.json({ success: true, message: "successfully updated!", user: cloneUser, accessToken: token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed"});
    }
}