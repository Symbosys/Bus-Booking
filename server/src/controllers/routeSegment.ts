import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { statusCode } from "../types/types";
import { RouteSegmentSchema } from "../zod/Bus";
import prisma from "../config/prisma";

export const getAllRouteSegments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Pagination and filtering
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const routeId = req.query.routeId ? String(req.query.routeId) : undefined;
  const searchQuery = req.query.searchQuery ? String(req.query.searchQuery) : undefined;

  // Build where clause
  const where: any = {};
  if (searchQuery) {
    where.OR = [
      { startLocation: { contains: searchQuery, mode: "insensitive" } },
      { endLocation: { contains: searchQuery, mode: "insensitive" } },
    ];
  }
  if (routeId) where.routeId = routeId;

  const [routeSegments, totalRouteSegments] = await Promise.all([
    prisma.routeSegment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { sequence: "asc" }, // Sort by sequence for logical order
      include: {
        route: { select: { id: true, name: true } },
        boardingBookings: { select: { id: true } },
        alightingBookings: { select: { id: true } },
      },
    }),
    prisma.routeSegment.count({ where }),
  ]);

  if (page > Math.ceil(totalRouteSegments / limit) && totalRouteSegments > 0) {
    return next(new ErrorResponse("Page not found", statusCode.Not_Found));
  }

  return SuccessResponse(res, "Route segments retrieved successfully", {
    routeSegments,
    currentPage: page,
    totalPages: Math.ceil(totalRouteSegments / limit),
    totalRouteSegments,
    count: routeSegments.length,
    hasNextPage: page * limit < totalRouteSegments,
    hasPrevPage: page > 1,
  });
});

export const getRouteSegmentById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse("Route segment ID is required", statusCode.Bad_Request));
  }

  const routeSegment = await prisma.routeSegment.findUnique({
    where: { id },
    include: {
      route: { select: { id: true, name: true } },
      boardingBookings: { select: { id: true } },
      alightingBookings: { select: { id: true } },
    },
  });

  if (!routeSegment) {
    return next(new ErrorResponse("Route segment not found", statusCode.Not_Found));
  }

  return SuccessResponse(res, "Route segment retrieved successfully", routeSegment, statusCode.OK);
});

export const createRouteSegment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validData = RouteSegmentSchema.parse(req.body);

  const routeSegment = await prisma.$transaction(async (tx) => {
    // Check if route exists
    const route = await tx.route.findUnique({
      where: { id: validData.routeId },
    });
    if (!route) {
      return next(new ErrorResponse("Route not found", statusCode.Bad_Request));
    }

    // Check for duplicate sequence in the same route
    const existingSegment = await tx.routeSegment.findFirst({
      where: {
        routeId: validData.routeId,
        sequence: validData.sequence,
      },
    });
    if (existingSegment) {
      return next(new ErrorResponse("A segment with this sequence already exists for this route", statusCode.Bad_Request));
    }

    // Create route segment
    return await tx.routeSegment.create({
      data: {
        ...validData,
        arrivalTime: validData.arrivalTime ? new Date(validData.arrivalTime) : null,
        departureTime: validData.departureTime ? new Date(validData.departureTime) : null,
      },
      include: {
        route: { select: { id: true, name: true } },
      },
    });
  });

  return SuccessResponse(res, "Route segment created successfully", routeSegment, statusCode.Created);
});

export const updateRouteSegment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const validData = RouteSegmentSchema.partial().parse(req.body);

  if (!id) {
    return next(new ErrorResponse("Route segment ID is required", statusCode.Bad_Request));
  }

  const routeSegment = await prisma.$transaction(async (tx) => {
    // Check if route segment exists
    const existingSegment = await tx.routeSegment.findUnique({
      where: { id },
    });
    if (!existingSegment) {
      return next(new ErrorResponse("Route segment not found", statusCode.Not_Found));
    }

    // Check if route exists (if routeId is provided)
    if (validData.routeId) {
      const route = await tx.route.findUnique({
        where: { id: validData.routeId },
      });
      if (!route) {
        return next(new ErrorResponse("Route not found", statusCode.Bad_Request));
      }
    }

    // Check for duplicate sequence (if sequence is provided)
    if (validData.sequence && validData.routeId) {
      const existingSegment = await tx.routeSegment.findFirst({
        where: {
          routeId: validData.routeId,
          sequence: validData.sequence,
          NOT: { id },
        },
      });
      if (existingSegment) {
        return next(new ErrorResponse("A segment with this sequence already exists for this route", statusCode.Bad_Request));
      }
    }

    // Update route segment
    return await tx.routeSegment.update({
      where: { id },
      data: {
        ...validData,
        arrivalTime: validData.arrivalTime ? new Date(validData.arrivalTime) : undefined,
        departureTime: validData.departureTime ? new Date(validData.departureTime) : undefined,
      },
      include: {
        route: { select: { id: true, name: true } },
      },
    });
  });

  return SuccessResponse(res, "Route segment updated successfully", routeSegment, statusCode.OK);
});

export const deleteRouteSegment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorResponse("Route segment ID is required", statusCode.Bad_Request));
  }

  const routeSegment = await prisma.routeSegment.findUnique({
    where: { id },
  });
  if (!routeSegment) {
    return next(new ErrorResponse("Route segment not found", statusCode.Not_Found));
  }

  // Check for dependent bookings
  const bookings = await prisma.booking.findFirst({
    where: {
      OR: [
        { boardingSegmentId: id },
        { alightingSegmentId: id },
      ],
    },
  });
  if (bookings) {
    return next(new ErrorResponse("Cannot delete route segment with active bookings", statusCode.Bad_Request));
  }

  await prisma.routeSegment.delete({
    where: { id },
  });

  return SuccessResponse(res, "Route segment deleted successfully", {}, statusCode.OK);
});