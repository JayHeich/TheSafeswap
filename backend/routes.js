// backend/routes.js
const express = require('express');
const router = express.Router();
const mercadoPagoController = require('./mercadoPagoController');

// Middleware para validar requisições
const validatePaymentRequest = (req, res, next) => {
  const { transaction_amount } = req.body;
  
  if (!transaction_amount || transaction_amount <= 0) {
    return res.status(400).json({
      error: 'Valor inválido',
      message: 'O valor da transação deve ser maior que zero'
    });
  }
  
  next();
};

// Rotas da API do Mercado Pago
router.post('/api/create-pix-payment', validatePaymentRequest, mercadoPagoController.createPixPayment);
router.post('/api/process-card-payment', validatePaymentRequest, mercadoPagoController.processCardPayment);
router.post('/api/webhooks/mercadopago', mercadoPagoController.webhook);
router.get('/api/payment-status/:paymentId', mercadoPagoController.checkPaymentStatus);

// Rota de teste da API
router.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando corretamente!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota para verificar configuração
router.get('/api/config/check', (req, res) => {
  const hasAccessToken = !!process.env.MERCADOPAGO_ACCESS_TOKEN;
  const hasPublicKey = !!process.env.MERCADOPAGO_PUBLIC_KEY;
  
  res.json({
    configured: hasAccessToken && hasPublicKey,
    accessToken: hasAccessToken ? 'Configurado' : 'Não configurado',
    publicKey: hasPublicKey ? 'Configurado' : 'Não configurado',
    message: hasAccessToken && hasPublicKey 
      ? 'Mercado Pago configurado corretamente!' 
      : 'Configure as credenciais no arquivo .env'
  });
});

module.exports = router;