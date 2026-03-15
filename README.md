# 🚀 Online Examination System

A full-stack online exam platform for creating, attempting, and managing exams. Supports admin and student roles with real-time timers, result tracking, and PDF exports.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20MongoDB-green)](https://nodejs.org)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20Tailwind-blue)](https://react.dev)

## ✨ Features

- **Authentication & Authorization**: Secure login/register with JWT. Role-based access (Admin/Student).
- **Admin Dashboard**: Create, edit, view exams. Manage users/exams.
- **Student Dashboard**: View available exams, attempt with timer.
- **Real-time Exam Attempt**: Timer component, question navigation, submit answers.
- **Results Management**: Auto-calculate scores, view/download results as PDF (using jsPDF).
- **Responsive UI**: TailwindCSS, modern React components.
- **API Proxy**: Seamless frontend-backend communication.

## 🛠️ Tech Stack

| Layer        | Technologies                                                         |
| ------------ | -------------------------------------------------------------------- |
| **Backend**  | Node.js, Express 5, Mongoose, MongoDB, JWT, bcryptjs                 |
| **Frontend** | React 19, Vite, TailwindCSS v4, React Router, Axios, React Hook Form |
| **Utils**    | jsPDF (PDF export), dayjs (dates), react-hot-toast (notifications)   |
| **Other**    | CORS, dotenv, Nodemon (dev)                                          |

## 📋 Prerequisites

- Node.js **18+**
- MongoDB (Atlas recommended)
- npm/yarn

## 🔧 Installation

1. **Clone the repo** (adjust if no repo):

   ```bash
   git clone <your-repo-url> online-exam-system
   cd online-exam-system
   ```

2. **Backend Setup**:

   ```bash
   cd backend
   npm install
   cp .env.example .env  # Create after step below
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

## 🌍 Environment Variables

Create `backend/.env`:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**ProTip**: Use MongoDB Atlas free tier. Replace `your_mongodb_connection_string` with: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/examsdb`

## ▶️ Running the Project

1. **Start Backend**:

   ```bash
   cd backend
   npm run dev
   ```

   Server runs on `http://localhost:5000`

2. **Start Frontend** (new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on `http://localhost:5173`

Frontend proxies API calls to backend automatically.

## 📡 API Endpoints

| Method | Endpoint             | Description         | Auth? | Role          |
| ------ | -------------------- | ------------------- | ----- | ------------- |
| POST   | `/api/auth/register` | Register user       | No    | -             |
| POST   | `/api/auth/login`    | Login user          | No    | -             |
| GET    | `/api/exams`         | List exams          | Yes   | Student/Admin |
| POST   | `/api/exams`         | Create exam (admin) | Yes   | Admin         |
| PUT    | `/api/exams/:id`     | Edit exam           | Yes   | Admin         |
| POST   | `/api/results`       | Submit exam results | Yes   | Student       |
| GET    | `/api/results`       | Get results         | Yes   | Student/Admin |

**Full docs**: Check controllers (authController.js, examController.js, resultController.js).

## 🎨 Screenshots

Add screenshots here:

- ![Home](frontend/src/assets/hero.png)
- Admin Dashboard: (upload & link)
- Exam Attempt: (upload & link)

## 👥 Role-based Usage

1. **Student**:
   - Register/Login → Student Dashboard → Attempt Exam → Submit → View Results (PDF).

2. **Admin**:
   - Login as admin → Admin Dashboard → Create/Edit Exams → View Results.

**Test Accounts**: Create via register (role: 'student'/'admin').

## 📄 PDF Results Export

Uses jsPDF + jspdf-autotable. Generates exam results table as downloadable PDF in Result.jsx.

## 🔍 Troubleshooting

- **CORS Error**: Ensure frontend proxy in `vite.config.js`, backend CORS origin `http://localhost:5173`.
- **DB Connection**: Check MONGO_URI, whitelist IP in Atlas.
- **Port Conflict**: Change PORT in .env.
- **JWT Issues**: Verify JWT_SECRET.
- **Build**: `npm run build` (frontend), serve `dist/`.

## 🤝 Contributing

1. Fork & PR.
2. Follow ESLint/Prettier.
3. Test changes.

## 📄 License

MIT License - see [LICENSE](LICENSE) (create if needed).

## 🙌 Acknowledgments

Built with ❤️ using modern web tech. Stars welcome!

---

**Happy Examining! 🎓**
⭐ Star on GitHub if useful.
