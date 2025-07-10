
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const { error } = require('console');
const PORT = 3000;

app.use(express.json());
app.use(cors())
app.options('*', cors())

const exists = (login, users) => {
  return users.some(user => user.email === login.email && user.password && login.password );
}

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const ticketsFilePath = path.join(__dirname, 'data', 'tickets.json');
const loggedFilePath = path.join(__dirname, 'data', 'loggedIn.json');
const registerFilePath = path.join(__dirname, 'data', 'register.json')

const readFile = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf8');
  return data ? JSON.parse(data) : [];
};

const saveFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// USERS
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const logged = readFile(loggedFilePath);
  const users = readFile(registerFilePath);

  if (!exists({ email, password }, users)) {
    return res.status(400).json({ error: 'Email/Password invalid' })
  }

  if (!!logged.length) {
    return res.status(400).json({ error: 'An user is already logged into' })
  }

  const newLogged = { email, password };
  logged.push(newLogged);
  saveFile(loggedFilePath, logged);

  res.status(201).json("Logged in successfully.");
})

app.post('/logout', (req, res) => {
  const logged = readFile(loggedFilePath);

  if (!logged.length) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  logged.pop()
  saveFile(loggedFilePath, logged);

  res.status(201).json("Logged out successfully.")
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'The fields name/email/password are required.' });
  }

  const register = readFile(registerFilePath);

  const userExists = register.some(user => user.email === email);
  if (userExists) {
    return res.status(409).json({ error: 'A user with this email already exists.' });
  }

  const newUser = { id: register.length + 1, name, email, password };
  register.push(newUser);
  saveFile(registerFilePath, register);

  res.status(201).json(newUser);
})

// List Users
app.get('/users', (req, res) => {
  const users = readFile(usersFilePath);
  res.json(users);
});

// ID Users
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const users = readFile(usersFilePath);
  const user = users.find(user => user.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  res.json(user);
});

// New Users
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'The fields name and email are required.' });
  }

  const users = readFile(usersFilePath);

  const userExists = users.some(user => user.name === name || user.email === email);
  if (userExists) {
    return res.status(409).json({ error: 'A user with this name or email already exists.' });
  }

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  saveFile(usersFilePath, users);

  res.status(201).json(newUser);
});

// Update Users
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  let users = readFile(usersFilePath);
  const userIndex = users.findIndex(user => user.id === parseInt(id));

  const userExists = users.some(user => user.email === email);

  if (userExists) {
    return res.status(409).json({ error: 'A user with this email already exists.'})
  }

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;

  saveFile(usersFilePath, users);
  res.json({ message: 'User updated successfully.', user: users[userIndex] });
});

// Delete Users
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let users = readFile(usersFilePath);
  const userIndex = users.findIndex(user => user.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  saveFile(usersFilePath, users);

  res.json({ message: 'User deleted successfully.', user: deletedUser });
});

// TICKETS

// Creat tickets
app.post('/tickets', (req, res) => {
  const { userId, description } = req.body;

  if (!userId || !description) {
    return res.status(400).json({ error: 'The fields userId and description are required.' });
  }

  const users = readFile(usersFilePath);
  const userExists = users.some(user => user.id === parseInt(userId));

  if (!userExists) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const tickets = readFile(ticketsFilePath);
  const newTicket = {
    id: tickets.length + 1,
    userId: parseInt(userId),
    description,
    status: 'Open',
    createdAt: new Date().toISOString()
  };

  tickets.push(newTicket);
  saveFile(ticketsFilePath, tickets);

  res.status(201).json(newTicket);
});

// List tickets
app.get('/tickets', (res) => {
  const tickets = readFile(ticketsFilePath);
  res.json(tickets);
});

// Find tickets
app.get('/tickets/:id', (req, res) => {
  const { id } = req.params;
  const tickets = readFile(ticketsFilePath);
  const ticket = tickets.find(ticket => ticket.id === parseInt(id));

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found.' });
  }

  res.json(ticket);
});

// Update status
app.put('/tickets/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(id)
  console.log(status)

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  let tickets = readFile(ticketsFilePath);
  const ticketIndex = tickets.findIndex(ticket => ticket.id === parseInt(id));

  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket not found.' });
  }

  tickets[ticketIndex].status = status;
  saveFile(ticketsFilePath, tickets);

  res.json({ message: 'Ticket status updated successfully.', ticket: tickets[ticketIndex] });
});

// Delete tickets
app.delete('/tickets/:id', (req, res) => {
  const { id } = req.params;

  let tickets = readFile(ticketsFilePath);
  const ticketIndex = tickets.findIndex(ticket => ticket.id === parseInt(id));

  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket not found.' });
  }

  const deletedTicket = tickets.splice(ticketIndex, 1)[0];
  saveFile(ticketsFilePath, tickets);

  res.json({ message: 'Ticket deleted successfully.', ticket: deletedTicket });
});



app.all('/users', (req, res, next) => {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Invalid request method.' });
  }
  next();
});

app.all('/users/:id', (req, res, next) => {
  if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Invalid request method.' });
  }
  next();
});

app.all('/tickets/:id', (req, res, next) => {
  if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Invalid request method.' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});