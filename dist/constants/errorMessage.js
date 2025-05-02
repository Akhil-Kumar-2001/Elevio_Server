"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = void 0;
var ERROR_MESSAGES;
(function (ERROR_MESSAGES) {
    ERROR_MESSAGES["INTERNAL_SERVER_ERROR"] = "An unexpected error occurred. Please try again later.";
    ERROR_MESSAGES["BAD_REQUEST"] = "The request could not be understood or was missing required parameters.";
    ERROR_MESSAGES["UNAUTHORIZED"] = "You are not authorized to access this resource.";
    ERROR_MESSAGES["FORBIDDEN"] = "You are not allowed to perform this action.";
    ERROR_MESSAGES["NOT_FOUND"] = "The requested resource could not be found.";
    ERROR_MESSAGES["INVALID_INPUT"] = "The request contains invalid data.";
})(ERROR_MESSAGES || (exports.ERROR_MESSAGES = ERROR_MESSAGES = {}));
