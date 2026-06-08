const express = require("express");

const Wallet = require("../models/Wallet");
const auth = require("../middleware/authMiddleware");
const validateTransfer = require("../middleware/ValidateTransfer");
const { transfer } = require("../services/WalletService");

const router = express.Router();

router.post("/transfer", auth, validateTransfer, async (req, res) => {
  try {
    const { recipientEmail, amount } = req.transferInput;

    await transfer(req.userId, recipientEmail, amount);

    res.json({
      message: "Transfer successful"
    });
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

router.get("/balance", auth, async (req, res) => {
  try {
    const wallet = await Wallet.findByUserId(req.userId);

    if (!wallet) {
      return res.status(404).json({
        error: "Wallet not found"
      });
    }

    res.json({
      balance: wallet.balance,
      currency: "USD"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;
