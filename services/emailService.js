const nodeMailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendWelcomeEmail = async (user) => {
  if (!user.email) return;

  const html = await ejs.renderFile(
    path.join(__dirname, '..', 'views', 'emails', 'welcome.ejs'),
    {
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      joinedAt: new Date().toLocaleDateString(),
      year: new Date().getFullYear(),
    }
  );

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Welcome to Our Blog!',
    html,
  });
};

exports.sendDonationReceipt = async (donation, user) => {
  if (!user.email) return;

  const html = await ejs.renderFile(
    path.join(__dirname, '..', 'views', 'emails', 'donationReceipt.ejs'),
    {
      name: user.name,
      amount: donation.amount,
      donationId: donation._id,
      date: new Date().toLocaleDateString(),
      year: new Date().getFullYear(),
    }
  );

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Donation Received - Thank You!',
    html,
  });
};
