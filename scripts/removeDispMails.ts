import Axios from "axios";

async (req, res) => {
const response = await Axios.get(`https://disposable.debounce.io/?email=${req.body.email}`);
    console.log(response.data);
    console.log(response.data.disposable);
    
    if(await response.data.disposable == 'true'){
        // console.log(response.data);
        res.status(400).json({
            success: false,
            message: "Disposable Mail Used. Use normal mail instead."
        });
        return;
    };
}