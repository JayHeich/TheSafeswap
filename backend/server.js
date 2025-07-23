// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./routes');

// === DEBUG NODEMAILER NO INÍCIO ===
console.log('=== DEBUG NODEMAILER NO INÍCIO ===');
try {
  const testNodemailer = require('nodemailer');
  console.log('✅ Nodemailer carregado no início!');
  console.log('Tipo de nodemailer:', typeof testNodemailer);
  console.log('createTransport é função?', typeof testNodemailer.createTransport);
} catch (e) {
  console.log('❌ Erro ao carregar nodemailer:', e.message);
}
console.log('================================');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// 🎯 CONFIGURAÇÃO SIMPLIFICADA PARA PRODUÇÃO
const isDevelopment = false; // Forçar produção
const PORT = process.env.PORT || 8080; // Railway usa 8080 por padrão
const HOST = process.env.HOST || '0.0.0.0'; // IMPORTANTE para Railway

// 🌍 URLs PERMITIDAS (CORS) - PRODUÇÃO
const allowedOrigins = [
  'http://localhost:3000',                    // Desenvolvimento
  'http://localhost:3001',                    // Desenvolvimento backend
  'http://127.0.0.1:3000',                   // Desenvolvimento alternativo
  'https://the-safeswap.vercel.app',         // 🎯 SEU VERCEL
  'https://the-safeswap-git-main.vercel.app', // Git branch do Vercel
  'https://the-safeswap.vercel.app/',        // Com trailing slash
];

// Remover URLs undefined/null
const cleanOrigins = allowedOrigins.filter(Boolean);

console.log('🔍 Ambiente detectado:', isDevelopment ? 'DESENVOLVIMENTO' : 'PRODUÇÃO');
console.log('🌍 CORS permitido para:', cleanOrigins);

// ================================
// 📧 CONFIGURAÇÃO DO EMAIL (OPCIONAL)
// ================================

let transporter = null;
try {
  console.log('🔍 Verificando configuração de email...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Configurado' : '❌ Não configurado');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Configurado' : '❌ Não configurado');
  
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const nodemailer = require('nodemailer');
    
    if (typeof nodemailer.createTransport === 'function') {
      transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      console.log('📧 Transporter criado, verificando conexão...');
      
      // Verificar conexão (sem bloquear o servidor)
      transporter.verify(function(error, success) {
        if (error) {
          console.log('❌ Erro ao verificar conexão Gmail:', error.message);
          transporter = null;
        } else {
          console.log('✅ Conexão Gmail verificada com sucesso!');
        }
      });
    } else {
      console.log('❌ createTransport não é uma função');
      transporter = null;
    }
  } else {
    console.log('⚠️ EMAIL_USER ou EMAIL_PASS não encontrados no .env');
  }
} catch (error) {
  console.log('❌ Erro ao configurar email:', error.message);
  transporter = null;
}

// ================================
// 🛠️ MIDDLEWARES
// ================================

// 🌍 CORS CORRIGIDO
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sem origin (mobile apps, postman, etc)
    if (!origin) return callback(null, true);
    
    // Verificar se a origin está na lista permitida
    if (cleanOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Em desenvolvimento, ser mais permissivo
    if (isDevelopment) {
      console.log('🔓 Permitindo origin em desenvolvimento:', origin);
      return callback(null, true);
    }
    
    // Em produção, bloquear origins não autorizadas
    console.log('❌ Origin bloqueada:', origin);
    callback(new Error('Não permitido pelo CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// 📝 Log de requisições
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // Log do origin em produção para debug
  if (!isDevelopment && req.headers.origin) {
    console.log(`🌍 Origin: ${req.headers.origin}`);
  }
  
  next();
});

// ================================
// 🌐 ROTAS
// ================================

// 🔍 Rota de health check para Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: isDevelopment ? 'development' : 'production',
    port: PORT
  });
});

// 📋 Rota principal com informações da API
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API do SafeSwap funcionando!',
    version: '1.0.0',
    environment: isDevelopment ? 'development' : 'production',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /health',
      createPixPayment: 'POST /api/create-pix-payment',
      processCardPayment: 'POST /api/process-card-payment',
      sendTicket: 'POST /api/send-ticket',
      checkPaymentStatus: 'GET /api/payment-status/:paymentId',
      webhook: 'POST /api/webhooks/mercadopago'
    },
    cors: {
      allowedOrigins: cleanOrigins.length,
      development: isDevelopment
    }
  });
});

// 📧 Rota para enviar ingresso por email
app.post('/api/send-ticket', async (req, res) => {
  try {
    const { contactMethod, email, whatsapp, paymentData } = req.body;

    console.log('📧 Enviando ingresso:', { 
      contactMethod, 
      email: email ? email.substring(0, 3) + '***' : null,
      whatsapp: whatsapp ? whatsapp.substring(0, 3) + '***' : null
    });

    // Validação básica
    if (!contactMethod || (!email && !whatsapp)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados incompletos: contactMethod e email/whatsapp são obrigatórios' 
      });
    }

    // WhatsApp (simulado por enquanto)
    if (contactMethod === 'whatsapp') {
      console.log(`📱 WhatsApp ticket simulado para: ${whatsapp}`);
      return res.json({ 
        success: true, 
        message: 'Ticket enviado via WhatsApp (simulado)',
        ticketId: `SAFE-${Date.now().toString(36).toUpperCase()}`
      });
    }

    // Email
    if (contactMethod === 'email') {
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'E-mail não fornecido' 
        });
      }

      // Gerar código do ingresso
      const ticketCode = `SAFE-${Date.now().toString(36).toUpperCase()}`;

      // Se nodemailer não configurado, simular
      if (!transporter) {
        console.log(`📧 Email simulado para: ${email}`);
        return res.json({ 
          success: true, 
          message: 'Email enviado com sucesso! (simulado - configure EMAIL_USER e EMAIL_PASS no .env para envio real)',
          ticketId: ticketCode
        });
      }

      // Template do email
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Seu Ingresso SafeSwap</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #14b8a6; text-align: center;">SafeSwap</h1>
            <h2 style="color: #333;">🎫 Seu Ingresso Chegou!</h2>
            <p>Parabéns! Seu ingresso SafeSwap foi gerado com sucesso.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="color: #14b8a6;">Código do Ingresso</h3>
              <p style="font-family: monospace; font-size: 20px; font-weight: bold; color: #333;">${ticketCode}</p>
            </div>

            ${paymentData ? `
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4>Detalhes do Pagamento:</h4>
              <p><strong>Evento:</strong> ${paymentData.festa?.nome || 'SafeSwap Event'}</p>
              <p><strong>Valor:</strong> R$ ${paymentData.valor ? Number(paymentData.valor).toFixed(2) : '0,00'}</p>
              <p><strong>ID Pagamento:</strong> ${paymentData.paymentId || 'N/A'}</p>
            </div>
            ` : ''}
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p><strong>Informações Importantes:</strong></p>
              <ul>
                <li>Este ingresso é único e intransferível</li>
                <li>Apresente este e-mail na entrada do evento</li>
                <li>Guarde bem este comprovante</li>
              </ul>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
              SafeSwap - Ingressos Seguros<br>
              Dúvidas: suporte@safeswap.com
            </p>
          </div>
        </body>
        </html>
      `;

      // Enviar email real
      const mailOptions = {
        from: `"SafeSwap" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🎫 Seu Ingresso SafeSwap',
        html: emailTemplate
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado para: ${email}`);
      
      return res.json({ 
        success: true, 
        message: 'Ingresso enviado com sucesso!',
        ticketId: ticketCode
      });
    }

  } catch (error) {
    console.error('❌ Erro ao enviar ingresso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor',
      details: isDevelopment ? error.message : 'Contate o suporte'
    });
  }
});

// ================================
// 🔗 USAR ROTAS DA API
// ================================

app.use(routes);

// ================================
// 🛡️ TRATAMENTO DE ERROS
// ================================

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('💥 Erro:', err.stack);
  
  res.status(err.status || 500).json({ 
    error: 'Algo deu errado!',
    message: isDevelopment ? err.message : 'Erro interno do servidor',
    status: err.status || 500,
    timestamp: new Date().toISOString()
  });
});

// Rota 404
app.use((req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.path} não existe`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/create-pix-payment',
      'POST /api/process-card-payment',
      'POST /api/send-ticket',
      'GET /api/payment-status/:paymentId'
    ]
  });
});

// ================================
// 🚀 INICIALIZAÇÃO
// ================================

// Iniciar servidor com host específico para Railway
app.listen(PORT, HOST, () => {
  console.log('=================================');
  console.log(`🚀 Servidor SafeSwap rodando!`);
  console.log(`📍 Host: ${HOST}`);
  console.log(`🔌 Porta: ${PORT}`);
  console.log(`🌍 Ambiente: ${isDevelopment ? 'DESENVOLVIMENTO' : 'PRODUÇÃO'}`);
  console.log(`📅 Iniciado em: ${new Date().toISOString()}`);
  console.log('=================================');
  
  // Status das configurações
  console.log('📊 STATUS DAS CONFIGURAÇÕES:');
  console.log(`💳 Mercado Pago: ${process.env.MERCADOPAGO_ACCESS_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`);
  console.log(`📧 Email: ${transporter ? '✅ Funcionando' : process.env.EMAIL_USER ? '⚠️ Parcial' : '❌ Não configurado'}`);
  console.log(`🌍 CORS: ${cleanOrigins.length} origens permitidas`);
  
  if (isDevelopment) {
    console.log('🔓 Modo desenvolvimento: CORS permissivo ativado');
  }
  
  console.log('=================================');
  console.log('🎯 API pronta para receber requisições!');
  console.log('=================================');
});

// 🛡️ Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('💥 Erro não tratado (unhandledRejection):', err);
  if (!isDevelopment) {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('💥 Exceção não capturada (uncaughtException):', err);
  process.exit(1);
});

// 📡 Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📡 SIGTERM recebido, finalizando servidor...');
  process.exit(0);
});

module.exports = app;