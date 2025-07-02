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
exports.updateUser = exports.GetAllUser = void 0;
exports.usersignup = usersignup;
exports.verifyotp = verifyotp;
const User_1 = __importDefault(require("../zod/User"));
const prisma_1 = __importDefault(require("../config/prisma"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const response_util_1 = require("../utils/response.util");
const error_middleware_1 = require("../middlewares/error.middleware");
function usersignup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { number } = req.body;
        const validData = User_1.default.parse({ number });
        const existingUser = yield prisma_1.default.user.findUnique({
            where: {
                number: validData.number,
            },
        });
        if (existingUser) {
            const otp = otp_generator_1.default.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            yield prisma_1.default.user.update({
                where: { number: validData.number },
                data: { otp },
            });
            res.json({
                message: "OTP sent successfully",
                success: true,
                otp
            });
        }
        else {
            yield prisma_1.default.user.create({
                data: { number: validData.number },
            });
            const otp = otp_generator_1.default.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            yield prisma_1.default.user.update({
                where: { number: validData.number },
                data: { otp },
            });
            res.json({
                message: "OTP sent successfully",
                success: true,
                otp
            });
        }
    });
}
function verifyotp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { number, otp } = req.body;
        const user = yield prisma_1.default.user.findUnique({
            where: {
                number,
            },
        });
        if (!user) {
            return next(new response_util_1.ErrorResponse("User not found", 400));
        }
        if (otp !== user.otp) {
            return next(new response_util_1.ErrorResponse("Invalid OTP", 400));
        }
        return (0, response_util_1.SuccessResponse)(res, "Logedin successfully");
    });
}
const GetAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findMany();
    res.status(200).json({
        message: "user retrived successfully",
        success: true,
        data: user
    });
});
exports.GetAllUser = GetAllUser;
exports.updateUser = (0, error_middleware_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!id) {
        return next(new response_util_1.ErrorResponse("id is required", 400));
    }
    const validData = User_1.default.partial().parse(req.body);
    if (validData.email) {
        const existingUserWithEmail = yield prisma_1.default.user.findUnique({
            where: {
                email: validData.email
            }
        });
        if (existingUserWithEmail) {
            return next(new response_util_1.ErrorResponse("User with this email already exists", 400));
        }
    }
    if (validData.number) {
        const existingUserWithEmail = yield prisma_1.default.user.findUnique({
            where: {
                number: validData.number
            }
        });
        if (existingUserWithEmail) {
            return next(new response_util_1.ErrorResponse("User with this number already exists", 400));
        }
    }
    const user = yield prisma_1.default.user.update({
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
