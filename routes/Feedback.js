const express = require("express");
const Admin = require("../models/Admin");
const { auth, admin } = require("../middleware/auth");

const router = express.Router();

// Feedback Route
router.post('/', auth, async (req, res) => {
    const { willComeBack, bookRating, recommend, comment } = req.body;

    try {
        // Find the admin user by ID and push new feedback
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.user.id,
            { $push: { feedbacks: { willComeBack, bookRating, recommend, comment } } },
            { new: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            feedback: { willComeBack, bookRating, recommend, comment }
        });
    } catch (err) {
        console.error('Error during feedback submission:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});


// Route to get all latest feedbacks
// router.get('/', async (req, res) => {
//     try {
//         // Query all admin users and populate their feedbacks
//         const admins = await Admin.find().populate('feedbacks').exec();

//         if (!admins) {
//             return res.status(404).json({ success: false, message: 'No admins found' });
//         }

//         // Array to store all feedbacks
//         let allFeedbacks = [];

//         // Extract all feedbacks from each admin
//         admins.forEach(admin => {
//             allFeedbacks = allFeedbacks.concat(admin.feedbacks);
//         });

//         // Sort all feedbacks by date/time in descending order
//         allFeedbacks.sort((a, b) => b.date - a.date);

//         res.status(200).json({
//             success: true,
//             feedbacks: allFeedbacks
//         });
//     } catch (err) {
//         console.error('Error fetching feedbacks:', err);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });

// Route to get the last feedback added by each admin who has feedback
router.get('/', async (req, res) => {
    try {
        // Find all admins who have at least one feedback, and populate their latest feedback
        const admins = await Admin.aggregate([
            { 
                $match: { 
                    'feedbacks.0': { $exists: true } // Filter admins who have at least one feedback
                } 
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    avatar:1,
                    latestFeedback: { 
                        $arrayElemAt: ['$feedbacks', -1] // Get the last feedback in the array (assuming sorted by date)
                    }
                }
            }
        ]);

        if (!admins || admins.length === 0) {
            return res.status(404).json({ success: false, message: 'No admins with feedback found' });
        }

        res.status(200).json({
            success: true,
            latestFeedbacks: admins.map(admin => ({
                adminId: admin._id,
                adminName: admin.name,
                adminAvatar: admin.avatar,
                feedback: admin.latestFeedback
            }))
        });
    } catch (err) {
        console.error('Error fetching latest feedbacks:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
