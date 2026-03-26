const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password, referralCode } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Create unique referral ID for new user
        // Use walletAddress as referralId if provided, otherwise fallback to DHK + random numbers
        let newReferralId;
        if (req.body.walletAddress) {
            newReferralId = req.body.walletAddress.toLowerCase();
            // Check if this wallet is already taken as a referralId OR walletAddress
            const walletExists = await User.findOne({ 
                $or: [
                    { referralId: newReferralId },
                    { walletAddress: newReferralId }
                ] 
            });
            if (walletExists) return res.status(400).json({ message: 'This wallet address is already registered with another account' });
        } else {
            let isUnique = false;
            while (!isUnique) {
                newReferralId = 'DHK' + Math.floor(1000 + Math.random() * 9000);
                const existingUser = await User.findOne({ referralId: newReferralId });
                if (!existingUser) isUnique = true;
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            referredBy: referralCode || null,
            referralId: newReferralId,
            walletAddress: req.body.walletAddress ? req.body.walletAddress.toLowerCase() : ''
        });

        // Referral logic: Link user to sponsors in the tree
        if (referralCode) {
            const cleanReferralCode = referralCode.trim();
            // Try to find sponsor by Referral ID OR Wallet Address
            const sponsorL1 = await User.findOne({ 
                $or: [
                    { referralId: cleanReferralCode },
                    { walletAddress: cleanReferralCode.toLowerCase() },
                    { referralId: cleanReferralCode.toLowerCase() }
                ]
            });

            if (sponsorL1) {
                // Check if user already in level1 to prevent duplicates
                if (!sponsorL1.referrals.level1.includes(user._id)) {
                    sponsorL1.referrals.level1.push(user._id);
                    await sponsorL1.save();
                }
                
                // Set the correct referredBy handle (prefer walletAddress if available, otherwise referralId)
                user.referredBy = sponsorL1.walletAddress || sponsorL1.referralId;
                await user.save();

                // Sponsor level 2
                if (sponsorL1.referredBy) {
                    const cleanRefL2 = sponsorL1.referredBy.trim();
                    const sponsorL2 = await User.findOne({ 
                        $or: [
                            { referralId: cleanRefL2 },
                            { walletAddress: cleanRefL2.toLowerCase() }
                        ]
                    });
                    if (sponsorL2) {
                        if (!sponsorL2.referrals.level2.includes(user._id)) {
                            sponsorL2.referrals.level2.push(user._id);
                            await sponsorL2.save();
                        }

                        // Sponsor level 3
                        if (sponsorL2.referredBy) {
                            const cleanRefL3 = sponsorL2.referredBy.trim();
                            const sponsorL3 = await User.findOne({ 
                                $or: [
                                    { referralId: cleanRefL3 },
                                    { walletAddress: cleanRefL3.toLowerCase() }
                                ]
                            });
                            if (sponsorL3) {
                                if (!sponsorL3.referrals.level3.includes(user._id)) {
                                    sponsorL3.referrals.level3.push(user._id);
                                    await sponsorL3.save();
                                }
                            }
                        }
                    }
                }
            }
        }

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                referralId: user.referralId,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
                message: 'Registration successful'
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Check if user is blocked or inactive
            if (['Inactive', 'Banned', 'Rejected'].includes(user.status)) {
                return res.status(403).json({ 
                    message: 'Your account has been deactivated or blocked. Please contact the administrator.' 
                });
            }

            /* 2FA: Generate and send OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.twoFactorOtp = otp;
            user.twoFactorExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
            await user.save();

            // Send Email (Async)
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Your Account Login OTP - DHANIK',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background: #0b1118; color: white; border-radius: 15px;">
                        <h2 style="color: #ffae00;">DHANIK Security OTP</h2>
                        <p>You are trying to log in to your DHANIK account. Please use the following One-Time Password (OTP) to complete the login:</p>
                        <div style="background: rgba(255,174,0,0.1); padding: 15px; border-radius: 10px; font-size: 24px; font-weight: bold; text-align: center; color: #ffae00; letter-spacing: 5px;">
                            ${otp}
                        </div>
                        <p style="font-size: 0.8rem; color: #9ca3af; margin-top: 20px;">This code will expire in 10 minutes. If you did not request this, please change your password immediately.</p>
                    </div>
                `
            };

            // Don't await email, send it and return 2fa_required
            transporter.sendMail(mailOptions).catch(err => console.log("Email error:", err));

            return res.json({ 
                twoFactorRequired: true, 
                email: user.email,
                message: 'OTP sent to your registered email' 
            }); */

            // DIRECT LOGIN (2FA Commented)
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                referralId: user.referralId,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify 2FA OTP
// @route   POST /api/auth/verify-2fa
const verify2FA = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.twoFactorOtp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        if (Date.now() > user.twoFactorExpires) {
            return res.status(401).json({ message: 'OTP expired' });
        }

        // Clear OTP
        user.twoFactorOtp = undefined;
        user.twoFactorExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            referralId: user.referralId,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, verify2FA };
