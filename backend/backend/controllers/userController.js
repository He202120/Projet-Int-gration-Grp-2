//? ===================================================== User Controller =====================================================

// ===================== Importing necessary modules/files =====================
import asyncHandler from "express-async-handler";
import { BadRequestError } from "base-error-handler";

import User from "../models/userModel.js";

import Avis from "../models/avisModel.js";

import generateAuthToken from "../utils/jwtHelpers/generateAuthToken.js";
import destroyAuthToken from "../utils/jwtHelpers/destroyAuthToken.js";
import sendMail from "../utils/EmailSender/mail.js";

const authUser = asyncHandler(async (req, res) => {
  /*
     # Desc: Auth user/set token
     # Route: POST /api/v1/user/auth
     # Access: PUBLIC
    */

  const { email, password } = req.body;

  if (!email || !password) {
    // If email or password is empty, return error
    throw new BadRequestError(
      "Email or Password is missing in the request - User authentication failed."
    );
  }

  // Find the user in Db with the email and password
  const user = await User.findOne({ email: email });

  let passwordValid = false;

  if (user) {
    passwordValid = await user.matchPassword(password);
  }

  if (passwordValid) {
    // If password verified, check user-blocked status. send response back with jwt token
    const blockedUser = user.isBlocked();

    if (blockedUser) {
      throw new BadRequestError("You are not alreay accept");
    }

    // If password verified and user is not-blocked, send response back with jwt token

    generateAuthToken(res, user._id, user.email); // Middleware to Generate token and send it back in response object

    let registeredUserData = {
      name: user.name,
      email: user.email,
    };

    if (user.profileImageName) {
      registeredUserData.profileImageName = user.profileImageName;
    }

    res.status(201).json(registeredUserData);
  }

  if (!user || !passwordValid) {
    // If user or user password is not valid, send error back

    throw new BadRequestError(
      "Invalid Email or Password - User authentication failed."
    );
  }
});

const registerUser = asyncHandler(async (req, res) => {
  /*
     # Desc: Register new user
     # Route: POST /api/v1/user/auth
     # Access: PUBLIC
    */

  const {
    name,
    email,
    password,
    plate,
    telephone,
    parking,
    subscription,
    end_date,
    entrance,
  } = req.body;

  // Check if user already exist
  const userExists = await User.findOne({ email });

  // If the user already exists, throw an error
  if (userExists) {
    throw new BadRequestError("User already registered - Sign-Up Failed.");
  }

  // Store the user data to DB if the user dosen't exist already.
  const user = await User.create({
    name: name,
    email: email,
    password: password,
    plate: plate,
    telephone: telephone,
    parking: 0,
    subscription: null,
    end_date: null,
    entrance: null,
  });

  if (user) {
    // If user is created, send response back with jwt token

    // Charlier Martin
    //generateAuthToken(res, user._id, user.email); // Middleware to Generate token and send it back in response object

    const registeredUserData = {
      name: user.name,
      email: user.email,
    };

    res.status(201).json(registeredUserData);

    await sendMail(user.email, user.name, user.plate);
  } else {
    // If user was NOT Created, send error back

    throw new BadRequestError("Invalid User data - User registration failed.");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  /*
     # Desc: Logout user / clear cookie
     # Route: POST /api/v1/user/logout
     # Access: PUBLIC
    */

  destroyAuthToken(res);

  res.status(200).json({ message: "User Logged Out" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  /*
     # Desc: Get user profile
     # Route: GET /api/v1/user/profile
     # Access: PRIVATE
    */

  const user = {
    name: req.user.name,
    email: req.user.email,
    profileImageName: req.user.profileImageName,
  };

  res.status(200).json({ user });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  /*
     # Desc: Update user profile
     # Route: PUT /api/v1/user/profile
     # Access: PRIVATE
    */

  // Find the user data with user id in the request object
  const user = await User.findById(req.user._id);

  if (user) {
    // Update the user with new data if found or keep the old data itself.
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // If request has new password, update the user with the new password
    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.file) {
      user.profileImageName = req.file.filename || user.profileImageName;
    }

    const updatedUserData = await user.save();

    // Send the response with updated user data
    res.status(200).json({
      name: updatedUserData.name,
      email: updatedUserData.email,
      profileImageName: updatedUserData.profileImageName,
    });
  } else {
    throw new BadRequestError("User not found.");
  }
});

const update_Abonnement = asyncHandler(async (req, res) => {
  /*
     # Desc: Update user subscription data
     # Route: PUT /api/v1/user/set-sub
     # Access: PRIVATE
  */

  // Find the user data with user id in the request object
  const user = await User.findById(req.user._id);

  if (user) {
    // Update the user's subscription data (if provided in the request body)
    user.subscription = req.body.subscription || user.subscription;
    user.end_date = req.body.end_date || user.end_date;
    user.entrance =
      req.body.entrance !== undefined ? req.body.entrance : user.entrance;

    // Save the updated user data
    const updatedUserData = await user.save();

    // Send the response with the updated subscription data
    res.status(200).json({
      subscription: updatedUserData.subscription,
      end_date: updatedUserData.end_date,
      entrance: updatedUserData.entrance,
    });
  } else {
    throw new BadRequestError("User not found.");
  }
});

const get_Abonnement = asyncHandler(async (req, res) => {
  /*
     # Desc: Get user profile
     # Route: GET /api/v1/user/get-sub
     # Access: PRIVATE
  */

  // Récupérer l'email de l'objet reçu dans la requête
  const email = req.body.email; 
  
  if (!email) {
    throw new BadRequestError("Email is required.");
  }

  // Chercher dans le modèle User l'utilisateur correspondant à cet email
  const user = await User.findOne({ email }); // Rechercher par email

  if (user) {
    // Retourner toutes les données de l'utilisateur
    res.status(200).json({     
      subscription: user.subscription,
      end_date: user.end_date,}); // Envoyer l'objet utilisateur entier
  } else {
    throw new BadRequestError("User not found.");
  }
});

/********************************add wilfried************************************************* */
const registerAvis = asyncHandler(async (req, res) => {
  const {userId, rating, comment } = req.body;

  // Validation des champs requis
  if (!userId || !rating || !comment) {
      res.status(400);
      throw new Error('Tous les champs obligatoires (rating, comment) doivent être renseignés.');
  }

  // Création d'un nouvel avis
  try {
    const newReview = await Avis.create({
        userId: userId,
        rating: rating,
        comment: comment
      });

      res.status(201).json({
          message: 'Avis ajouté avec succès',
          review: newReview
      });
  } catch (error) {
      res.status(500);
      throw new Error('Erreur lors de l\'ajout de l\'avis : ' + error.message);
  }
});



export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  update_Abonnement,
  registerAvis,
  get_Abonnement,
};
