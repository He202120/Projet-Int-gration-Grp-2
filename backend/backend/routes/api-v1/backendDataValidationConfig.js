import { body } from "express-validator";

// ============================= User Routes Data Validation =============================

const userSignUpDataValidation = [
  body("name").trim().notEmpty().withMessage("A valid name must be provided."),
  body("email").isEmail().withMessage("Provide a valid email."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("A password must be provided."),
  body("telephone")
    .trim()
    .notEmpty()
    .isNumeric()
    .withMessage("A telephone number must be provided."),
  body("plate")
    .trim()
    .notEmpty()
    .withMessage("A plate must be provided."),
];

const userSignInDataValidation = [
  body("email").isEmail().withMessage("Provide a valid email."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("A valid password must be provided."),
];

// ============================= Admin Routes Data Validation =============================

const adminSignUpDataValidation = [
  body("name").trim().notEmpty().withMessage("A valid name must be provided."),
  body("email").isEmail().withMessage("Provide a valid email."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("A password must be provided."),
  body("adminRegistrationKey")
    .trim()
    .notEmpty()
    .withMessage("A valid Admin Registration Key must be provided."),
];

const adminSignInDataValidation = [
  body("email").isEmail().withMessage("Provide a valid email."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("A valid password must be provided."),
];

const adminUserBlockingDataValidation = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("A valid User Id must be provided."),
];

const adminUserUpdateDataValidation = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("A valid User Id must be provided."),
  body("name").trim().notEmpty().withMessage("A valid name must be provided."),
  body("email").isEmail().withMessage("Provide a valid email."),
];

/***********************************wilfried************************** */

const add_avisDataValidation = [
  
  body("rating")
    .notEmpty()
    .withMessage("Une note (rating) doit être fournie.")
    .isFloat({ min: 1, max: 5 })
    .withMessage("La note (rating) doit être comprise entre 1 et 5."),
  
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Un commentaire doit être fourni.")
    .isLength({ max: 500 })
    .withMessage("Le commentaire ne doit pas dépasser 500 caractères.")
];

export default add_avisDataValidation;



export {
  userSignUpDataValidation,
  userSignInDataValidation,
  adminSignUpDataValidation,
  adminSignInDataValidation,
  adminUserBlockingDataValidation,
  adminUserUpdateDataValidation,
  add_avisDataValidation
};
