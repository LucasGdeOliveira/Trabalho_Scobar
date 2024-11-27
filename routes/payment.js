// routes/payment.js
const express = require('express');
const PaymentController = require('../controllers/paymentController');
const router = express.Router();

// Rota para pagamento via cartão de crédito
router.post('/credit-card', PaymentController.processCreditCardPayment);

// Rota para pagamento via PIX
router.post('/pix', PaymentController.processPixPayment);

// Rota para consultar transação
router.get('/status/:transactionId', PaymentController.getTransactionStatus);

module.exports = router;
