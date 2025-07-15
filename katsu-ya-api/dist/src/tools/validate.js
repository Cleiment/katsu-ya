"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booleanFromString = exports.validate = void 0;
const errors_1 = require("../definitions/errors");
const hasOwnProperty = (field, req) => {
    return req.hasOwnProperty(field);
};
// if input have other than alphabets, number, and underscore ; return false
const hasSymbol = (field, req) => {
    return req[field]
        .toString()
        .toLowerCase()
        .match(/[^a-z_\d]|\s/g)
        ? true
        : false;
};
// if input have other than number ; return false
const hasNotNumber = (field, req) => {
    return req[field].toString().match(/\D/g) ? true : false;
};
// if input meet requirement : minimum eight characters, at least one letter, one number and one special character ; return false
const isValidPassword = (field, req) => {
    return req[field]
        .toString()
        .match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#\-?+&_])[A-Za-z\d@$!%*#\-?+&_]{8,}$/g)
        ? true
        : false;
};
const isArray = (field, req) => {
    return Array.isArray(req[field]);
};
const validation = {
    no_symbol: {
        validate: (field, req) => !hasSymbol(field, req),
        errorMessage: `Input can only include alphabets, numbers, & underscore`,
    },
    number: {
        validate: (field, req) => !hasNotNumber(field, req),
        errorMessage: `Input can only include number`,
    },
    valid_password: {
        validate: (field, req) => isValidPassword(field, req),
        errorMessage: "Input doesn't meet the requirement : minimum eight characters, at least one letter, one number and one special character (@,$,!,%,*,#,,-,?,+,&,_)",
    },
    array: {
        validate: (field, req) => isArray(field, req),
        errorMessage: "Input must be an array",
    },
};
const validate = (options, req) => {
    let validateError = {};
    options.forEach((opt) => {
        const field = typeof opt === "string" ? opt : opt.field;
        const fieldErrors = [];
        if (!hasOwnProperty(field, req)) {
            fieldErrors.push("Missing Field");
        }
        else if (typeof opt !== "string") {
            if (opt.requirements) {
                opt.requirements.forEach((val) => {
                    const { validate, errorMessage } = validation[val];
                    if (validate && !validate(opt.field, req)) {
                        fieldErrors.push(errorMessage);
                    }
                });
            }
        }
        if (fieldErrors.length > 0)
            Object.assign(validateError, { [field]: fieldErrors });
    });
    if (Object.keys(validateError).length > 0)
        throw new errors_1.ValidationError(validateError);
};
exports.validate = validate;
const booleanFromString = (value) => {
    return value == "true" ? true : false;
};
exports.booleanFromString = booleanFromString;
