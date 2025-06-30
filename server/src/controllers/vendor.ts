
import { Request, Response } from "express";
import prisma from "../config/prisma";
import otpGenerator from "otp-generator";
import vendorSchema from "../zod/vendor";

export async function vendorsignup(req: Request, res: Response): Promise<void> {
  try {
    const { number } = req.body;

    const validData = vendorSchema.parse({ number });

    const existingvendor = await prisma.user.findUnique({
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

      res.json({
        message: "OTP sent successfully",
        success: true,
      });
      return;
    }

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
  } catch (error) {
    console.error("Error in usersignup:", error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
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
export async function updateVendor (req:Request,res:Response){
  try {
   const {number,email,id,name}= req.body;
  const validData = vendorSchema.parse({number,email,id,name})
 
 
  const vendor = await prisma.vendor.findUnique({
   where: { number },
 });
 if (!vendor) {
   return res.status(404).json({
     message: "vendor not found",
     success: false,
   });
   
 }
 if (validData.number && validData.number !== vendor.number) {
   const existingvendor = await prisma.vendor.findUnique({
     where: { number: validData.number },
   });
   if (existingvendor) {
     res.status(400).json({
       message: "Number already in use",
       success: false,
     });
     return;
   }
 }
 const updatedvendor = await prisma.vendor.update({
   where: { number },
   data: {
     number: validData.number || vendor.number, // Only update if provided
   },
 });
 
 res.status(200).json({
   message: "Vendor updated successfully",
   success: true,
   data: {
     number: updatedvendor.number,
   },
 });
 }
 catch (error) {
   throw error;
  }
  
 
 }
 