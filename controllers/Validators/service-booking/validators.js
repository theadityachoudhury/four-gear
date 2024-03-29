const Joi = require("joi");

const bikeServiceBookingSchema = Joi.object({
	bookingDetails: Joi.object({
		name: Joi.string().required(),
		phone: Joi.number().required(),
		email: Joi.string().email().required(),
		city: Joi.string().required(),
		bike_Company: Joi.string().required(),
		bike_Model: Joi.string().required(),
	}),
	address: Joi.object({
		address: Joi.string().required(),
		street: Joi.string().required(),
		landmark: Joi.string().required(),
	}),
	map: Joi.object({
		longitude: Joi.number().required(),
		latitude: Joi.number().required(),
	}).required(),
});

module.exports = {
	bikeServiceBookingSchema,
};
