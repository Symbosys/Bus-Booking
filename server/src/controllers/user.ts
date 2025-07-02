import { NextFunction, Request, Response } from "express";
import userSchema from "../zod/User";
import prisma from "../config/prisma";
import otpGenerator from "otp-generator";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { asyncHandler } from "../middlewares/error.middleware";

export async function usersignup(req: Request, res: Response) {
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
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
      });

      await prisma.user.update({
        where: { number: validData.number },
        data: { otp },
      });

       res.json({
        message: "OTP sent successfully",
        success: true,
        otp
      });
      
    } else {
      await prisma.user.create({
        data: { number: validData.number },
      });
  
      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
      });

  
      await prisma.user.update({
        where: { number: validData.number },
        data: { otp },
      });
  
      res.json({
        message: "OTP sent successfully",
        success: true,
        otp
      });
    }
}

export async function verifyotp(req: Request, res: Response, next: NextFunction){
    const { number, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        number,
      },
    });

    if (!user) {
      return next(new ErrorResponse("User not found", 400))
    }
    if (otp !== user.otp) {
      return next(new ErrorResponse("Invalid OTP", 400))
    }

    return SuccessResponse(res, "Logedin successfully")
}

export const GetAllUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  res.status(200).json({
    message: "user retrived successfully",
    success: true,
    data: user
  });
}

    
 export const updateUser = asyncHandler(async (req, res, next) => {
  const id = req.user?.id
  if(!id){
    return next(new ErrorResponse("id is required", 400))
  }

  const validData = userSchema.partial().parse(req.body);
  if(validData.email){
    const existingUserWithEmail = await prisma.user.findUnique({
      where: {
        email: validData.email
      }
    })
    if(existingUserWithEmail) {
      return next(new ErrorResponse("User with this email already exists", 400))
    }
  }
  if(validData.number){
    const existingUserWithEmail = await prisma.user.findUnique({
      where: {
        number: validData.number
      }
    })
    if(existingUserWithEmail) {
      return next(new ErrorResponse("User with this number already exists", 400))
    }
  }

  const user = await prisma.user.update({
    where: {
      id
    }, data: validData
  })

  return res.status(200).json({
    message: "User updated succesfully",
    success: true,
    data: user
  })
})