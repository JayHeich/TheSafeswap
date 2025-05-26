// backend/mercadoPagoController.js
const { MercadoPagoConfig, Payment } = require('mercadopago');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Log para verificar se o token está carregado
console.log('=== Configuração Mercado Pago ===');
console.log('Access Token configurado:', process.env.MERCADOPAGO_ACCESS_TOKEN ? 'Sim' : 'Não');
console.log('Ambiente:', process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-') ? 'TESTE' : 'PRODUÇÃO');

// Configurar cliente do Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Criar instância de Payment
const payment = new Payment(client);

// Criar pagamento PIX
exports.createPixPayment = async (req, res) => {
  try {
    console.log('\n=== CRIANDO PAGAMENTO PIX ===');
    console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));
    
    const { 
      transaction_amount, 
      description, 
      payer,
      metadata 
    } = req.body;

    const payment_data = {
      transaction_amount: Number(transaction_amount),
      description: description || 'Ingresso para festa',
      payment_method_id: 'pix',
      payer: {
        email: payer?.email || 'cliente@email.com'
      }
    };

    console.log('Enviando para MP:', payment_data);

    const result = await payment.create({ body: payment_data });

    console.log('PIX criado com sucesso!', result.id);

    res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      point_of_interaction: result.point_of_interaction
    });

  } catch (error) {
    console.error('ERRO PIX:', error);
    res.status(500).json({
      error: 'Erro ao processar pagamento PIX',
      message: error.message
    });
  }
};

// Processar pagamento com cartão
exports.processCardPayment = async (req, res) => {
  try {
    console.log('\n=== PROCESSANDO PAGAMENTO CARTÃO ===');
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    
    const {
      token,
      transaction_amount,
      installments,
      payment_method_id,
      payer
    } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token não fornecido'
      });
    }

    // Preparar dados do pagamento - APENAS campos essenciais
    const payment_data = {
      token: token,
      transaction_amount: Number(transaction_amount),
      installments: Number(installments) || 1,
      payment_method_id: payment_method_id || 'visa',
      payer: {
        email: payer?.email || 'test@test.com'
      }
    };

    console.log('Enviando para Mercado Pago:', JSON.stringify(payment_data, null, 2));

    try {
      const result = await payment.create({ body: payment_data });

      console.log('✅ PAGAMENTO CRIADO!');
      console.log('ID:', result.id);
      console.log('Status:', result.status);
      console.log('Detalhes:', result.status_detail);

      // Retornar resposta de sucesso
      res.json({
        id: result.id,
        status: result.status,
        status_detail: result.status_detail,
        message: result.status === 'approved' ? 'Pagamento aprovado!' : `Pagamento ${result.status}`
      });

    } catch (mpError) {
      console.error('Erro do Mercado Pago:', mpError);
      
      // Se for erro de bin_not_found, vamos tentar sem o payment_method_id
      if (mpError.message === 'bin_not_found') {
        console.log('Tentando sem payment_method_id...');
        
        const simpleData = {
          token: token,
          transaction_amount: Number(transaction_amount),
          installments: 1,
          payer: {
            email: payer?.email || 'test@test.com'
          }
        };
        
        try {
          const result2 = await payment.create({ body: simpleData });
          
          res.json({
            id: result2.id,
            status: result2.status,
            status_detail: result2.status_detail,
            message: 'Pagamento processado!'
          });
        } catch (error2) {
          throw error2;
        }
      } else {
        throw mpError;
      }
    }

  } catch (error) {
    console.error('=== ERRO FINAL ===');
    console.error('Tipo:', error.constructor.name);
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    console.error('Status:', error.status);
    
    if (error.cause && Array.isArray(error.cause)) {
      error.cause.forEach((c, i) => {
        console.error(`Causa ${i}:`, c);
      });
    }
    
    res.status(error.status || 500).json({
      error: 'Erro ao processar pagamento',
      message: error.message,
      cause: error.cause
    });
  }
};

// Webhook
exports.webhook = async (req, res) => {
  try {
    const { type, data } = req.body;
    console.log('Webhook recebido:', type);
    
    if (type === 'payment' && data?.id) {
      const result = await payment.get({ id: data.id });
      console.log('Pagamento atualizado:', result.status);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro webhook:', error);
    res.status(200).send('OK');
  }
};

// Verificar status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const result = await payment.get({ id: paymentId });
    
    res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail
    });
  } catch (error) {
    res.status(404).json({
      error: 'Pagamento não encontrado'
    });
  }
};

// Função auxiliar
function getRejectMessage(status_detail) {
  const messages = {
    'cc_rejected_bad_filled_card_number': 'Número do cartão inválido',
    'cc_rejected_bad_filled_date': 'Data de validade inválida',
    'cc_rejected_bad_filled_other': 'Dados do cartão inválidos',
    'cc_rejected_bad_filled_security_code': 'Código de segurança inválido',
    'cc_rejected_blacklist': 'Cartão não autorizado',
    'cc_rejected_call_for_authorize': 'Entre em contato com seu banco',
    'cc_rejected_card_disabled': 'Cartão desabilitado',
    'cc_rejected_duplicated_payment': 'Pagamento duplicado',
    'cc_rejected_high_risk': 'Pagamento recusado por segurança',
    'cc_rejected_insufficient_amount': 'Saldo insuficiente',
    'cc_rejected_other_reason': 'Pagamento recusado'
  };

  return messages[status_detail] || 'Pagamento não processado';
}