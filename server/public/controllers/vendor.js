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
exports.updateVendor = void 0;
exports.vendorsignup = vendorsignup;
exports.verifyotp = verifyotp;
exports.GetALlvendor = GetALlvendor;
const prisma_1 = __importDefault(require("../config/prisma"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const vendor_1 = __importDefault(require("../zod/vendor"));
const response_util_1 = require("../utils/response.util");
const error_middleware_1 = require("../middlewares/error.middleware");
function vendorsignup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { number } = req.body;
        const validData = vendor_1.default.parse({ number });
        const existingvendor = yield prisma_1.default.vendor.findUnique({
            where: {
                number: validData.number,
            },
        });
        4;
        if (existingvendor) {
            const otp = otp_generator_1.default.generate(6, {
                digits: true,
            });
            yield prisma_1.default.vendor.update({
                where: { number: validData.number },
                data: { otp },
            });
            return res.json({
                message: "OTP sent successfully",
                success: true,
            });
        }
        else {
            yield prisma_1.default.vendor.create({
                data: { number: validData.number },
            });
            const otp = otp_generator_1.default.generate(6, {
                digits: true,
            });
            yield prisma_1.default.vendor.update({
                where: { number: validData.number },
                data: { otp },
            });
            res.json({
                message: "User created and OTP sent successfully",
                success: true,
            });
        }
    });
}
function verifyotp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { number, otp } = req.body;
            const vendor = yield prisma_1.default.vendor.findUnique({
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
        }
        catch (error) {
            console.error("Error in vendorsignup:", error);
            res.status(500).json({
                message: "Something went wrong",
                success: false,
            });
        }
    });
}
function GetALlvendor(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vendor = yield prisma_1.default.vendor.findMany();
            return res.json({
                message: "true",
                success: true,
                data: vendor
            });
        }
        catch (error) {
            console.error("Error in GetALlvendor:", error);
            res.status(500).json({
                message: "Failed to retrieve users",
                success: false,
            });
        }
    });
}
exports.updateVendor = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    if (!id) {
        return next(new response_util_1.ErrorResponse("id is required", 400));
    }
    const existingvendor = yield prisma_1.default.user.findUnique({
        where: {
            id
        }
    });
    if (!existingvendor) {
        return next(new response_util_1.ErrorResponse("User not found", 404));
    }
    const validData = vendor_1.default.partial().parse(req.body);
    if (validData.email) {
        const existingvendorWithEmail = yield prisma_1.default.vendor.findUnique({
            where: {
                email: validData.email
            }
        });
        if (existingvendorWithEmail) {
            return next(new response_util_1.ErrorResponse("User with this email already exists", 400));
        }
    }
    if (validData.number) {
        const existingvendorWithEmail = yield prisma_1.default.vendor.findUnique({
            where: {
                email: validData.number
            }
        });
        if (existingvendorWithEmail) {
            return next(new response_util_1.ErrorResponse("User with this number already exists", 400));
        }
    }
    const user = yield prisma_1.default.vendor.update({
        where: {
            id
        }, data: validData
    });
    return res.status(200).json({
        message: "User updated succesfully",
        success: true,
        data: user
    });
}));
