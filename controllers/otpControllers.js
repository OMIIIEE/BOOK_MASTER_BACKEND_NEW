// const  Admin = require("../models/Admin");

const Admin = require("../models/Admin");


 const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await Admin.findOne({
      email,
    otp,
      otpExpires: { $gt: Date.now() },
    });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP !" ,success:false});
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "OTP Verifiesd Successfully !", success: true });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = verifyOtp;