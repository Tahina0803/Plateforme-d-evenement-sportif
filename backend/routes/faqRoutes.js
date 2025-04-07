const express = require('express');
const FaqControler = require('../controlers/FaqControler');
const verifyToken = require('../middleware/jwtMiddleware');
const verifyRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Routes pour la FAQ
router.post('/faq', verifyToken, verifyRoles(['admin']), FaqControler.createFaq);
router.get('/faq', FaqControler.getAllFaqs);
router.get('/faq/:id', FaqControler.getFaqById);
router.put('/faq/:id', verifyToken, verifyRoles(['admin']), FaqControler.updateFaq);
router.delete('/faq/:id', verifyToken, verifyRoles(['admin']), FaqControler.deleteFaq);

module.exports = router;
