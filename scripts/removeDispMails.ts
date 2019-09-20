import Axios from "axios";
import User from "../models/user";

export async function disp() {
	const mails = await User.find({}, { email: 0 });
	for (const mail of mails) {
		const response = await Axios.get(
			`https://disposable.debounce.io/?email=${req.body.email}`
		);
		// console.log(response.data);
		// console.log(response.data.disposable);
		if (response.data.disposable == "true") {
			await User.findOneAndDelete({ email: mail });
			// console.log(response.data);
			console.log("delete", mail);
			return;
		}
	}
	console.log("deleted");
}
