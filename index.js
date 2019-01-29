const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Welcome to Lessn!!'))

app.listen(port, () => console.log('Lessn is now running at port ${port}!'))