import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";



// User Schema Model - (Name, email, password, creation Date) with validation rules
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
        trim : true,
        minlength:3,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim : true,
        lowercase: true,
        validate : validator.isEmail,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength : [6, "Password Must Be Atleast 6 characters"],
    }

}, { timestamps: true });


// Hash password before saving
userSchema.pre('save',async function (next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10);
    

})


userSchema.methods.comparePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}


export default mongoose.model('User', userSchema);