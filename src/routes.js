//Importações
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const routes = express()
const googleSpreadSheet = require('google-spreadsheet')
const credentials = require('../googleApiKey.json')
const {promisify} = require('util')
//Setando middleware
routes.set('view engine', 'ejs')
routes.set('views', path.resolve(__dirname,'views'))
routes.use(bodyParser.urlencoded({ extended:true }))

//Config plan google
const docId = '1_bxMimZQNP0tlFXjjZCJ1CyAnjgveBJqyZSz6PcAp4Y'
const worksheetIndex = 0

routes.get('/', (req,resp) => resp.render('home'))

routes.post('/',
    async (req, res) => {
        try {
            const doc = new googleSpreadSheet(docId)
            await promisify(doc.useServiceAccountAuth)(credentials)
            const info = await promisify(doc.getInfo)()
            const worksheet = info.worksheets[worksheetIndex]
            const {name, email} = req.body
            await promisify(worksheet.addRow)({name,email})
            res.send('Bug reportado com sucesso!')
        } catch (err) {
            res.send('Erro ao enviar formulário!')
            console.log('erro', err)
        }
    }
)

module.exports = routes
/* Metodo Com callback apenas
routes.post('/',async (req,resp) => {
    const {name,email} = req.body
    const doc = new googleSpreadSheet(docId)
    try {
        await doc.useServiceAccountAuth(credentials, (err)=>{
            if (err) {
                console.log('Não foi possivel abrir a planilha')
            } else {
                console.log('Planilha aberta')
                doc.getInfo( async(err,info) => {
                    const worksheet = info.worksheets[worksheetIndex]
                    await worksheet.addRow({name:name,email:email},err =>{
                        console.log('Linha inserida')
                    })
                })
            }
        })    
    } catch (err) {
        console.log('Erro: ',err)
    }
    
})*/

