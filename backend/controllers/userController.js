import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";
import generateToken from "../utils/createToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// @desc    Register new user
// @route   POST /api/v1/users

const createUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: "Invalid user, Please fill all the required fields" });
  }

  //Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    if (userExists.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      // User exists but is not verified. Resend the email.
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      userExists.verificationToken = verificationToken;
      userExists.verificationTokenExpiry = verificationTokenExpiry;
      
      // Optionally update password if they used a new one? We'll just update the token for now.
      await userExists.save();

      const verifyUrl = `${req.protocol}://${req.get("host")}/api/users/verify/${verificationToken}`;
      const message = `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color: #0a0a0a; color: #E8E6E1; padding: 2rem; border-radius: 8px; text-align: center;">
          <div style="background-color: #141414; border: 1px solid rgba(201,168,76,0.3); border-radius: 12px; padding: 2.5rem; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
            <h2 style="font-family: Georgia, 'Times New Roman', serif; color: #C9A84C; margin-bottom: 1rem;">Welcome to The Silk Routes!</h2>
            <p style="font-size: 16px; margin-bottom: 1rem;">Hi ${userExists.username},</p>
            <p style="font-size: 16px; margin-bottom: 2rem;">Please click the button below to verify your email address and complete your registration.</p>
            <a href="${verifyUrl}" style="background-color: #C9A84C; color: #0a0a0a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email</a>
            <p style="font-size: 14px; margin-top: 2rem; color: #9C9690;">If you did not create an account, no further action is required.</p>
          </div>
        </div>
      `;

      try {
        await sendEmail({
          email: userExists.email,
          subject: "Verify Your Email - The Silk Routes",
          html: message,
        });
        return res.status(201).json({
          message: "Registration successful. A verification email has been sent to your email address. Please verify to log in.",
        });
      } catch (error) {
        return res.status(500).json({ message: "Unable to send verification email, please try again later." });
      }
    }
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  //create a new user
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const newUser = new User({
    username,
    email,
    password: hashedPass,
    verificationToken,
    verificationTokenExpiry,
  });

  try {
    await newUser.save();

    const verifyUrl = `${req.protocol}://${req.get("host")}/api/users/verify/${verificationToken}`;

    const message = `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #0a0a0a; color: #E8E6E1; padding: 2rem; border-radius: 8px; text-align: center;">
        <div style="background-color: #141414; border: 1px solid rgba(201,168,76,0.3); border-radius: 12px; padding: 2.5rem; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
          <h2 style="font-family: Georgia, 'Times New Roman', serif; color: #C9A84C; margin-bottom: 1rem;">Welcome to The Silk Routes!</h2>
          <p style="font-size: 16px; margin-bottom: 1rem;">Hi ${username},</p>
          <p style="font-size: 16px; margin-bottom: 2rem;">Please click the button below to verify your email address and complete your registration.</p>
          <a href="${verifyUrl}" style="background-color: #C9A84C; color: #0a0a0a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email</a>
          <p style="font-size: 14px; margin-top: 2rem; color: #9C9690;">If you did not create an account, no further action is required.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "Verify Your Email - The Silk Routes",
        html: message,
      });

      return res.status(201).json({
        message: "Registration successful. A verification email has been sent to your email address. Please verify to log in.",
      });
    } catch (error) {
      // Rollback: delete the newly created user because email failed to send
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({ message: "Unable to send verification email, please try again later." });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// @desc    Login the user
// @route   POST /api/v1/users/auth

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //verify user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (!existingUser.isVerified) {
      res.status(400);
      throw new Error("Please verify your email address to log in.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordValid) {
      generateToken(res, existingUser._id);
      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return;
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @desc    Logout the current user
// @route   POST /api/v1/users/logout
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get the all users (for admin only)
// @route   GET /api/v1/users/
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.status(200).json(users);
});

// @desc    Get the current user
// @route   GET /api/v1/users/profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc    Get the current user
// @route   PUT /api/v1/users/profile

// const updateCurrentUserProfile = asyncHandler(async (req, res) => {
//   const currentUser = await User.findById(req.user._id);

//   if (!currentUser) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   if (currentUser) {
//     // Check if the request body includes a new password
//     if (req.body.password) {
//       // Hash the new password with bcrypt
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(req.body.password, salt);

//       req.body.password = hashedPassword;
//     }

//     // Update the user's profile, including the hashed password if it was provided
//     const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
//       new: true,
//     });

//     res.json(updatedUser);
//   }
// });

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // Check if the request body includes a new password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete the user by id (admin only)
// @route   DELETE /api/v1/users/:id
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user) {
    // Check, If the user is an admin
    if (user.admin) {
      res.status(400);
      throw new Error("Can not delete Admin");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200);
    res.json({ message: "successfully deleted!" });
  }
});

// @desc    Get the user by id (admin only)
// @route   GET /api/v1/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user) {
    res.status(200);
    res.json(user);
  }
});

// @desc    Update the user by id (admin only)
// @route   PUT /api/v1/users/:id
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Verify user email
// @route   GET /api/v1/users/verify/:token
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  res.send(`
    <html>
      <head>
        <title>Email Verified - The Silk Routes</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@300;400;600&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background-color: #0a0a0a;
            color: #E8E6E1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background-color: #141414;
            padding: 3rem 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 30px rgba(201, 168, 76, 0.1);
            text-align: center;
            max-width: 450px;
            border: 1px solid rgba(201, 168, 76, 0.3);
            animation: fadeIn 0.8s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          h1 {
            font-family: 'Cormorant Garamond', serif;
            color: #C9A84C;
            margin-bottom: 1.5rem;
            font-size: 2.2rem;
            font-weight: 700;
          }
          p {
            color: #E8E6E1;
            line-height: 1.6;
            margin-bottom: 2.5rem;
            font-weight: 300;
          }
          .btn {
            background-color: #C9A84C;
            color: #0a0a0a;
            text-decoration: none;
            padding: 0.8rem 2.5rem;
            border-radius: 6px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: background-color 0.3s;
            display: inline-block;
          }
          .btn:hover {
            background-color: #B8963E;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Email Verified Successfully!</h1>
          <p>Thank you for verifying your email address. Your The Silk Routes account is now active and you can log in.</p>
          <a href="http://localhost:5173/login" class="btn">Proceed to Login</a>
        </div>
      </body>
    </html>
  `);
});

// @desc    Forgot Password
// @route   POST /api/v1/users/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Please provide an email address");
  }

  const user = await User.findOne({ email });

  // Generic success message to prevent email enumeration
  const successMessage = "If an account exists with this email, a reset link has been sent.";

  if (!user) {
    return res.status(200).json({ message: successMessage });
  }

  // Generate secure token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token to store in DB
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

  await user.save();

  // Construct email
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
  const actualResetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #0a0a0a; color: #E8E6E1; padding: 2rem; border-radius: 8px; text-align: center;">
      <div style="background-color: #141414; border: 1px solid rgba(201,168,76,0.3); border-radius: 12px; padding: 2.5rem; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        <h2 style="font-family: Georgia, 'Times New Roman', serif; color: #C9A84C; margin-bottom: 1rem;">Reset Your Password</h2>
        <p style="font-size: 16px; margin-bottom: 1rem;">Hi ${user.username},</p>
        <p style="font-size: 16px; margin-bottom: 2rem;">Please click the button below to reset your password. This link is valid for 1 hour.</p>
        <a href="${actualResetUrl}" style="background-color: #C9A84C; color: #0a0a0a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        <p style="font-size: 14px; margin-top: 2rem; color: #9C9690;">If you did not request a password reset, please ignore this email.</p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request - The Silk Routes",
      html: message,
    });

    res.status(200).json({ message: successMessage });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("There was an error sending the email. Try again later.");
  }
});

// @desc    Reset Password
// @route   POST /api/v1/users/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  if (!newPassword || !token) {
    res.status(400);
    throw new Error("Please provide a new password and token");
  }

  // Hash the incoming token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user by hashed token and ensure not expired
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("This reset link is invalid or has expired. Please request a new one.");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedNewPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password has been successfully reset. You can now log in." });
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
