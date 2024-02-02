const Joi = require('joi');

const productAddSchema = Joi.object({
    nameOfProduct: Joi.string()
        .min(3)
        .max(100)
        .trim()
        .required(),
    shortDescription: Joi.string()
        .min(5)
        .max(500)
        .optional()
        .trim(),
    price: Joi.number()
        .min(0)
        .required(),
    createAt: Joi.date()
        .default(Date.now),
    lastUpdateAt: Joi.date()
        .default(Date.now),
    expiryDate: Joi.date()
        .required()
})

const productUpdateSchema = Joi.object({
    nameOfProduct: Joi.string()
        .min(3)
        .max(100)
        .trim()
        .required(),
    shortDescription: Joi.string()
        .min(5)
        .max(500)
        .optional()
        .trim(),
    price: Joi.number()
        .min(0)
        .required(),
    createAt: Joi.date()
        .default(Date.now),
    expiryDate: Joi.date()
        .required()
})

async function AddProductValidationMW(req, res, next) {
    const productPayLoad = req.body

    try {
        await productAddSchema.validateAsync(productPayLoad)
        next()
    } catch (error) {
        next({
            message: error.details[0].message,
            status: 400
        })
    }
}

async function UpdateProductValidationMW(req, res, next) {
    const productPayLoad = req.body

    try {
        await productUpdateSchema.validateAsync(productPayLoad)
        next()
    } catch (error) {
        next({
            message: error.details[0].message,
            status: 400
        })
    }
}

module.exports = {
    AddProductValidationMW,
    UpdateProductValidationMW
}
