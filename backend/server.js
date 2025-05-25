// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./routes');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // URL do seu frontend React
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log de requisições em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Rota de teste para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Mercado Pago funcionando!',
    version: '1.0.0',
    endpoints: {
      createPixPayment: 'POST /api/create-pix-payment',
      processCardPayment: 'POST /api/process-card-payment',
      checkPaymentStatus: 'GET /api/payment-status/:paymentId',
      webhook: 'POST /api/webhooks/mercadopago'
    }
  });
});

// Usar as rotas da API
app.use(routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  
  res.status(err.status || 500).json({ 
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor',
    status: err.status || 500
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.path} não existe`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
  
  // Verificar se as credenciais estão configuradas
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.warn('⚠️  AVISO: MERCADOPAGO_ACCESS_TOKEN não configurado no .env');
  } else {
    console.log('✅ Mercado Pago Access Token configurado');
  }
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado:', err);
  process.exit(1);
});

module.exports = app;