const sql = require('mssql');
require('dotenv').config();

// Configuração de conexão com o banco de dados
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false // Se você estiver usando uma conexão criptografada, altere para true
    }
};

function sendMessage(codprod, vlrvenda) {
    fetch('https://graph.facebook.com/v18.0/183582418183115/messages', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer EAAloZC9QhVF8BOZBiaCcBf5EJ9I7UrKSwuNQ8p0FZAwo8jNslaNjMEd5k6ZAXMyAsVDnVngj2kN3ZCVaA3ecFZAzb5dtfei4M7zZC0XZCpr8zko88NFJY4ZCyKIwfCHtDgKCihJ1UcPxHaUuBJHkswe68NO0tPZC3U0rfkHoEHsuKwudFUAeAYGXl9WX2XA2x8dZBW2Ijl0ynZAumhiL1IbCWQ432ZAa4oWvfuAPOYlIPaZA4Ubg4ZD',
            'Content-Type': 'application/json',
            'Cookie': 'ps_l=0; ps_n=0'
        },
        body: JSON.stringify({
            "messaging_product": "whatsapp",
            "to": "5591986399496",
            "type": "template",
            "template": {
                "name": "atualizacao_de_preco",
                "language": {
                    "code": "pt_BR"
                },
                "components": [{
                    "type": "body",
                    "parameters": [{
                        "type": "text",
                        "text": codprod
                    }, {
                        "type": "text",
                        "text": vlrvenda
                    }]
                }]
            }
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao executar a solicitação');
            }
            return response.json(); // Retorna os dados em formato JSON
        })
        .then(data => {
            console.log(data); // Faz algo com os dados recebidos
        })
        .catch(error => {
            console.error('Houve um erro:', error);
        });
}

// Função de conexão e execução de consulta
async function executeQuery() {
    try {
        // Conecta ao banco de dados
        await sql.connect(config);

        // Executa uma consulta
        const result = await sql.query`SELECT NUTAB, CODPROD, VLRVENDA FROM TGFEXC WHERE NUTAB = (SELECT MAX(NUTAB) [NUTAB] FROM TGFEXC)`;

        for (let i = 1; i <= 5; i++) {
            var codprod = result.recordset[i].CODPROD
            var vlrvenda = result.recordset[i].VLRVENDA
            sendMessage(codprod, vlrvenda)
        }

    } catch (err) {
        console.log(err); // Exibe erros, se houverem
    } finally {
        // Fecha a conexão
        sql.close();
    }
}

// Chama a função para executar a consulta
executeQuery()


