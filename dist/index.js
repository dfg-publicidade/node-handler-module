"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverErrorHandle = exports.notFoundHandle = exports.errorHandle = void 0;
const errorHandle_1 = __importDefault(require("./handlers/errorHandle"));
exports.errorHandle = errorHandle_1.default;
const notFoundHandle_1 = __importDefault(require("./handlers/notFoundHandle"));
exports.notFoundHandle = notFoundHandle_1.default;
const serverErrorHandle_1 = __importDefault(require("./handlers/serverErrorHandle"));
exports.serverErrorHandle = serverErrorHandle_1.default;
