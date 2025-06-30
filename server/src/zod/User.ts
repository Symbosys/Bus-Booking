import z from "zod"
 const userSchema = z.object({
    name:z.string({required_error:"name is required"}).min(4,{message:"name must be 4 character"}).optional(),
    email:z.string({required_error:"email is required"}).optional(),
    number:z.string({required_error:"number is required"}).min(10,{message:"number must be 10 character"}),
    otp:z.string({required_error:"opt is required"}).min(6,{message:"otp must be 6 character"}).optional(),
  


})

export default userSchema;