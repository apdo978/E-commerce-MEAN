const mong =require("mongoose")

const userSchema = mong.Schema(
    {name:{type:String,required:true,minlength:4},
    email:{type:String,required:true, unique:true},
    password:{type:String,required:true, minlength:8},
        userType: { type: mong.Schema.Types.ObjectId, ref:'usertype'}
},{timestamps:true})

module.exports = mong.model('Users', userSchema)