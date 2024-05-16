const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { hashData } = require("../utils/authorization");

const userSchema = new Schema({
    fullName: {
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
        default: null
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpiry: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
);


// Exclude password before sending response to user
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.otp;
    delete userObject.createdAt;
    delete userObject.isVerified;
    delete userObject.updatedAt;
    delete userObject.__v;
    delete userObject.isAdmin;
    delete userObject.otpExpiry;

    return userObject;
};

// Hash Password
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await hashData(this.password);
        next();
    } catch (error) {
        next(error);
    }
});



// Verify Password
userSchema.methods.isPasswordMatch = async function (
    inputPassword
) {
    return await bcrypt.compare(inputPassword, this.password);
};

const UserModel = model("User", userSchema);

module.exports = { UserModel };