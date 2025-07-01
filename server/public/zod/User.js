"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const userSchema = zod_1.default.object({
    name: zod_1.default.string({ required_error: "name is required" }).min(4, { message: "name must be 4 character" }).optional(),
    email: zod_1.default.string({ required_error: "email is required" }).optional(),
    number: zod_1.default.string({ required_error: "number is required" }).min(10, { message: "number must be 10 character" }),
    otp: zod_1.default.string({ required_error: "opt is required" }).min(6, { message: "otp must be 6 character" }).optional(),
});
exports.default = userSchema;
