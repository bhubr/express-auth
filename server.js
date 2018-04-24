const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()
app.use(session({ secret: "cats", resave: true, saveUninitialized: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const users = [
  { id: 1, username: 'foobar', email: 'foobar@foo.bar', password: 'FooBar' },
  { id: 2, username: 'jondoe', email: 'jondoe@foo.bar', password: 'JonDoe' }
]

app.get('/', (req, res) => {
  console.log(req.session, req.session.user)
  const who = (req.session && req.session.user) ?
    req.session.user.username : 'guest. <a href="/login">Please log in</a>'
  res.send(`Hello ${who}`)
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  const foundUser = users.find(u => u.username === username)
  if(! foundUser || foundUser.password !== password) {
    return res.status(401).json({ error: 'Bad Dobby' })
  }
  req.session.user = foundUser
  // res.json(foundUser)
  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <p>Hint: try username foobar with pass FooBar, or username jondoe with pass JonDoe</p>
      <input name="username" placeholder="username" />
      <input name="password" placeholder="password" />
      <button type="submit" class="button">Submit</button>
    </form>
    <script>
      // const form = document.getElementsByTagName('form')[0]
      // form.addEventListener('submit', evt => {
      //   evt.preventDefault()
      //   const data = {}
      //   const inputs = document.getElementsByTagName('input')
      //   for(input of inputs) {
      //     data[input.name] = input.value
      //   }
      //   fetch('/login', {
      //     method: 'POST',
      //     headers: {
      //       Accept: 'application/json',
      //       'Content-Type': 'application/json'
      //     },
      //     credentials: true,
      //     body: JSON.stringify(data)
      //   })
      //   .then(r => r.json())
      //   .then(data => {
      //     fetch('/')
      //   })
      // })
    </script>
  `)
})

/**
 * Pour pouvoir répondre aux requêtes, l'application
 * doit d'abord ECOUTER sur un "port" (un canal de communication)
 */
const message = `Lancement de l'app Express: http://localhost:4000`
console.log(message)
app.listen(4000)
