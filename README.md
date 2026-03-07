# DevTinder

A matchmaking platform tailored for developers to connect and collaborate on projects, ideas, or mentorship — inspired by the Tinder swipe-style UX. Built using the **MERN** stack.

---

## About

DevTinder lets developers create a profile, browse other developers in a card-based feed, send connection requests (Interested / Ignore), and manage incoming requests (Accept / Reject). Once a connection is accepted, both developers appear in each other's Connections list.

---

## Tech Stack

### Frontend

| Technology     | Version | Purpose                    |
| -------------- | ------- | -------------------------- |
| React          | 18.3    | UI library                 |
| Vite           | 6.0     | Build tool & dev server    |
| React Router   | 7.1     | Client-side routing        |
| Redux Toolkit  | 2.5     | Global state management    |
| Axios          | 1.7     | HTTP client                |
| Tailwind CSS   | 3.4     | Utility-first CSS          |
| DaisyUI        | 4.12    | Tailwind component library |
| React Toastify | 11.0    | Toast notifications        |
| React Icons    | 5.4     | Icon components            |

### Backend

| Technology    | Version | Purpose                         |
| ------------- | ------- | ------------------------------- |
| Node.js       | —       | Runtime environment             |
| Express.js    | 4.21    | Web framework                   |
| MongoDB       | —       | NoSQL database                  |
| Mongoose      | 8.8     | MongoDB ODM                     |
| bcrypt        | 5.1     | Password hashing                |
| jsonwebtoken  | 9.0     | JWT authentication              |
| validator     | 13.12   | Input validation                |
| cookie-parser | 1.4     | Cookie parsing middleware       |
| cors          | 2.8     | Cross-Origin Resource Sharing   |
| dotenv        | 16.5    | Environment variable management |
| multer        | 1.4     | Profile picture file uploads    |

---

## Project Structure

```
dev-tinder/
├── README.md
├── Backend/
│   ├── package.json
│   ├── DOCUMENTATION.md          # Detailed backend documentation
│   └── src/
│       ├── app.js                # Express app entry point
│       ├── config/database.js    # MongoDB connection
│       ├── middlewares/auth.js   # JWT auth middleware
│       ├── models/
│       │   ├── user.js           # User schema & model
│       │   └── connectionRequest.js  # Connection request model
│       ├── routes/
        │   ├── auth.js           # Signup, Login, Logout, Forgot Password (public)
        │   ├── profile.js        # View/Edit profile, Photo upload, Password change
        │   ├── request.js        # Send & review connection requests
        │   └── user.js           # Feed, Connections, Received requests
        ├── uploads/          # Uploaded profile pictures (served as static files)
│       └── utils/valiadation.js  # Validation helpers
└── Frontend/
    ├── package.json
    ├── DOCUMENTATION.md          # Detailed frontend documentation
    ├── index.html
    └── src/
        ├── main.jsx              # React root
        ├── App.jsx               # Router & Provider setup
        ├── components/
        │   ├── Body.jsx          # Layout + auth guard
        │   ├── NavBar.jsx        # Navigation bar
        │   ├── Footer.jsx        # Page footer
        │   ├── Login.jsx         # Login / Signup form
        │   ├── Feed.jsx          # Developer discovery feed
        │   ├── UserCard.jsx      # Swipeable profile card
        │   ├── Profile.jsx       # Profile page
            ├── EditProfile.jsx   # Edit profile form + photo upload + live preview
            ├── Connections.jsx   # Accepted connections list
            ├── Requests.jsx      # Incoming requests management
            └── ForgotPassword.jsx# Public password reset form
        └── utils/
            ├── appStore.jsx      # Redux store
            ├── constants.jsx     # BASE_URL + getPhotoUrl() helper
            ├── userSlice.jsx     # User state slice
            ├── feedSlice.jsx     # Feed state slice
            ├── connectionSlice.jsx # Connections state slice
            └── requestSlice.jsx  # Requests state slice
```

---

## Features

- **User Authentication** — Signup, Login, Logout with JWT tokens stored in HTTP cookies
- **Password Reset** — Reset password by email without requiring login (`POST /forgot-password`)
- **Profile Management** — Edit name, photo, age, gender, about with live card preview
- **Profile Picture Upload** — Upload a new photo directly from the profile edit page
- **Developer Feed** — Browse other developers one card at a time (paginated)
- **Connection Requests** — Send Interested/Ignore actions from the feed
- **Request Management** — Accept or Reject incoming connection requests
- **Connections List** — View all accepted developer connections
- **Password Validation** — Strong password enforcement via `validator` library
- **Responsive UI** — Mobile-first layout across all pages
- **Dark Theme** — DaisyUI dark theme applied globally

---

## API Endpoints

| Method | Endpoint                             | Auth | Description                                        |
| ------ | ------------------------------------ | ---- | -------------------------------------------------- |
| POST   | `/signup`                            | No   | Register a new user                                |
| POST   | `/login`                             | No   | Login with email & password                        |
| POST   | `/logout`                            | No   | Clear auth cookie                                  |
| POST   | `/forgot-password`                   | No   | Reset password by email (no login required)        |
| GET    | `/profile/view`                      | Yes  | Get logged-in user's profile                       |
| PATCH  | `/profile/edit`                      | Yes  | Update profile fields; returns updated user object |
| POST   | `/profile/upload-photo`              | Yes  | Upload profile picture (multipart, field: `photo`) |
| PATCH  | `/profile/forgotPassword`            | Yes  | Change password while logged in                    |
| POST   | `/request/send/:status/:userId`      | Yes  | Send connection request (`ignored` / `interested`) |
| POST   | `/request/review/:status/:requestId` | Yes  | Review request (`accepted` / `rejected`)           |
| GET    | `/user/requests/received`            | Yes  | Get pending incoming requests                      |
| GET    | `/user/connections`                  | Yes  | Get all accepted connections                       |
| GET    | `/user/feed`                         | Yes  | Get discoverable user profiles (paginated)         |
| GET    | `/uploads/:filename`                 | No   | Serve uploaded profile picture (static file)       |

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or later)
- **MongoDB** (local instance or MongoDB Atlas)
- **npm**

### Environment Variables

Create a `.env` file inside the `Backend/` folder:

```env
PORT=3000
DB_STRING=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/devTinder
JWT_SECRET=your_jwt_secret_key
```

### Installation & Running

**Backend:**

```bash
cd Backend
npm install
npm run dev        # starts with nodemon on port 3000
```

**Frontend:**

```bash
cd Frontend
npm install
npm run dev        # starts Vite dev server on port 5173
```

Open `http://localhost:5173` in your browser.

---

## Application Flow

1. User opens the app → `Body.jsx` checks for an existing auth cookie by calling `/profile/view`.
2. If not authenticated → redirected to `/login`.
3. User signs up or logs in → JWT cookie is set, user data stored in Redux, redirected to feed.
4. **Feed** → Shows one developer card at a time. User clicks **Interested** or **Ignore**.
5. **Requests** → View incoming connection requests. Accept or Reject each one.
6. **Connections** → View all developers who have an accepted connection with you.
7. **Profile** → Edit your profile details, upload a new photo, and see a live card preview.

---

## Author

**Nagabhushan Tirth**

---

## License

ISC
