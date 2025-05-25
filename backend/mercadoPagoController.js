// backend/mercadoPagoController.js
const mercadopago = require('mercadopago');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Configurar Mercado Pago com seu Access Token
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Criar pagamento PIX
exports.createPixPayment = async (req, res) => {
  try {
    const { 
      transaction_amount, 
      description, 
      payer,
      metadata 
    } = req.body;

    // Validar que é um pagamento PIX
    if (req.body.payment_method_id !== 'pix') {
      return res.status(400).json({
        error: 'Método de pagamento inválido',
        message: 'Esta rota aceita apenas pagamentos PIX'
      });
    }

    const payment_data = {
      transaction_amount: Number(transaction_amount),
      description: description || 'Ingresso para festa',
      payment_method_id: 'pix',
      payer: {
        email: payer.email || 'cliente@email.com',
        first_name: payer.first_name || 'Nome',
        last_name: payer.last_name || 'Sobrenome',
        identification: {
          type: 'CPF',
          number: payer.identification?.number || '12345678900'
        }
      },
      notification_url: process.env.WEBHOOK_URL || 'https://webhook.site/unique-id',
      statement_descriptor: 'INGRESSOS',
      metadata: metadata || {},
      external_reference: `festa_${Date.now()}` // ID único para referência
    };

    console.log('Criando pagamento PIX:', {
      amount: payment_data.transaction_amount,
      email: payment_data.payer.email
    });

    const payment = await mercadopago.payment.create(payment_data);

    if (!payment.body.point_of_interaction) {
      throw new Error('Erro ao gerar dados do PIX');
    }

    // Retornar dados do PIX
    res.json({
      id: payment.body.id,
      status: payment.body.status,
      status_detail: payment.body.status_detail,
      external_reference: payment.body.external_reference,
      point_of_interaction: payment.body.point_of_interaction,
      expiration_date: payment.body.date_of_expiration
    });

  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    res.status(500).json({
      error: 'Erro ao processar pagamento PIX',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Processar pagamento com cartão
exports.processCardPayment = async (req, res) => {
  try {
    const {
      token,
      transaction_amount,
      description,
      installments,
      payment_method_id,
      issuer_id,
      payer,
      metadata
    } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token não fornecido',
        message: 'O token do cartão é obrigatório'
      });
    }

    const payment_data = {
      token: token,
      transaction_amount: Number(transaction_amount),
      description: description || 'Ingresso para festa',
      installments: Number(installments) || 1,
      payment_method_id: payment_method_id,
      issuer_id: issuer_id,
      payer: {
        email: payer.email,
        identification: {
          type: payer.identification.type,
          number: payer.identification.number
        }
      },
      notification_url: process.env.WEBHOOK_URL || 'https://webhook.site/unique-id',
      statement_descriptor: 'INGRESSOS',
      metadata: metadata || {},
      external_reference: `festa_${Date.now()}`
    };

    console.log('Processando pagamento com cartão:', {
      amount: payment_data.transaction_amount,
      email: payment_data.payer.email,
      installments: payment_data.installments
    });

    const payment = await mercadopago.payment.create(payment_data);

    // Processar resposta baseada no status
    const response = {
      id: payment.body.id,
      status: payment.body.status,
      status_detail: payment.body.status_detail,
      external_reference: payment.body.external_reference,
      last_four_digits: payment.body.card?.last_four_digits
    };

    // Verificar status do pagamento
    switch (payment.body.status) {
      case 'approved':
        response.message = 'Pagamento aprovado com sucesso!';
        // Aqui você salvaria no banco de dados
        console.log('Pagamento aprovado:', payment.body.id);
        break;
        
      case 'pending':
        response.message = 'Pagamento em processamento';
        break;
        
      case 'rejected':
        response.message = getRejectMessage(payment.body.status_detail);
        res.status(400);
        break;
        
      default:
        response.message = 'Status do pagamento: ' + payment.body.status;
    }

    res.json(response);

  } catch (error) {
    console.error('Erro ao processar pagamento com cartão:', error);
    res.status(500).json({
      error: 'Erro ao processar pagamento',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Webhook para receber notificações do Mercado Pago
exports.webhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Webhook recebido:', { 
      type, 
      id: data?.id,
      timestamp: new Date().toISOString() 
    });

    if (type === 'payment') {
      // Buscar informações completas do pagamento
      const payment = await mercadopago.payment.findById(data.id);
      
      console.log('Status do pagamento atualizado:', {
        id: payment.body.id,
        status: payment.body.status,
        method: payment.body.payment_method_id
      });
      
      // Aqui você deve:
      // 1. Atualizar o status no banco de dados
      // 2. Enviar email de confirmação se aprovado
      // 3. Gerar os ingressos se for o caso
      
      if (payment.body.status === 'approved') {
        console.log('Pagamento aprovado! Processar confirmação...');
        // Implementar lógica de confirmação
      }
    }

    // Sempre retornar 200 para o Mercado Pago
    res.status(200).send('OK');

  } catch (error) {
    console.error('Erro no webhook:', error);
    // Ainda assim retornar 200 para evitar retry do Mercado Pago
    res.status(200).send('OK');
  }
};

// Verificar status de um pagamento
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    if (!paymentId) {
      return res.status(400).json({
        error: 'ID do pagamento não fornecido'
      });
    }
    
    console.log('Verificando status do pagamento:', paymentId);
    
    const payment = await mercadopago.payment.findById(paymentId);
    
    res.json({
      id: payment.body.id,
      status: payment.body.status,
      status_detail: payment.body.status_detail,
      payment_method_id: payment.body.payment_method_id,
      transaction_amount: payment.body.transaction_amount,
      payer_email: payment.body.payer.email,
      date_created: payment.body.date_created,
      date_approved: payment.body.date_approved
    });

  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(404).json({
      error: 'Pagamento não encontrado',
      message: 'Não foi possível encontrar o pagamento com o ID fornecido'
    });
  }
};

// Função auxiliar para mensagens de erro
function getRejectMessage(status_detail) {
  const messages = {
    'cc_rejected_bad_filled_card_number': 'Número do cartão inválido',
    'cc_rejected_bad_filled_date': 'Data de validade inválida',
    'cc_rejected_bad_filled_other': 'Dados do cartão inválidos',
    'cc_rejected_bad_filled_security_code': 'Código de segurança inválido',
    'cc_rejected_blacklist': 'Cartão não autorizado',
    'cc_rejected_call_for_authorize': 'Entre em contato com seu banco',
    'cc_rejected_card_disabled': 'Cartão desabilitado',
    'cc_rejected_card_error': 'Erro no cartão',
    'cc_rejected_duplicated_payment': 'Pagamento duplicado',
    'cc_rejected_high_risk': 'Pagamento recusado por segurança',
    'cc_rejected_insufficient_amount': 'Saldo insuficiente',
    'cc_rejected_invalid_installments': 'Parcelas inválidas',
    'cc_rejected_max_attempts': 'Limite de tentativas excedido',
    'cc_rejected_other_reason': 'Pagamento recusado'
  };

  return messages[status_detail] || 'Pagamento não processado. Tente novamente.';
}