"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateVendor = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_util_1 = require("../utils/jwt.util");
const response_util_1 = require("../utils/response.util");
const error_middleware_1 = require("./error.middleware");
exports.authenticateVendor = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const tokenFromCookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    const tokenFromHeader = ((_c = (_b = req.headers["authorization"]) === null || _b === void 0 ? void 0 : _b.split("Bearer ")[1]) === null || _c === void 0 ? void 0 : _c.trim()) ||
        ((_e = (_d = req.headers.cookie) === null || _d === void 0 ? void 0 : _d.split("=")[1]) === null || _e === void 0 ? void 0 : _e.trim());
    const tokenFromHeader2 = (_g = (_f = req.headers["authorization"]) === null || _f === void 0 ? void 0 : _f.split("Bearer ")[1]) === null || _g === void 0 ? void 0 : _g.trim();
    const token = tokenFromCookie || tokenFromHeader || tokenFromHeader2;
    if (!token) {
        return next(new response_util_1.ErrorResponse("token is required", 400));
    }
    let decoded;
    try {
        decoded = (0, jwt_util_1.verifyToken)(token);
    }
    catch (error) {
        return next(new response_util_1.ErrorResponse("Invalid or expired token", 401));
    }
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: {
            id: String(decoded.id),
        },
    });
    if (!vendor) {
        return next(new response_util_1.ErrorResponse("Vendor not found", 400));
    }
    req.vendor = {
        id: vendor.id,
        name: vendor.name || "",
        email: vendor.email || "",
        number: vendor.number,
    };
    next();
}));
