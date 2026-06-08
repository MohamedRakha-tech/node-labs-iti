const express=require('express');
const router = express.Router();
const donationController=require('../controllers/donations');
const isAuth=require('../middlewares/is-auth');
const {validate}=require('../middlewares/validator');
const donationSchemas=require('../validators/donations');



router.post('/',isAuth,validate(donationSchemas.createDonation),donationController.createDonation);
router.post('/webhook',donationController.webHook);

module.exports=router;