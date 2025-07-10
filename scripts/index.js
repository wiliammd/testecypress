const lower = (value) => {
    return value.toLowerCase()
}
const capitalize = (value) => {
    return value.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

const isValid = (value) => {
    const validate = {
        empty: value !== "",
        blank: value !== null,
        undefined: value !== undefined
    }

    return validate.blank && validate.empty && validate.undefined
};

const BASE_API_URL = 'http://localhost:3000';
const headers = new Headers({
    'accept': '*/*',
    'Content-Type': 'application/json'
})
const myInit = {
    headers,
    method: "POST",
    mode: "cors",
    cache: "default",
};

function handleSubmit(event) {
    event.preventDefault()
}

async function login() {
    const user = document.getElementsByName("user")[0].value
    const psw = document.querySelector("input[type='password']").value

    if (isValid(lower(user)) && isValid(psw)) {
        const request = new Request(`${BASE_API_URL}/login`, { ...myInit, body: `{"email": "${user}", "password": "${psw}"}` })

        const logged = await fetch(request)
            .then(res => res.status)

        if (logged === 201) window.location.href = 'user.html'
    }
}

async function logout() {
    const request = new Request(`${BASE_API_URL}/logout`, { ...myInit })

    const logoff = await fetch(request)
        .then(res => res.status)

    if (logoff === 201) window.location.href = 'login.html'
}

async function signUp(event) {
    event.preventDefault()
    const name = capitalize(document.querySelector("input[name='name']").value)
    const user = lower(document.querySelector("input[type='email']").value)
    const psw = document.querySelector("input[id='password']").value

    if (isValid(user) && isValid(psw)) {
        const request = new Request(`${BASE_API_URL}/register`, { ...myInit, body: `{"name": "${name}", "email": "${user}", "password": "${psw}"}` })

        const register = await fetch(request)
            .then(res => res.status)

        if (register === 201) window.location.href = 'login.html'
    }
}

async function isAlreadyLogged() {
    const isLogged = await fetch('../data/loggedIn.json')
        .then(res => res.json())
        .then(data => data)

    if (!!isLogged.length) window.location.href = 'user.html'
}

async function createTicket(event) {
    event.preventDefault()
    const email = document.querySelector("input[type='email']").value
    const description = document.querySelector("input[type='text']").value

    let request = new Request(`${BASE_API_URL}/users`, { ...myInit, method: 'GET' })

    const users = await fetch(request)
        .then(res => res.json())
        .then(data => data)

    const currentUser = users.filter(us => us.email === email)[0]

    request = new Request(`${BASE_API_URL}/tickets`, { ...myInit, body: `{"userId": "${currentUser?.id}", "description": "${description}" }` })

    await fetch(request)
        .then(res => res.json())
        .then(data => data)
}

async function createUser(event) {
    event.preventDefault()
    const name = document.getElementsByName("name")[0].value
    const email = document.getElementsByName("email")[0].value

    request = new Request(`${BASE_API_URL}/users`, { ...myInit, body: `{"name": "${name}", "email": "${email}" }` })

    await fetch(request)
        .then(res => res.json())
        .then(data => data)
}

function triggerModal() {
    const modal = document.querySelector('body>div+div+div')
    modal.style = 'display: block'
}

function triggerModalCreateUser(event) {
    triggerModal()

    document.querySelector("#modal-button").addEventListener('click', () =>  createUser(event), false)
}

function closeModal() {
    const modal = document.querySelector('body>div+div+div')
    modal.style = 'display: none'
}