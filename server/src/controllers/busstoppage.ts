import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../middlewares/error.middleware";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { statusCode } from "../types/types";
import { BusStoppageSchema } from "../zod/Bus";

export const getAllBusStops = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Pagination and filtering
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const busId = req.query.busId ? String(req.query.busId) : undefined;
  const status = req.query.status ? String(req.query.status) : undefined;
  const searchQuery = req.query.searchQuery ? String(req.query.searchQuery) : undefined;

  // Build where clause
  const where: any = {};
  if (searchQuery) {
    where.OR = [
      { busStandName: { contains: searchQuery, mode: "insensitive" } },
    ];
  }
  if (busId) where.busId = busId;
  if (status) {
    where.status = { equals: status, mode: "insensitive" };
  }

  const [busStops, totalBusStops] = await Promise.all([
    prisma.busStoppage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        bus: { select: { id: true, name: true } },
      },
    }),
    prisma.busStoppage.count({ where }),
  ]);

  if (page > Math.ceil(totalBusStops / limit) && totalBusStops > 0) {
    return next(new ErrorResponse("Page not found", statusCode.Not_Found));
  }

  return SuccessResponse(res, "Bus stops retrieved successfully", {
    busStops,
    currentPage: page,
    totalPages: Math.ceil(totalBusStops / limit),
    totalBusStops,
    count: busStops.length,
    hasNextPage: page * limit < totalBusStops,
    hasPrevPage: page > 1,
  });
});

export const getBusStopById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse("Bus stop ID is required", statusCode.Bad_Request));
  }

  const busStop = await prisma.busStoppage.findUnique({
    where: { id },
    include: {
      bus: { select: { id: true, name: true } },
    },
  });

  if (!busStop) {
    return next(new ErrorResponse("Bus stop not found", statusCode.Not_Found));
  }

  return SuccessResponse(res, "Bus stop retrieved successfully", busStop, statusCode.OK);
});

export const createBusStop = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validData = BusStoppageSchema.parse(req.body);

  const busStop = await prisma.$transaction(async (tx) => {
    // Check if bus exists
    const bus = await tx.bus.findUnique({
      where: { id: validData.busId },
    });
    if (!bus) {
      return next(new ErrorResponse("Bus not found", statusCode.Bad_Request));
    }

    // Create bus stop
    return await tx.busStoppage.create({
      data: {
        ...validData,
        arrivalTime: validData.arrivalTime ? new Date(validData.arrivalTime) : null,
        departureTime: validData.departureTime ? new Date(validData.departureTime) : null,
      },
      include: {
        bus: { select: { id: true, name: true } },
      },
    });
  });

  return SuccessResponse(res, "Bus stop created successfully", busStop, statusCode.Created);
});

export const updateBusStop = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const validData = BusStoppageSchema.partial().parse(req.body);

  if (!id) {
    return next(new ErrorResponse("Bus stop ID is required", statusCode.Bad_Request));
  }

  const busStop = await prisma.$transaction(async (tx) => {
    // Check if bus stop exists
    const existingBusStop = await tx.busStoppage.findUnique({
      where: { id },
    });
    if (!existingBusStop) {
      return next(new ErrorResponse("Bus stop not found", statusCode.Not_Found));
    }

    // Check if bus exists (if busId is provided)
    if (validData.busId) {
      const bus = await tx.bus.findUnique({
        where: { id: validData.busId },
      });
      if (!bus) {
        return next(new ErrorResponse("Bus not found", statusCode.Bad_Request));
      }
    }

    // Update bus stop
    return await tx.busStoppage.update({
      where: { id },
      data: {
        ...validData,
        arrivalTime: validData.arrivalTime ? new Date(validData.arrivalTime) : undefined,
        departureTime: validData.departureTime ? new Date(validData.departureTime) : undefined,
      },
      include: {
        bus: { select: { id: true, name: true } },
      },
    });
  });

  return SuccessResponse(res, "Bus stop updated successfully", busStop, statusCode.OK);
});

export const deleteBusStop = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse("Bus stop ID is required", statusCode.Bad_Request));
  }

  const busStop = await prisma.busStoppage.findUnique({
    where: { id },
  });
  if (!busStop) {
    return next(new ErrorResponse("Bus stop not found", statusCode.Not_Found));
  }

  await prisma.busStoppage.delete({
    where: { id },
  });

  return SuccessResponse(res, "Bus stop deleted successfully", {}, statusCode.OK);
});