# Helpdesk Page - Ticket System

## 📌 Description
This Page was developed to manage a technical support system (Helpdesk), allowing the creation, consultation, updating, and deletion of users and tickets.

## 🚀 Tecnologies Used
- **HTML**
- **CSS**
- **Javascript**
- **Node.js**
- **Express.js**
- **Swagger** (API documentation)
- **JSON** (local database)

## 📂 Project Structure
```
/helpdesk-api
│── data/
│   ├── users.json       # User database
│   ├── tickets.json     # Ticket database
│── scripts/
│   ├── index.js
│   ├── ticketsCard.js
│   ├── usersCard.js
│── style/
│   ├── card.css
│   ├── common.css
│   ├── form.css
│   ├── header.css
│   ├── modal.css
│── swagger/
│   ├── swagger.json     # Swagger documentation
│── view/
│   ├── login.html
│   ├── signUp.html
│   ├── ticket.html
│   ├── user.css
│── server.cjs           # Main API file
│── package.json         # Project dependencies
│── README.md            # Project documentation
```

## 🔧 Installation and Execution
### 1️⃣ Clone the repository
```bash
git clone https://github.com/automacaohml/helpdesk-page.git
cd helpdesk-page
```
### 2️⃣ Install dependencies
```bash
npm install
```
### 3️⃣ Start the API
```bash
node server.cjs
-- The API will be running at `http://localhost:3000`
```
### 4️⃣ Deploying the page
You can deploy the page using [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
```

---
## 📌 API Endpoints
### **🔹 Sign**
| Method  | Route          | Description |
|---------|--------------|------------|
| **POST**    | `/login`        | Login into the page  |
| **POST**    | `/register`     | Register user        |
| **POST**    | `/logout`       | Logout of the page   |

### **🔹 Users**
| Method  | Route          | Description |
|---------|--------------|------------|
| **GET**    | `/users`         | Lists all users |
| **GET**    | `/users/:id`     | Fetches a user by ID |
| **POST**   | `/users`         | Creates a new user |
| **PUT**    | `/users/:id`     | Updates user data |
| **DELETE** | `/users/:id`     | Deletes a user |

### **🔹 Tickets**
| Method  | Route                | Description |
|---------|----------------------|------------|
| **POST**   | `/tickets`            | Creates a new ticket |
| **GET**    | `/tickets/:id`        | Fetches a ticket by ID |
| **PUT**    | `/tickets/:id/status` | Updates ticket status |
| **DELETE** | `/tickets/:id`        | Deletes a ticket |

---
## 📖 Swagger Documentation
The API has documentation generated with Swagger.



