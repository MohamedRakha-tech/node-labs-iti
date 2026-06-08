const express=require('express');
const router = express.Router();
const donationController=require('../controllers/donations');
const isAuth=require('../middlewares/is-auth');
const autherization=require('../middlewares/autherization');
const validator = require('../middlewares/validator');
const donationSchemas=require('../validators/donations');
const validateKashierHash=require('../middlewares/validateKashierHash');

router.post('/',isAuth,validator(donationSchemas),donationController.createDonation);
router.post('/webhook',validateKashierHash,donationController.webHook);
router.get('/',isAuth,donationController.listMyDonations);
router.get('/all',isAuth,autherization('admin'),donationController.listAllDonations);

module.exports=router;
