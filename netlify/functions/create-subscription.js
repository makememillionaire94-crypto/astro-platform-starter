// Importa o Stripe e inicializa-o com a chave secreta guardada no Netlify
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // A função só aceita pedidos POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { priceId } = JSON.parse(event.body);

    // Primeiro, vamos criar um Cliente no Stripe.
    // No futuro, podemos guardar este ID de cliente no Firestore junto ao perfil do utilizador.
    const customer = await stripe.customers.create();

    // Agora, criamos a subscrição para este novo cliente
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Enviamos de volta para a aplicação a "chave" necessária para o formulário de pagamento
    return {
      statusCode: 200,
      body: JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      }),
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
