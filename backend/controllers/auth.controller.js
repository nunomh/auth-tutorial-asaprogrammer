import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js';

export const signup = async (req, res) =>
{
    const { email, password, name } = req.body;
    try
    {
        if (!email || !password || !name)
        {
            throw new Error("All fields are required.");
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists)
        {
            throw new Error("User already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = generateVerificationToken();

        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id);

        // mailtrap
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json(
            {
                success: true,
                message: "User created successfully.",
                user: {
                    ...user._doc,
                    password: undefined
                }
            });

    } catch (error)
    {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const login = async (req, res) =>
{
    res.send('login');
};

export const logout = async (req, res) =>
{
    res.send('logout');
};

export const verifyEmail = async (req, res) =>
{
    const { code } = req.body;

    try
    {
        const user = await User.findOne({ verificationToken: code, verificationTokenExpiresAt: { $gt: Date.now() } });

        if (!user)
        {
            throw new Error("Invalid verification code.");
        }

        user.verified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({ success: true, message: "Email verified successfully." });
    }
    catch (error)
    {
        res.status(400).json({ success: false, error: error.message });
    }
}

export const deleteUserByEmail = async (req, res) =>
{
    const { email } = req.body;

    try
    {
        await User.findOneAndDelete({ email });

        res.status(200).json({ success: true, message: "User deleted successfully." });
    }
    catch (error)
    {
        res.status(400).json({ success: false, error: error.message });
    }
}
