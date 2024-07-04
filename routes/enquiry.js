const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// @route   POST /api/enquiry
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const newEnquiry = new Enquiry({
      name,
      email,
      subject,
      message,
      
    });

    const savedEnquiry = await newEnquiry.save();
    res.json({ success: true, enquiry: savedEnquiry });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


//get all enquiries
router.get('/', async (req, res) => {
    try {
      const enquiries = await Enquiry.find();
      res.json({ success: true, enquiries });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  });

  // Delete an enquiry by ID
router.delete("/:id", async (req, res) => {
    try {
      const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
      if (!enquiry) {
        return res.status(404).json({ message: "Enquiry not found" });
      }
      res.status(200).json({ message: "Enquiry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
