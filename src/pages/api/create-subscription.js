// src/pages/api/create-subscription.js
import Stripe from 'stripe';

export async function POST({ request }) {
  try {
    // Verificação inicial da variável de ambiente
    const secretKey = import.meta.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("A variável de ambiente STRIPE_SECRET_KEY não foi encontrada no servidor.");
    }

    const stripe = new Stripe(secretKey);

    const { priceId } = await request.json();
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

    // Sucesso: devolve o clientSecret
    return new Response(JSON.stringify({
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Erro: garante que a resposta é JSON com a mensagem de erro
    console.error('Erro na função backend:', error);
    return new Response(JSON.stringify({
      error: error.message || "Ocorreu um erro desconhecido no servidor.",
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
