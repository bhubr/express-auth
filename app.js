const main = document.getElementById('main')



const formLoginHTML = `
    <form method="POST" action="/login">
      <p>Hint: try username foobar with pass FooBar, or username jondoe with pass JonDoe</p>
      <input name="username" placeholder="username" />
      <input name="password" placeholder="password" />
      <button type="submit" class="button">Submit</button>
    </form>

`

const showPageProtegee = () => {
  console.log('affichage page protégée')
  main.innerHTML = `
    <h2>Page protégée</h2>
    <p>On doit être authentifié pour arriver ici.</p>
  `
}


const showAccueil = () => {
  main.innerHTML = `<h2>Page accueil</h2>
  <a href="/login">Login</a>
  `
}


const showLogin = () => {
  main.innerHTML = formLoginHTML

  const form = document.getElementsByTagName('form')[0]
  form.addEventListener('submit', evt => {
    evt.preventDefault()
    // Récupère les champs du formulaire
    const data = {}
    const inputs = document.getElementsByTagName('input')
    for(input of inputs) {
      data[input.name] = input.value
    }
    // Envoie la requête de connexion
    fetch('/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      // 4. Permettre l'échange de cookies
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(user => {
      loggedInUser = user
      page('/page-protegee')
    })
  })

}

console.log(loggedInUser)

const checkLoginMiddleware = (context, next) => {
  console.log("exécuté avant l'affichage de la page")
  if(loggedInUser === undefined) {
    page('/login')
  }
  next()
}

page('/', showAccueil)
page('/login', showLogin)
page('/page-protegee', checkLoginMiddleware, showPageProtegee)

page()
