"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validate = {
    email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    URL: (url) => /^(ftp|http|https):\/\/[^ "]+$/.test(url),
    phone: (phone) => /^[0-9]+$/.test(phone),
    integer: (value) => typeof value === 'number' && Number.isInteger(value),
    positiveInteger: (value) => typeof value === 'number' && Number.isInteger(value) && value >= 0,
    string: (value) => typeof value === 'string' && value.trim() !== '',
    array: (value) => Array.isArray(value) && value.length > 0,
    object: (value) => typeof value === 'object' &&
        value !== null &&
        Object.keys(value).length > 0,
    date: (date) => !isNaN(Date.parse(date)),
    formatPhone: (phone) => {
        const inputString = phone
            .split(' ')
            .join('')
            .split('+')
            .join('')
            .split('-')
            .join('')
            .split('(')
            .join('')
            .split(')')
            .join('');
        if (inputString.startsWith('009')) {
            return inputString.slice(3);
        }
        else if (inputString.startsWith('0')) {
            return '234' + inputString.slice(1);
        }
        else {
            return inputString;
        }
    },
};
exports.default = Validate;
