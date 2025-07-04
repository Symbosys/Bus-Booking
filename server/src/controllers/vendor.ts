
import { Request, Response } from "express";
import prisma from "../config/prisma";
import otpGenerator from "otp-generator";
import vendorSchema from "../zod/vendor";
import { ErrorResponse } from "../utils/response.util";
import { asyncHandler } from "../middlewares/error.middleware";

export async function vendorsignup(req: Request, res: Response) {
    const { number } = req.body;

    const validData = vendorSchema.parse({ number });

    const existingvendor = await prisma.vendor.findUnique({
      where: {
        number: validData.number,
      },
    });
    4;

    if (existingvendor) {
      const otp = otpGenerator.generate(6, {
        digits: true,
      });

      await prisma.vendor.update({
        where: { number: validData.number },
        data: { otp },
      });

      return res.json({
        message: "OTP sent successfully",
        success: true,
        
      });
    }else {
      await prisma.vendor.create({
        data: { number: validData.number },
      });
  
      const otp = otpGenerator.generate(6, {
        digits: true,
      });
  
      await prisma.vendor.update({
        where: { number: validData.number },
        data: { otp },
      });
  
      res.json({
        message: "User created and OTP sent successfully",
        success: true,
      });
    }
}

export async function verifyotp(req: Request, res: Response) {
  try {
    const { number, otp } = req.body;

    const vendor = await prisma.vendor.findUnique({
      where: {
        number,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        message: "vendor not found",
        success: false,
      });
    }
    if (otp !== vendor.otp) {
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
    console.error("Error in vendorsignup:", error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
}

export async function GetALlvendor(req: Request, res: Response) {
  try {
    const vendor = await prisma.vendor.findMany();
    return res.json({
      message: "true",
      success: true,
      data: vendor
    });
  } catch (error) {
    console.error("Error in GetALlvendor:", error);
    res.status(500).json({
      message: "Failed to retrieve users",
      success: false,
    });
  }
}
export const updateVendor = asyncHandler(async (req, res, next) => {
  const id = req.vendor?.id
  if(!id){
    return next(new ErrorResponse("id is required", 400))
  }

  const validData = vendorSchema.partial().parse(req.body);
  if(validData.email){
    const existingvendorWithEmail = await prisma.vendor.findUnique({
      where: {
        email: validData.email
      }
    })
    if(existingvendorWithEmail) {
      return next(new ErrorResponse("User with this email already exists", 400))
    }
  }
  if(validData.number){
    const existingvendorWithEmail = await prisma.vendor.findUnique({
      where: {
        email: validData.number
      }
    })
    if(existingvendorWithEmail) {
      return next(new ErrorResponse("User with this number already exists", 400))
    }
  }

  const user = await prisma.vendor.update({
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