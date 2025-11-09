    export const handler = async () => {
      const key = process.env.STRIPE_SECRET_KEY || 'Chave não encontrada!';
      const keyPrefix = key.substring(0, 8); // Apenas para diagnóstico seguro

      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Diagnóstico de Chave</title>
            <style>
              body { font-family: sans-serif; display: grid; place-content: center; height: 100vh; margin: 0; }
              div { padding: 2rem; border: 1px solid #ccc; border-radius: 8px; }
              code { background: #eee; padding: 0.2rem 0.4rem; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div>
              <p>O prefixo da chave Stripe que o servidor está a usar é:</p>
              <h1><code>${keyPrefix}</code></h1>
            </div>
          </body>
          </html>
        `,
      };
    };
    
