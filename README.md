# College Voting Application

A production-ready MERN stack web application for college voting.

## 📂 Project Structure

### 🏗️ Root Directory
- **`/client`**: Contains the React + Vite frontend application.
- **`/server`**: Contains the Node.js + Express backend application.
- **`README.md`**: Project documentation (this file).
- **`.gitignore`**: Specifies files to be ignored by Git.

---

### 💻 Frontend Structure (`/client`)
The frontend is built with **React** and **Vite**.

- **`src/assets/`**: Static assets like images, fonts, and global icons.
- **`src/components/`**: Reusable UI components.
  - **`common/`**: Generic components (Buttons, Inputs, Modals) used across the app.
  - **`layout/`**: Structural components (Header, Footer, Sidebar, Layout wrappers).
- **`src/screens/`**: Page components representing full views.
  - **`auth/`**: Login, Register, and Forgot Password screens.
  - **`dashboard/`**: Protected views for Students and Admins.
  - **`voting/`**: Voting interface and results screens.
- **`src/services/`**: API calls and external service integrations (e.g., Axios setup).
- **`src/routes/`**: Route definitions and navigation logic.
- **`src/context/`**: Global state management (React Context API).
- **`src/hooks/`**: Custom React hooks for shared logic.
- **`src/utils/`**: Helper functions, constants, and formatters.
- **`App.jsx`**: Main application component and router entry point.
- **`main.jsx`**: Application entry point, rendering the React tree.

---

### ⚙️ Backend Structure (`/server`)
The backend is built with **Node.js** and **Express**.

- **`src/config/`**: Configuration files (Database connection, Environment variables).
- **`src/controllers/`**: Request handlers interacting with services/models.
- **`src/models/`**: Database schemas (Mongoose models).
- **`src/routes/`**: API Route definitions mapping endpoints to controllers.
- **`src/middleware/`**: Custom middleware (Auth checks, Error handling, Logging).
- **`src/services/`**: Business logic layer (separating logic from controllers).
- **`src/utils/`**: Helper functions and shared utilities.
- **`src/app.js`**: Express app initialization and middleware setup.
- **`server.js`**: Server entry point (starts the server/listens on port).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

### Installation
1. Setup Server:
   ```bash
   cd server
   npm install
   ```
2. Setup Client:
   ```bash
   cd client
   npm install
   ```

### Running the App
- **Development**: Run client and server concurrently (if configured) or in separate terminals.
