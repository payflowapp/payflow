const User = require("../models/User");

module.exports = (req, res, next) => {
  const recipientEmail = User.normalizeEmail(req.body.recipientEmail);
  const amount = Number(req.body.amount);

  if (!recipientEmail || Number.isNaN(amount)) {
    return res.status(400).json({
      error: "Recipient email and amount are required"
    });
  }

  if (!recipientEmail.includes("@")) {
    return res.status(400).json({
      error: "Recipient email must be valid"
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      error: "Amount must be greater than zero"
    });
  }

  req.transferInput = {
    recipientEmail,
    amount
  };

  next();
};
