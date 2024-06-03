import { body } from "express-validator";

export const inputLoginOrEmailAuthValidator = () => body('loginOrEmail')
    .exists().withMessage('Error!! Field is not exist')
    .isString().withMessage('Error!! Field should be string')
    .trim().notEmpty().withMessage('Error!! Field shouldn\'t be empty')
    .isLength({ min: 3, max: 20 }).withMessage('Error!! Invalid field length')
    .custom(value => {
        const usernameRegex = /^[a-zA-Z0-9_-]*$/;
        const isEmail = (value: string) => {
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            return emailRegex.test(value);
        };
        if (!usernameRegex.test(value) && !isEmail(value)) {
            throw new Error('Error!! Field should be a valid username or email');
        }
        return true;
    });

export const inputPasswordAuthValidator = () => body('password')
    .exists().withMessage('Error!! Field is not exist')
    .isString().withMessage('Error!! Field should be string')
    .trim().notEmpty().withMessage('Error!! Field shouldn\'t be empty')
    .isLength({ min: 6, max: 20 }).withMessage('Error!! Invalid field length')