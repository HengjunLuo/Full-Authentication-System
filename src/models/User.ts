import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLenghth: 32,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dtb7530pl/image/upload/v1687466478/Auth/defaultUser_yb13gn.png"
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 64,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    }

});

const User=mongoose.models.User || mongoose.model("User", userSchema);

export default User;