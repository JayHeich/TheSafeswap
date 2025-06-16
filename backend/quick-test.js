const { MercadoPagoConfig, Payment } = require('mercadopago');
require('dotenv').config();

console.log('TESTE MERCADO PAGO');
console.log('Token:', process.env.MERCADOPAGO_ACCESS_TOKEN ? 'OK' : 'ERRO');

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.log('Token nao configurado!');
  process.exit(1);
}

async function teste() {
  try {
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
    });
    
    const payment = new Payment(client);
    console.log('Cliente criado com sucesso');

    await payment.create({ 
      body: {
        transaction_amount: 100,
        payment_method_id: 'visa',
        payer: { email: 'test@test.com' }
      }
    });
    
    console.log('Teste passou - sem internal error');
    
  } catch (error) {
    if (error.message === 'internal_error') {
      console.log('INTERNAL ERROR detectado - problema na conta MP');
    } else {
      console.log('Credenciais OK - erro esperado:', error.message);
    }
  }
}

teste();