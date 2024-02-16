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
            'Authorization': process.env.TOKEN,
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

        // for (let i = 1; i <= result.recordsets[0].length; i++) {
        //     var codprod = result.recordset[0][i].CODPROD
        //     console.log(codprod)
        //     var vlrvenda = result.recordset[0][i].VLRVENDA
        //     console.log(vlrvenda)

        //     // sendMessage(codprod, vlrvenda)
        // }

        console.log(result.recordsets[0][2].CODPROD)

    } catch (err) {
        console.log(err); // Exibe erros, se houverem
    } finally {
        // Fecha a conexão
        sql.close();
    }
}

// Chama a função para executar a consulta
executeQuery()


