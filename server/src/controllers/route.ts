import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Get all routes
export const getAllRoutes = async (req: Request, res: Response) => {
  const routes = await prisma.route.findMany({
    include: {
      bus: { select: { id: true, name: true } },
      segments: { select: { id: true,   startLocation: true, endLocation: true } },
      bookings: { select: { id: true } },
    },
  });
  res.status(200).json(routes);
};

// Get a single route by ID
export const getRouteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const route = await prisma.route.findUnique({
    where: { id },
    include: {
      bus: { select: { id: true, name: true } },
      segments: { select: { id: true,   startLocation: true, endLocation: true } },
      bookings: { select: { id: true } },
    },
  });
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.status(200).json(route);
};

// Create a new route
export const createRoute = async (req: Request, res: Response) => {
  const { name, source, destination, distance, price, busId } = req.body;
  const route = await prisma.route.create({
    data: {
      name,
      source,
      destination,
      distance: Number(distance),
      price: Number(price),
      busId,
    },
    include: {
      bus: { select: { id: true, name: true } },
    },
  });
  res.status(201).json(route);
};

// Update a route
export const updateRoute = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, source, destination, distance, price, busId } = req.body;
  const route = await prisma.route.update({
    where: { id },
    data: {
      name,
      source,
      destination,
      distance: Number(distance),
      price: Number(price),
      busId,
    },
    include: {
      bus: { select: { id: true, name: true } },
    },
  });
  res.status(200).json(route);
};

// Delete a route
export const deleteRoute = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.route.delete({
    where: { id },
  });
  res.status(204).send();
};