import prisma from "../config/prisma";
import { statusCode } from "../types/types";
import { verifyToken } from "../utils/jwt.util";
import { ErrorResponse } from "../utils/response.util";
import { asyncHandler } from "./error.middleware";

declare global {
    namespace Express {
        interface Request {
            vendor?: {
                id: string,
                name: string, 
                email: string,
                number: string,
            }
        }
    }
}

export const authenticateVendor = asyncHandler(async (req, res, next) => {
  const tokenFromCookie = req.cookies?.token;
  const tokenFromHeader =
    req.headers["authorization"]?.split("Bearer ")[1]?.trim() ||
    req.headers.cookie?.split("=")[1]?.trim();

  const tokenFromHeader2 = req.headers["authorization"]
    ?.split("Bearer ")[1]
    ?.trim();

  const token = tokenFromCookie || tokenFromHeader || tokenFromHeader2;

  if (!token) {
    return next(new ErrorResponse("token is required", 400));
  }

  let decoded;
  try {
    decoded = verifyToken(token) as { id: number };
  } catch (error) {
    return next(
      new ErrorResponse("Invalid or expired token", 401)
    );
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: String(decoded.id),
    },
  });

  if (!vendor) {
    return next(new ErrorResponse("Vendor not found", 400));
  }

  req.vendor = {
    id: vendor.id,
    name: vendor.name || "",
    email: vendor.email || "",
    number: vendor.number,
  };

  next();
});
