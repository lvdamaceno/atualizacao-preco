const sql = require('mssql');
require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('database.db');

// Configuração de conexão com o banco de dados
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: { encrypt: false }
};

async function sendMessage(codprod, vlrvenda) {
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
                "to": process.env.PHONE,
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

function saveToBaseAndSendMessage(nutab, codprod, vlrvenda, newvlrvenda) {
    db.get("SELECT codprod FROM prices WHERE codprod = ? and vlrvenda = ?", [codprod, newvlrvenda], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (!row) {
            db.run("DELETE FROM prices WHERE CODPROD = ?", [codprod])
            db.run("INSERT INTO prices (nutab, codprod, vlrvenda) VALUES (?, ?, ?)", [nutab, codprod, vlrvenda], (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`O produto ${codprod} foi atualizado para o valor ${vlrvenda}`);
                // sendMessage(codprod, vlrvenda)
            })
        } else {
            console.log(`O produto ${codprod} já existe na tabela com valor ${vlrvenda}`);
        }
    })
}

// Função de conexão e execução de consulta
async function executeQuery() {
    try {
        // Conecta ao banco de dados
        await sql.connect(config);
        // Executa uma consulta
        const result = await sql.query(process.env.QUERY);
        const len = result.recordsets[0].length
        console.log('Conectando...')
        for (let i = 0; i < len; i++) {
            var nutab = result.recordset[i].NUTAB
            var codprod = result.recordset[i].CODPROD
            var vlrvenda = result.recordset[i].VLRVENDA
            var newvlrvenda = result.recordset[i].VLRVENDA
            saveToBaseAndSendMessage(nutab, codprod, vlrvenda, newvlrvenda)
        }
    } catch (err) {
        console.log(err); // Exibe erros, se houverem
    } finally {
        // Fecha a conexão
        sql.close();
        db.close();
    }
}

// Definindo a função que você deseja executar
function minhaFuncao() {
    console.log('Executando minha função...');
    // Adicione o código que você deseja executar aqui
}

// Executar a função a cada segundo usando setInterval
// setInterval(executeQuery, 15000); // 1000 milissegundos = 1 segundo

executeQuery()
