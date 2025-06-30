import { Request, Response } from "express";
import BusSchema from "../zod/Bus";
import prisma from "../config/prisma";

export async function createBus(req: Request, res: Response): Promise<void> {
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
      throw new Error("Vendor not found");
    }
  
    // Check if bus number is unique
    const existingBus = await prisma.bus.findUnique({ where: { number: validData.number } });
    if (existingBus) {
      throw new Error("Bus number already exists");
    }
  
    // Create bus
    const bus = await prisma.bus.create({
      data: {
        name: validData.name,
        number: validData.number,
        acType: validData.acType,
        seaterType: validData.seaterType,
        deckType: validData.deckType,
        time: validData.time,
        isActive: validData.isActive,
        vendorId: validData.vendorId,
      },
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