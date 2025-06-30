import { Request, RequestHandler, Response } from "express";
import userSchema from "../zod/User";
import prisma from "../config/prisma";
import otpGenerator from "otp-generator";

export async function usersignup(req: Request, res: Response): Promise<void> {
  try {
    const { number } = req.body;

    const validData = userSchema.parse({ number });

    const existingUser = await prisma.user.findUnique({
      where: {
        number: validData.number,
      },
    });
    

    if (existingUser) {
      const otp = otpGenerator.generate(6, {
        digits: true,
      });

      await prisma.user.update({
        where: { number: validData.number },
        data: { otp },
      });

       res.json({
        message: "OTP sent successfully",
        success: true,
      });
      
    }

    await prisma.user.create({
      data: { number: validData.number },
    });

    const otp = otpGenerator.generate(6, {
      digits: true,
    });

    await prisma.user.update({
      where: { number: validData.number },
      data: { otp },
    });

    res.json({
      message: "User created and OTP sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in usersignup:", error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
}

export async function verifyotp(req: Request, res: Response):Promise<any> {
  try {
    const { number, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        number,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        message: "Invalid otp",
        success: false,
      });
    }
    return res.status(200).json({
      message: "logging successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in usersignup:", error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
}

export const GetAllUser = async (req: Request, res: Response) => {
  const user = await prisma.vendor.findMany();
  res.status(200).json({
    message: "user retrived successfully",
    success: true,
    data: user
  });
}
export async function updateUser (req:Request,res:Response){
 try {
  const {number,email,id,name}= req.body;
 const validData = userSchema.parse({number,email,id,name})


 const user = await prisma.user.findUnique({
  where: { number },
});
if (!user) {
  return res.status(404).json({
    message: "User not found",
    success: false,
  });
  
}
if (validData.number && validData.number !== user.number) {
  const existingUser = await prisma.user.findUnique({
    where: { number: validData.number },
  });
  if (existingUser) {
    res.status(400).json({
      message: "Number already in use",
      success: false,
    });
    return;
  }
}
const updatedUser = await prisma.user.update({
  where: { number },
  data: {
    number: validData.number || user.number, // Only update if provided
  },
});

res.status(200).json({
  message: "User updated successfully",
  success: true,
  data: {
    number: updatedUser.number,
  },
});
}
catch (error) {
  throw error;
 }
 

}

    