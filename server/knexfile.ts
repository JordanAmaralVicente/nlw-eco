import path from "path";

module.exports = {
	client:"mysql",
	connection:{
		host: "localhost",
		user:"teste",
		password:"",
		database:"nlw_eco"
	},
	migrations:{
		directory: path.resolve(__dirname,"src", "database", "migrations"),
	},
	seeds:{
		directory: path.resolve(__dirname,"src", "database", "seeds"),
	},
	useNullAsDefault: true,
};