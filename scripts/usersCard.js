async function showCards(filteredUsers) {
    const cardContainer = document.getElementById('user-card-container');
    cardContainer.innerHTML = "";

    let users = await fetch('../data/users.json')
        .then(res => res.json())
        .then(data => data);

    users = filteredUsers ?? users;

    for (const us of users) {
        card = document.createElement('div')
        card.className = 'card';
        card.innerHTML = `
            <div class="info">
                <div class="upper">
                    ${us.name}
                </div>

                <div class="lower">
                    ${us.email}
                </div>
            </div>

            <div class="actions" id="action-${us.id}">
                <button onclick="triggerModalEdit(${us.id})"> <img src="../images/edit.png" alt="edit button"> </button>
                <button onclick="deleteCard(${us.id})"> <img src="../images/delete.png" alt="delete button"> </button>
            </div>
        `;

        cardContainer.appendChild(card)
    }
}

async function deleteCard(id) {
    const request = new Request(`${BASE_API_URL}/users/${id}`, { ...myInit, method: 'DELETE' })

    await fetch(request)
}

async function editCard(id) {
    const name = document.querySelector("input[name='name']").value
    const email = document.querySelector("input[name='email']").value

    request = new Request(`${BASE_API_URL}/users/${id}`, { ...myInit, method: 'PUT', body: `{ "name": "${name}", "email": "${email}" }` })

    const newUser = await fetch(request)
        .then(res => res)

    return newUser
}

async function triggerModalEdit(id) {
    const modal = document.querySelector('body>div+div+div')
    modal.style = 'display: block'

    const name = document.querySelector("input[name='name']")
    const email = document.querySelector("input[name='email']")

    let request = new Request(`${BASE_API_URL}/users/${id}`, { ...myInit, method: 'GET' })

    const currentUser = await fetch(request)
        .then(res => res.json())
        .then(data => data)

    name.value = `${currentUser.name}`
    email.value = `${currentUser.email}`

    const modalButton = document.querySelector("#modal-button") 

    modalButton.innerHTML = "Atualizar"
    modalButton.addEventListener('click', () => editCard(id), false)
}

async function filterCards(event) {
    event.preventDefault()

    const searchValue = document.querySelector("input[type='search']").value
    const request = new Request(`${BASE_API_URL}/users`, { ...myInit, method: 'GET' });

    const users = await fetch(request)
        .then(res => res.json())
        .then(data => data)

    const filteredUsers = users.filter(us => us.name.toLowerCase().includes(searchValue) || us.email.toLowerCase().includes(searchValue));

    showCards(filteredUsers)
}