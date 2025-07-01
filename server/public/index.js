"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./controllers/user");
const vendor_1 = require("./controllers/vendor");
const bus_1 = require("./controllers/bus");
// import { bookSeat } from "./controllers/seat";
const error_middleware_1 = __importStar(require("./middlewares/error.middleware"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", function (req, res) {
    res.json({
        message: "hello world"
    });
});
// user API
app.post("/user/send-otp", (0, error_middleware_1.asyncHandler)(user_1.usersignup));
app.post("/user/verify-otp", (0, error_middleware_1.asyncHandler)(user_1.verifyotp));
app.get("/user/all", (0, error_middleware_1.asyncHandler)(user_1.GetAllUser));
app.put("/user/update", user_1.updateUser);
// vendor API
app.post("/vendor/signup", (0, error_middleware_1.asyncHandler)(vendor_1.vendorsignup));
app.post("/vendor/verify-otp", (0, error_middleware_1.asyncHandler)(user_1.verifyotp));
app.get("/vendor/all", (0, error_middleware_1.asyncHandler)(user_1.GetAllUser));
app.put("/vendor/update", vendor_1.updateVendor);
// bus API
app.post("/bus/create", bus_1.createBus);
app.post("/bus/all", bus_1.getAllBuses);
//seat Api
// app.post("/bus/book",bookSeat)
// ErrorMiddleware
app.use(error_middleware_1.default);
app.listen(4000, function () {
    console.log("server started");
});
