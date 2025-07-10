const formatDate = (date) => {
    return new Date(date).toDateString()
}

async function showCards(filteredTickets) {
    const cardContainer = document.querySelector('body>div+div');
    cardContainer.innerHTML = "";

    let tickets = await fetch('../data/tickets.json')
        .then(res => res.json())
        .then(data => data);

    tickets = filteredTickets ?? tickets;

    for (const tkt of tickets) {
        card = document.createElement('div')
        card.className = 'card';
        card.innerHTML = `
            <div class="info">
                <div class="upper">
                    ${tkt.description}
                </div>

                <div class="lower">
                    ${tkt.status}
                    <span>${formatDate(tkt.createdAt)}</span>
                </div>
            </div>

            <div class="actions" id="action-${tkt.id}">
                <button onclick="editCard(${tkt.id})"> <img src="../images/edit.png" alt="edit button"> </button>
                <button onclick="deleteCard(${tkt.id})"> <img src="../images/delete.png" alt="delete button"> </button>
            </div>
        `;

        cardContainer.appendChild(card)
    }
}

async function deleteCard(id) {
    const request = new Request(`${BASE_API_URL}/tickets/${id}`, { ...myInit, method: 'DELETE' })

    await fetch(request)
}

async function editCard(id) {
    const STATUS = ['Open', 'In Progress', 'Closed']

    let request = new Request(`${BASE_API_URL}/tickets/${id}`, { ...myInit, method: 'GET' })

    const ticket = await fetch(request)
        .then(res => res.json())
        .then(data => data)

    let newStatus = STATUS[STATUS.indexOf(ticket.status) + 1];
    newStatus = !newStatus ? STATUS[0] : newStatus;

    request = new Request(`${BASE_API_URL}/tickets/${id}/status`, { ...myInit, method: 'PUT', body: `{ "status": "${newStatus}" }` })

    await fetch(request)
}

async function filterCards(event) {
    event.preventDefault();

    const searchValue = document.querySelector("select").options;
    const currentValue = searchValue[searchValue.selectedIndex].value;

    const tickets = await fetch('../data/tickets.json')
        .then(res => res.json())
        .then(data => data);

    const filteredTickets = tickets.filter(tkt => tkt.status.includes(currentValue));

    showCards(filteredTickets)
}
