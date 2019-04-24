const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

/**
 * Nunjucks utilizado para renderizar templates HTML e permite a passagem de
 * parâmetros para view.
 */
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.use(express.urlencoded({ extended: false }))

// Configura o nunjucks para renderizar arquivos njk
app.set('view engine', 'njk')

/**
 * Middleware reponsável por interceptar e verificar se a idade foi informada
 * ou não.
 * @param {*} req
 * @param {*} res
 * @param {*} next - Função que permite o fluxo da aplicação continuar em caso
 * de sucesso
 */
const noAgeInformCheck = (req, res, next) => {
  const { age } = req.query

  if (!age) {
    return res.redirect('/')
  }

  return next()
}

// View inicial com o formulário para informar a idade
app.get('/', (req, res) => {
  return res.render('formage')
})

/**
 * View renderizada caso a idade informada seja = ou maior de 18 anos
 * Aqui utilizamos o middleware para verificar se a idade foi informada
 */
app.get('/major', noAgeInformCheck, (req, res) => {
  const { age } = req.query
  return res.render('major', { age })
})

/**
 * View renderizada caso a idade informada seja menoor de 18 anos
 * Aqui utilizamos o middleware para verificar se a idade foi informada
 */
app.get('/minor', noAgeInformCheck, (req, res) => {
  const { age } = req.query

  return res.render('minor', { age })
})

/**
 * Rota que verifica se a idade informada é de maior ou menor e direciona para
 * view correspondente passando parametro idade via Query.
 */
app.post('/check', (req, res) => {
  const { age } = req.body
  if (age >= 18) {
    return res.redirect(`/major?age=${age}`)
  } else {
    return res.redirect(`/minor?age=${age}`)
  }
})

// Porta do servidor local utilizado para carregar a aplicação
app.listen(3000)
