import 'dotenv/config'

async function sendMessage(codprod, vlrvenda, contact) {
  try {
    const response = await fetch('https://graph.facebook.com/v18.0/183582418183115/messages', {
      method: 'POST',
      headers: {
        'Authorization': process.env.TOKEN,
        'Content-Type': 'application/json',
        'Cookie': 'ps_l=0; ps_n=0'
      },
      body: JSON.stringify({
        "messaging_product": "whatsapp",
        "to": contact,
        "type": "template",
        "template": {
          "name": "atualizacao_de_preco",
          "language": { "code": "pt_BR" },
          "components": [{
            "type": "body",
            "parameters": [{ "type": "text", "text": codprod }, { "type": "text", "text": vlrvenda }]
          }]
        }
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao executar a solicitação');
    }

    const data = await response.json();
    console.log(data); // Faz algo com os dados recebidos
  } catch (error) {
    console.error('Houve um erro:', error);
  }
}