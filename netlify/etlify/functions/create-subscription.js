const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { priceId } = JSON.parse(event.body);
    if (!priceId) {
      throw new Error("O ID do Preço (priceId) não foi enviado no pedido.");
    }
    const customer = await stripe.customers.create();
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      }),
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Ocorreu um erro desconhecido no servidor.",
      }),
    };
  }
};
