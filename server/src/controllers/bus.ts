import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../middlewares/error.middleware";
import { statusCode } from "../types/types";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { BusSchema } from "../zod/Bus";

export const createBus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Validate input
  const validData = BusSchema.parse(req.body);

  // Perform operations in a transaction
  const bus = await prisma.$transaction(async (tx) => {
    // Check if vendor exists
    const vendor = await tx.vendor.findUnique({
      where: { id: validData.vendorId },
    });
    if (!vendor) {
      return next(new ErrorResponse("Vendor not found", statusCode.Bad_Request));
    }

    // Check if bus number is unique
    const existingBus = await tx.bus.findUnique({
      where: { number: validData.number },
    });
    if (existingBus) {
      return next(new ErrorResponse("Bus number already exists", statusCode.Bad_Request));
    }

    // Create bus
    return await tx.bus.create({
      data: validData,
      include: {
        vendor: {
          select: { id: true, name: true, number: true },
        },
      },
    });
  });

  return SuccessResponse(res, "Bus created successfully", bus, statusCode.Created);
});

export const getAllBuses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Pagination and filtering
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const vendorId = req.query.vendorId ? String(req.query.vendorId) : undefined;
  const isActive =
    req.query.isActive === "true" || req.query.isActive === "false"
      ? req.query.isActive === "true"
      : undefined;
  const searchQuery = req.query.searchQuery ? String(req.query.searchQuery) : undefined;

  // Build where clause
  const where: any = {};
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { number: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
    ];
  }
  if (isActive !== undefined) where.isActive = isActive;
  if (vendorId) where.vendorId = vendorId;

  const [buses, totalBuses] = await Promise.all([
    prisma.bus.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        vendor: {
          select: { id: true, name: true, number: true },
        },
      },
    }),
    prisma.bus.count({ where }),
  ]);

  // if (page > Math.ceil(totalBuses / limit) && totalBuses > 0) {
  //   return next(new ErrorResponse("Page not found", statusCode.Not_Found));
  // }

  return SuccessResponse(res, "Buses retrieved successfully", {
    buses,
    currentPage: page,
    totalPages: Math.ceil(totalBuses / limit),
    totalBuses,
    count: buses.length
  });
});

export const getBusById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if(!id){
    return next(new ErrorResponse("Bus id is required", statusCode.Bad_Request));
  }

  const bus = await prisma.bus.findUnique({
    where: { id },
  })

  return SuccessResponse(res, "Bus retrieved successfully", bus, statusCode.OK);
})


export const updateBus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const validData = BusSchema.partial().parse(req.body);

  if(!id){
    return next(new ErrorResponse("Bus id is required", statusCode.Bad_Request));
  }

  const bus = await prisma.bus.update({
    where: { id },
    data: validData,
  })

  return SuccessResponse(res, "Bus updated successfully", bus, statusCode.OK);
})