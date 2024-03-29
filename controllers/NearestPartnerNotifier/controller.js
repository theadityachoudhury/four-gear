const Partners = require("../../models/partners");
var axios = require("axios");

const notifier = async ({ map, city, phone }, dMaps) => {
	const apiKey = "AIzaSyCWeOpv-NQZ3O4CzWTuhXTSsTyNMC9dwTU"; // Replace with your Google Maps API key
	const baseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";
	console.log("dmaps",dMaps);


	const distances = [];
	console.log("here3");
	const origins = `${map.latitude},${map.longitude}`;
	const destinationsString = dMaps
		.map((dest) => `${dest.map.latitude},${dest.map.longitude}`)
		.join("|");

	console.log(destinationsString);
	try {
		const { data } = await axios.get(baseUrl, {
			params: {
				key: apiKey,
				origins: origins,
				destinations: destinationsString,
			},
		});
		console.log("here4");
		console.log(data);
	
		if (!data || data.status === "REQUEST_DENIED") {
			console.log("here1");
			throw {
				isNotifier: true,
				status: 500,
			};
		}
	
		const response = data;
	
		for (let i = 0; i < response.rows[0].elements.length; i++) {
			const destination = dMaps[i];
			const phone = destination.phone;
			const distanceInMeters = response.rows[0].elements[i].distance.value;
	
			// Create an object with phone and distance properties
			const distanceObj = {
				phone: phone,
				distance: distanceInMeters,
			};
	
			// Push the object to the distances array
			distances.push(distanceObj);
		}
		distances.sort((a, b) => a.distance - b.distance);
		// console.log(distances);
		
	} catch (err) {
		console.log(err);
		console.log("her2");
		throw {
			isNotifier: true,
			status: 500,
		};
	}
	

	return distances;
};

module.exports = {
	notifier,
};
