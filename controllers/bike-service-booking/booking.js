const bike = require("../../models/bike-booking");
const Partners = require("../../models/partners");
const { notifier } = require("../NearestPartnerNotifier/controller");
const {
	bikeServiceBookingSchema,
} = require("../Validators/service-booking/validators");

const Register_MSG = {
	signupSuccess: "You are successfully signed up for the servicing.",
	signupError: "Unable to submit the data. Please try again later!!",
	noService: "No service centers are present in your location! Once they are available we will reach out to you!!"
};

const book = async (req, res, next) => {
	try {
		const booking = await bikeServiceBookingSchema.validateAsync(req.body);
		const { city } = req.body;
		const dMaps = await Partners.find({ city: city }, { map: 1, phone: 1 });
		if (dMaps.length == 0) {
			return res.status(404).json({
				reason:"no-center",
				message: Register_MSG.noService,
				success: false,
			});
		}
		const newbooking = new bike({
			...booking,
		});

		await newbooking.save();
		// console.log(booking);
		await notifier({...booking},dMaps);
		return res.status(201).json({
			message: Register_MSG.signupSuccess,
			success: true,
		});
	} catch (err) {
		let errorMsg = Register_MSG.signupError;
		if (err.isJoi === true) {
			err.status = 403;
			errorMsg = err.message;
		}
		console.log(err);
		return res.status(err.status).json({
			message: errorMsg,
			success: false,
		});
	}
};

const viewBooking = async (req, res, next) => {
	let bookings;
	try {
		bookings = await bike.find();
		if (bookings[0]) {
			return res.status(200).json({ data:{...bookings}, success: "true" });
		} else {
			return res.status(404).json({success:"false",message:"No bookings found!!"});
		}
	} catch (e) {
		return res.status(e.status).json({
			message: "Unexpected Error",
			success: false,
		});
	}
};

module.exports = {
	book,
	viewBooking,
};
