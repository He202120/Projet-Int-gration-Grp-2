import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    blocked: {
        type: Boolean,
        default: true
    },
    profileImageName: {
        type: String
    },
    plate: {
        type: String,
        required: true,
    },
    telephone: {
        type: Number,
        required: true,
    },
    parking: {
        type: Number,
        required: true,
    },
    subscription: {
        type: String,
    },
    end_date: {
        type: Date,
    },
    entrance: {
        type: Number,
    },
    arrival: {
        type: Date,
        default: null
    },
    num_parking: {
        type: Number,
        default: 0
    },

},{

    timestamps: true // This will automatically add timestamps for any operations done.

});


// ============= Password Hashing Middleware =============
userSchema.pre('save', async function (next) {

    if( !this.isModified('password') ) {

        next();

        // If the existing password in user schema was not modified, then avoid hashing and move to next middleware
        // This check is done here because the user schema will have other updates which dosen't involve password updation
        // in that case rehashing password will be skipped

    }

    const salt = await bcrypt.genSalt(10);

    // Hashing the new password using the salt generated by bcrypt
    this.password = await bcrypt.hash(this.password, salt);

});


// ============= Password Verifying Function =============
userSchema.methods.matchPassword = async function (userProvidedPassword) {

    const validPassword = await bcrypt.compare(userProvidedPassword, this.password);

    return validPassword;

};

// ============= Blocked Status Returning Function =============
userSchema.methods.isBlocked = function () {
    return this.blocked;
};


const User = mongoose.model('User', userSchema);

export default User;