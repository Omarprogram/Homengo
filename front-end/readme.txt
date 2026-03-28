# Fanni

Fanni is a full-stack service booking platform with an admin dashboard, user authentication, booking management, and more.

## Features

- User registration and login (JWT authentication)
- Role-based access (admin, client, worker)
- Service and category management
- Booking creation, manual bookings (admin), and status updates
- Admin dashboard with statistics and charts
- Feedback and review system

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT
- **Email:** Nodemailer (SMTP)
- **Other:** React Big Calendar, Chart.js

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/fanni.git
   cd fanni
   ```

2. **Backend Setup**
   ```sh
   cd back-end
   npm install
   ```
   - Create a `.env` file in `back-end`:
     ```
     MONGO_URI=mongodb://127.0.0.1:27017/fanni_db
     PORT=5000
     JWT_SECRET=your_jwt_secret
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     EMAIL_FROM=noreply@yourcompany.com
     ```

   - Start the backend:
     ```sh
     npm run dev
     ```

3. **Frontend Setup**
   ```sh
   cd ../front-end
   npm install
   ```
   - Create a `.env` file in `front-end`:
     ```
     VITE_API_URL=http://localhost:5000
     ```

   - Start the frontend:
     ```sh
     npm run dev
     ```

4. **Access the app**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## Usage

- Register as a user via the frontend or API.
- To create an admin, register a user and manually set their `role` to `"admin"` in the database.
- Admins can manage services, categories, bookings, and view analytics.

## Folder Structure

```
fanni/
  back-end/
    src/
      controllers/
      models/
      routes/
      config/
    .env
    server.js
  front-end/
    src/
      components/
      pages/
      assets/
    .env
    main.jsx
```

## API Endpoints

- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login and get JWT
- `GET /api/bookings` — Get bookings (admin)
- `POST /api/bookings/manual` — Create manual booking (admin)
- ...and more

## License

MIT

---

**For questions or contributions, please open an issue or pull request.**