import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import { asyncHandler } from "../middlewares/error.middleware";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { statusCode } from "../types/types";
import { RouteSchema } from "../zod/Bus";

export const getAllRoutes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Pagination and filtering
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const busId = req.query.busId ? String(req.query.busId) : undefined;
  const searchQuery = req.query.searchQuery ? String(req.query.searchQuery) : undefined;

  // Build where clause
  const where: any = {};
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { source: { contains: searchQuery, mode: "insensitive" } },
      { destination: { contains: searchQuery, mode: "insensitive" } },
    ];
  }
  if (busId) where.busId = busId;

  const [routes, totalRoutes] = await Promise.all([
    prisma.route.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        bus: { select: { id: true, name: true } },
        segments: { select: { id: true, startLocation: true, endLocation: true } },
        bookings: { select: { id: true } },
      },
    }),
    prisma.route.count({ where }),
  ]);

  if (page > Math.ceil(totalRoutes / limit) && totalRoutes > 0) {
    return next(new ErrorResponse("Page not found", statusCode.Not_Found));
  }

  return SuccessResponse(res, "Routes retrieved successfully", {
    routes,
    currentPage: page,
    totalPages: Math.ceil(totalRoutes / limit),
    totalRoutes,
    count: routes.length,
    hasNextPage: page * limit < totalRoutes,
    hasPrevPage: page > 1,
  });
});

export const getRouteById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse("Route ID is required", statusCode.Bad_Request));
  }

  const route = await prisma.route.findUnique({
    where: { id },
    include: {
      bus: { select: { id: true, name: true } },
      segments: { select: { id: true, startLocation: true, endLocation: true } },
      bookings: { select: { id: true } },
    },
  });

  if (!route) {
    return next(new ErrorResponse("Route not found", statusCode.Not_Found));
  }

  return SuccessResponse(res, "Route retrieved successfully", route, statusCode.OK);
});

export const createRoute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validData = RouteSchema.parse(req.body);

  const route = await prisma.$transaction(async (tx) => {
    // Check if bus exists
    const bus = await tx.bus.findUnique({
      where: { id: validData.busId },
    });
    if (!bus) {
      return next(new ErrorResponse("Bus not found", statusCode.Bad_Request));
    }

    // Check if route with same source and destination exists for this bus
    const existingRoute = await tx.route.findFirst({
      where: {
        busId: validData.busId,
        source: validData.source,
        destination: validData.destination,
      },
    });
    if (existingRoute) {
      return next(new ErrorResponse("Route with this source and destination already exists for this bus", statusCode.Bad_Request));
    }

    // Create route
    return await tx.route.create({
      data: validData,
      include: {
        bus: { select: { id: true, name: true } },
      },
    });
  });

  return SuccessResponse(res, "Route created successfully", route, statusCode.Created);
});

export const updateRoute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const validData = RouteSchema.partial().parse(req.body);

  if (!id) {
    return next(new ErrorResponse("Route ID is required", statusCode.Bad_Request));
  }

  const route = await prisma.$transaction(async (tx) => {
    // Check if route exists
    const existingRoute = await tx.route.findUnique({
      where: { id },
    });
    if (!existingRoute) {
      return next(new ErrorResponse("Route not found", statusCode.Not_Found));
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

    // Check for duplicate source/destination (if provided)
    if (validData.source && validData.destination && validData.busId) {
      const existingRoute = await tx.route.findFirst({
        where: {
          busId: validData.busId,
          source: validData.source,
          destination: validData.destination,
          NOT: { id },
        },
      });
      if (existingRoute) {
        return next(new ErrorResponse("Route with this source and destination already exists for this bus", statusCode.Bad_Request));
      }
    }

    // Update route
    return await tx.route.update({
      where: { id },
      data: validData,
      include: {
        bus: { select: { id: true, name: true } },
      },
    });
  });

  return SuccessResponse(res, "Route Iupdated successfully", route, statusCode.OK);
});

export const deleteRoute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse("Route ID is required", statusCode.Bad_Request));
  }

  const route = await prisma.route.findUnique({
    where: { id },
  });
  if (!route) {
    return next(new ErrorResponse("Route not found", statusCode.Not_Found));
  }

  // Check for dependent bookings
  const bookings = await prisma.booking.findFirst({
    where: { routeId: id },
  });
  if (bookings) {
    return next(new ErrorResponse("Cannot delete route with active bookings", statusCode.Bad_Request));
  }

  await prisma.route.delete({
    where: { id },
  });

  return SuccessResponse(res, "Route deleted successfully", {}, statusCode.OK);
});