import { NextFunction, Request, Response } from "express";
import {BusSchema} from "../zod/Bus";
import prisma from "../config/prisma";
import { ErrorResponse } from "../utils/response.util";

export async function createBus(req: Request, res: Response, next: NextFunction) {
    const { name, number, acType, seaterType, deckType, time, isActive, vendorId } = req.body;
  
    // Validate input
    const validData = BusSchema.parse({
      name,
      number,
      acType,
      seaterType,
      deckType,
      time,
      isActive,
      vendorId,
    });
  
    // Check if vendor exists
    const vendor = await prisma.vendor.findUnique({ where: { id: validData.vendorId } });
    if (!vendor) {
      return next(new ErrorResponse("Vendor not found", 400))
    }
  
    // Check if bus number is unique
    const existingBus = await prisma.bus.findUnique({ where: { number: validData.number } });
    if (existingBus) {
      throw new Error("Bus number already exists");
    }
  
    // Create bus
    const bus = await prisma.bus.create({
      data:  validData,
      include: {
        vendor: {
          select: { id: true, name: true, number: true },
        },
      },
    });
  
    res.status(201).json({
      message: "Bus created successfully",
      success: true,
      data: bus,
    });
  }
  export async function getAllBuses(req: Request, res: Response): Promise<void> {
    const buses = await prisma.bus.findMany({
      include: {
        vendor: {
          select: { id: true, name: true, number: true },
        },
      },
    });
  
    res.status(200).json({
      message: "Buses retrieved successfully",
      success: true,
      data: buses,
    });
  }