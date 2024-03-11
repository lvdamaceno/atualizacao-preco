import { alertActualDateTime } from './assets/alertActualTime.js'
import { insertValues } from './render/renderInsert.js'
import sql from 'mssql'
import 'dotenv/config'

// ERP Connetion
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: { encrypt: false }
};

// Função de conexão e execução de consulta
async function getPricesFromErp() {
    try {
        // Conecta ao banco de dados
        await sql.connect(config);
        // Executa uma consulta
        const result = await sql.query(process.env.QUERY);
        const len = result.recordsets[0].length

        alertActualDateTime('Buscando novos preços...')

        for (let i = 0; i < len; i++) {
            var nutab = result.recordset[i].NUTAB
            var codprod = result.recordset[i].CODPROD
            var vlrvenda = result.recordset[i].VLRVENDA
            insertValues(nutab, codprod, vlrvenda)
            console.log(`${codprod} adicionado ao postgress`)
        }
    } catch (err) {
        console.log(err); // Exibe erros, se houverem
    } finally {
        // Fecha a conexão
        sql.close();
        console.log('Conexão com Sql Server fechada.')
    }
}

getPricesFromErp()

