const express = require('express')
const bodyParser = require('body-parser')

// 1. Ajouter module session
const session = require('express-session')

const app = express()

app.use(express.static(__dirname))
// 2 .Ajouter utilisation du module session
app.use(session({ secret: "cats", resave: true, saveUninitialized: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const users = [
  { id: 1, username: 'foobar', email: 'foobar@foo.bar', password: 'FooBar' },
  { id: 2, username: 'jondoe', email: 'jondoe@foo.bar', password: 'JonDoe' }
]

// 5. Tester la présence de l'objet user dans req.session
const checkLoggedInUser = (req, res, next) => {
  if(req.session !== undefined &&
     req.session.user !== undefined
  ) {
    // Je sais que j'ai un user connecté
    const user = req.session.user
    next()
  }
  else {
    res.status(401).json({
      error: 'Unauthorized Access'
    })
  }
}

// NE PAS FAIRE !! EMPECHE L'ACCES A TOUTES LES ROUTES
//app.use(checkLoggedInUser)

// Une route protégée

// Page d'accueil
// app.get('/', (req, res) => {
//   if(req.session !== undefined &&
//      req.session.user !== undefined
//   ) {
//     // Je sais que j'ai un user connecté
//     const user = req.session.user
//     res.send(`Hello ${user.username}`)
//   }
//   else {
//     // Aucun user connecté
//     res.send('Hello guest. <a href="/login">Please log in</a>')
//   }
//
//   // Façon courte
//   // const who = (req.session && req.session.user) ?
//   //   req.session.user.username : 'guest. <a href="/login">Please log in</a>'
//   // res.send(`Hello ${who}`)
// })

app.get('/logout', (req, res) => {
  delete req.session.user
  res.json({ success: true })
})

// Gère la récupération des données du formulaire de login
app.post('/login', (req, res) => {
  console.log(req.body)
  // ES5: deux lignes
  // const username = req.body.username
  // const password = req.body.password

  // ES6: la même chose en une ligne
  const { username, password } = req.body
  const foundUser = users.find(u => u.username === username)
  if(! foundUser || foundUser.password !== password) {
    return res.status(401).json({ error: 'Bad Dobby' })
  }

  // 3. Stocker l'utilisateur trouvé dans la session
  req.session.user = foundUser
  res.json(foundUser)
})

// Affiche le formulaire de login
// app.get('/login', (req, res) => {
//   res.send(
//   /* @html */`
//     <form method="POST" action="/login">
//       <p>Hint: try username foobar with pass FooBar, or username jondoe with pass JonDoe</p>
//       <input name="username" placeholder="username" />
//       <input name="password" placeholder="password" />
//       <button type="submit" class="button">Submit</button>
//     </form>
//     <h6>Réponse du serveur</h6>
//     <div id="result"></div>
//     <script>
//     </script>
//   `)
// })

// On a transformé l'indexHtml statique en fonction
const indexHtml = user => /* @html */ `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Auth Express</title>
  </head>
  <body>
    <!-- #alert-wrapper is where the JS app inserts notifications -->
    <div id="alert-wrapper" class="alert" role="alert"></div>
    <!-- #main is where the JS app inserts HTML content -->
    <main id="main" role="main" class="container"></main>
    <script src=page.js></script>
    <script>
    // On transforme l'user passé en paramètre en string
    let loggedInUser = ${ JSON.stringify(user) }
    </script>
    <script src=app.js></script>
  </body>
</html>
`

app.get('*', (req, res) => {
  res.send(indexHtml(req.session.user))
})

/**
 * Pour pouvoir répondre aux requêtes, l'application
 * doit d'abord ECOUTER sur un "port" (un canal de communication)
 */
const message = `Lancement de l'app Express: http://localhost:4000`
console.log(message)
app.listen(4000)
