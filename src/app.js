import express from 'express'
const app = express()

app.get('/', (req, res) => {
  res.end('<h1>Hello, welcome!</h1>')
})

app.listen(3000, _ => {
  console.log('Server was ruunning at localhost: 3000!')
})