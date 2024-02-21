const createObject = (timestamp) => {
	const date = new Date(0);

	const [hours, minutes] = timestamp.split(':'); // ["30"]

	if(!minutes){
		date.setUTCHours(0, hours)

	} else {
		date.setUTCHours(hours, minutes)
	}
	return date;
}

const createObject = (timestamp) => {
	const date = new Date(0);

	if(timestamp.contains(':')){
		const [hours, minutes] = timestamp.split(':'); // ["30"]
		date.setUTCHours(hours, minutes)
	} else {
		date.setUTCHours(0, timestamp)
	}

	return date;
}

console.log(createObject("30")) // ???

console.log(createObject("01:30")); // ???
