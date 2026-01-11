# 🏪 Store Rating Platform - Frontend

A modern, responsive React application for the Store Rating Platform with role-based interfaces for Admins, Users, and Store Owners.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS with CSS Variables
- **State Management**: React Context API

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Backend API** running on `http://localhost:5000`

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# API Base URL
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.config.js       # Axios instance with interceptors
│   │   └── index.js              # API service methods
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── admin/                # Admin components
│   │   ├── user/                 # User components
│   │   └── store/                # Store owner components
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx         # Login page
│   │   │   └── Signup.jsx        # Signup page
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageStores.jsx
│   │   │   └── ManageUsers.jsx
│   │   ├── user/
│   │   │   ├── UserStores.jsx    # Browse and rate stores
│   │   │   └── UpdatePassword.jsx
│   │   └── store/
│   │       └── StoreDashboard.jsx # Store analytics
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication state
│   ├── hooks/
│   │   └── useAuth.js            # Auth hook
│   ├── utils/
│   │   └── validators.js         # Form validation
│   ├── styles/
│   │   ├── index.css             # Global styles
│   │   └── components/           # Component styles
│   ├── App.jsx                    # Root component
│   └── main.jsx                   # Entry point
├── public/
├── .env                           # Environment variables
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Features by Role

### 🔐 Authentication (Public)

- **Login**: Unified login for all user types
- **Signup**: Self-registration for normal users
- **Auto-redirect**: Role-based redirection after login

### 👨‍💼 Admin Features

- **Dashboard**: View total users, stores, and ratings
- **Manage Stores**: View all stores with ratings
- **Manage Users**: View and filter users by role
- **User Details**: View individual user information

### 👤 Normal User Features

- **Browse Stores**: Search stores by name/address
- **View Ratings**: See store average ratings
- **Submit Ratings**: Rate stores (1-5 stars)
- **Update Ratings**: Modify existing ratings
- **Update Password**: Change account password

### 🏪 Store Owner Features

- **Dashboard**: View store statistics
- **Average Rating**: See overall store rating
- **Rating Distribution**: Visualize rating breakdown
- **User Ratings**: View all users who rated the store
- **Update Password**: Change account password

## 🔑 User Roles & Access

| Role | Routes | Permissions |
|------|--------|-------------|
| **ADMIN** | `/admin/*` | Manage users, stores, view analytics |
| **USER** | `/user/*` | Browse stores, submit/update ratings |
| **STORE_OWNER** | `/store/*` | View store dashboard and ratings |

## 📱 Pages & Routes

### Public Routes
- `/login` - Login page
- `/signup` - User registration

### Admin Routes (Protected)
- `/admin/dashboard` - Dashboard with statistics
- `/admin/stores` - Store management
- `/admin/users` - User management

### User Routes (Protected)
- `/user/stores` - Browse and rate stores
- `/user/password` - Update password

### Store Owner Routes (Protected)
- `/store/dashboard` - Store analytics dashboard
- `/store/password` - Update password

## ✅ Form Validation

All forms include client-side validation matching backend rules:

- **Name**: 20-60 characters, letters and spaces only
- **Email**: Valid email format
- **Password**: 8-16 characters, 1 uppercase, 1 special character
- **Address**: Maximum 400 characters
- **Rating**: 1-5 integer

Real-time validation feedback is provided as users type.

## 🎨 Design System

### Color Palette
- **Primary**: Indigo gradient (`#6366f1` → `#8b5cf6`)
- **Success**: Green (`#10b981`)
- **Error**: Red (`#ef4444`)
- **Warning**: Amber (`#f59e0b`)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- Modern card-based layouts
- Smooth transitions and hover effects
- Responsive design (mobile-first)
- Gradient backgrounds
- Clean table designs

## 🔒 Authentication Flow

1. User logs in with email/password
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. Auto-redirect based on user role
6. Protected routes check role permissions
7. Auto-logout on 401 responses

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## 🧪 Testing the Application

### Test Users (After Backend Setup)

1. **Admin**: Created manually in database
2. **Normal User**: Sign up via `/signup`
3. **Store Owner**: Created by admin when adding a store

### Testing Flow

1. Sign up as a normal user
2. Browse stores and submit ratings
3. Login as admin (if created)
4. View dashboard statistics
5. Add new stores (creates store owner automatically)
6. Login as store owner to view analytics

## 📱 Responsive Design

The application is fully responsive and tested on:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1400px+)

## 🎯 Key Features

### User Experience
- Loading states for async operations
- Error messages with clear descriptions
- Success notifications
- Form validation hints
- Smooth page transitions

### Security
- Protected routes by role
- Token-based authentication
- Auto-logout on session expiration
- Secure password requirements

### Performance
- Vite for fast builds
- Code splitting
- Optimized bundle size
- Lazy loading potential

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Deploy to Traditional Hosting

1. Build the project
2. Upload `dist` folder contents
3. Configure server for SPA routing (redirect all to `index.html`)

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Verify CORS settings in backend

### Authentication Problems
- Clear localStorage and try again
- Check JWT token expiration
- Verify backend is accessible

### Build Errors
- Delete `node_modules` and reinstall
- Clear Vite cache: `rm -rf node_modules/.vite`

## 🔄 API Integration

The frontend communicates with the backend via Axios:

```javascript
// Example: Fetch stores
import { userAPI } from '../api';

const fetchStores = async () => {
  const response = await userAPI.getStores({ search: 'coffee' });
  console.log(response.data.data.stores);
};
```

All API calls are centralized in `src/api/index.js`.

## 📝 Additional Notes

- The navbar adapts based on user role
- Unauthorized access attempts redirect to appropriate dashboard
- All forms include real-time validation
- Toast notifications can be added for better UX
- Component library (Material-UI, Chakra) can be integrated

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite Guide](https://vitejs.dev/)
- [Axios Documentation](https://axios-http.com/)

## 📞 Support

For issues or questions, please refer to the main project README.

---

**Enjoy rating stores! ⭐**
