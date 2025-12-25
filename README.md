🎓 SchoolHub – Pocket Money & Laundry Management System

A lightweight school management system designed to track student pocket money and laundry records for boarding schools.
Built with Laravel (Backend) and React (Frontend), focused on simplicity, accuracy, and real-world usage.

🚀 Features
👨‍🎓 Student Management

Add & manage students

Track monthly pocket money allocation

Record pocket money given to students

Auto calculate remaining balance

💰 Pocket Money Tracking

Monthly pocket money setup

Daily / multiple transactions

Year & month based reports

No rounding issues (exact amounts)

🧺 Laundry Management

Track clothes washed per student

Monthly dhobi (laundry staff) records

Per-student & per-month laundry summary

Dhobi workload & history tracking

📊 Reports

Monthly pocket money report

Laundry usage report

Student-wise summaries

Filter by month & year

🔐 Authentication

Single Admin user

Secure login / logout

Token-based authentication

Protected routes (frontend + backend)

🛠 Tech Stack
Backend

Laravel 12+

Eloquent ORM

MySQL / MariaDB

Sanctum (Auth tokens)

REST-style Controllers

Frontend

React

React Router

Tailwind CSS

Shadcn UI

Lucide Icons

Toast Notifications

Global Loader

📂 Project Structure
schoolhub/
│
├── backend/               # Laravel Project
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── public/
│
├── frontend/              # React App
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│
└── README.md

⚙️ Installation Guide
🔹 Backend (Laravel)
git clone https://github.com/your-username/schoolhub.git
cd backend
composer install
cp .env.example .env
php artisan key:generate


Database setup

php artisan migrate
php artisan db:seed


Run server:

php artisan serve

🔹 Frontend (React)
cd frontend
npm install
npm run dev

🔐 Authentication Flow

Admin logs in

Backend returns auth token

Token stored in localStorage

Protected routes validated

Logout clears token & redirects to login

📡 API Overview (Internal Use)
Method	Endpoint	Description
POST	/login	Admin login
POST	/logout	Logout
GET	/students	List students
POST	/pocket-money	Add pocket money
GET	/reports/monthly	Monthly report
POST	/laundry	Add laundry record
📅 Dynamic Date Handling

Auto-select current month & year

Year range: 2020 – 2050

Month names mapped to backend month numbers

🎨 UI & UX

Responsive sidebar layout

Global loader

Success / error toasts

Clean dashboard

Mobile-friendly navigation

🧠 Best Practices Used

✔ Clean architecture
✔ Secure authentication
✔ Scalable database design
✔ Reusable components
✔ No hard-coded dates
✔ Accurate financial calculations

## 📜 License

This project is **free and open for public use**.

You are allowed to:
- Use this project for personal or educational purposes
- Modify and customize the source code
- Share and distribute the project

Commercial usage is allowed with proper attribution to the author.



