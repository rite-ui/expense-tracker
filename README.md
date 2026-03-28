# 📊 Expensio - Smart Expense Tracker

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)

**Expensio** is a powerful Full-Stack Expense Management application. It helps users track their daily spending, categorize expenses, and visualize their financial health with a clean and modern dashboard.

### 🌐 Live Links
* **Frontend App:** [https://expense-tracker-woad-pi.vercel.app](https://expense-tracker-woad-pi.vercel.app)
* **Backend API:** [https://expense-tracker-4xp5.onrender.com](https://expense-tracker-4xp5.onrender.com)

---

## 📸 Screenshots

| Login & Security | Personal Dashboard |
| :---: | :---: |
| ![Login Page]("https://github.com/user-attachments/assets/ac0a7778-e1ea-415b-8ea0-6ad4e5e7f0e2")  | ![Dashboard]("https://github.com/user-attachments/assets/705e08af-a694-4ea0-8529-f1c910d2aeb7") |
| ![Transaction page]("https://github.com/user-attachments/assets/f79ad1d1-6f85-40d4-9d99-7db84be2cf94") | ![Analytics Page]("https://github.com/user-attachments/assets/f79ad1d1-6f85-40d4-9d99-7db84be2cf94") |

---

## ✨ Core Features

* **User Auth:** Secure registration and login using **JSON Web Tokens (JWT)**.
* **Expense CRUD:** Add, view, edit, and delete expense records effortlessly.
* **Data Visualization:** Monthly summaries and category-wise breakdowns.
* **CSV Export:** Download your financial data as a CSV file with one click.
* **Responsive UI:** Fully optimized for mobile, tablet, and desktop views using **Tailwind CSS**.

---

## 🛠️ Technical Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Axios, Lucide Icons.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Cloud Database).
* **Authentication:** JWT (Stored in LocalStorage) & Bcrypt for password hashing.

---

## ⚙️ Local Installation

### 1. Clone the Repo
```bash
git clone [https://github.com/rite-ui/expense-tracker.git](https://github.com/rite-ui/expense-tracker.git)
cd expense-tracker

### 2.
cd backend
npm install
# Create a .env file and add:
# PORT=3000
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_secret_key
npm start

cd ../frontend
npm install
# Create a .env file and add:
# VITE_API_URL=http://localhost:3000
npm run dev

👨‍💻 Developed By
Ritesh Github https://github.com/rite-ui | LinkedIn  https://www.linkedin.com/in/ritesh-ranjan-469a322b0/
