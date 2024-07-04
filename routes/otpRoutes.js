const  express =require('express');
const verifyOtp = require('../controllers/otpControllers');


const router = express.Router();

router.post("/verify-otp",verifyOtp);

module.exports = router;