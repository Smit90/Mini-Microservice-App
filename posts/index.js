const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')

const app = express()

const posts = {}

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({ message: "This is posts service" })
})

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex')
    const { title } = req.body

    posts[id] = { id, title }

    res.status(201).send(posts[id])
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
})