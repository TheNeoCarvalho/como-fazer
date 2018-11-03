const express = require('express')

const app = express()
const axios = require('axios')
const bodyParser = require('body-parser')

const api = require('./api');

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded())

const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
    res.render('home/index')
})

app.get('/Posts', async (req, res) => {
    const content = await axios.get('https://como-fazer-manolo.firebaseio.com/Posts.json')
    
    if(content.data){
        const posts = Object
                            .keys(content.data)
                            .map(key => {
                                return {
                                    id: key,
                                    ...content.data[key]
                                }
                            })
        res.render('posts/index', { posts: posts })
    }else {
        res.render('posts/index', { posts: [] })
    }
    
}) 

app.get('/categoria/novo', (req, res) => {
    res.render('categoria/novo')
})

app.get('/posts/novo', (req, res) => {
    res.render('posts/novo')
})

app.post('/categoria/novo', async (req, res) => {
    await axios.post('https://como-fazer-manolo.firebaseio.com/Categoria.json',
        { 
            categoria : req.body.categoria 
        })
    res.redirect('/categoria')
})

app.post('/posts/novo', async (req, res) => {
    await axios.post('https://como-fazer-manolo.firebaseio.com/Posts.json',
        { 
            post : req.body.post,
            msg : req.body.msg
        })
    res.redirect('/posts')
})

app.get('/categoria', async (req, res)=> {
    const categorias = await api.list('Categoria')
    res.render('categoria/index', { categorias })
})

app.get('/categoria/excluir/:id', async(req, res) => {
    await api.apagar('Categoria', req.params.id)
    res.redirect('/categoria')
})

app.get('/posts/excluir/:id', async(req, res) => {
    await axios.delete(`https://como-fazer-manolo.firebaseio.com/Posts/${req.params.id}.json`)
    res.redirect('/posts')
})

app.get('/categoria/editar/:id', async(req, res) => {
  const categoria = await api.Patualiza('Categoria', req.params.id)
  res.render('categoria/editar', 
    { 
        categoria
    })
})

app.get('/posts/editar/:id', async(req, res) => {
    const content = await axios.get(`https://como-fazer-manolo.firebaseio.com/Posts/${req.params.id}.json`)
    res.render('posts/editar', 
        {
            post: {
                id: req.params.id,
                ...content.data
            }
        }
    )
})

app.post('/categoria/editar/:id', async(req, res) => {
    await api.atualiza('Categoria', req.params.id, {
        categoria: req.body.categoria
    })
    res.redirect('/categoria')
})

app.post('/posts/editar/:id', async(req, res) => {
    await axios.put(`https://como-fazer-manolo.firebaseio.com/Posts/${req.params.id}.json`,
    {
        post: req.body.post,
        post: req.body.msg,

    })
    res.redirect('/posts')
})

app.listen(port , (err) => {
    if(err){
        console.log('Erro!');
    }else{
        console.log('App listening on port '+ port);
    }
});