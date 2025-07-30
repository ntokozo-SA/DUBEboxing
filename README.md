# Dubeboxingclub - Full-Stack Gym Website

A modern, responsive gym website built with React, Node.js, Express, and MongoDB. Features a public website with admin dashboard for content management.

## 🚀 Features

### Public Website
- **Home Page**: Full-width autoplay video with welcome text
- **Events Page**: Grid layout displaying event posters
- **Gallery Page**: Gym images with category filtering and history section
- **Team Page**: Team member profiles with images and descriptions
- **Contact Page**: Contact form with WhatsApp integration
- **Floating WhatsApp Button**: Always visible on all pages
- **Responsive Design**: Mobile and desktop optimized

### Admin Dashboard
- **JWT Authentication**: Secure admin login
- **Content Management**: 
  - Upload/edit/delete events with posters
  - Manage gallery images with categories
  - Add/edit team members
  - Update website settings and contact info
- **Analytics**: Track page visits and display statistics
- **File Upload**: Image upload with Multer
- **Real-time Updates**: Instant content updates

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
gym-website/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── public/     # Public website components
│   │   │   └── admin/      # Admin dashboard components
│   │   ├── pages/          # Page components
│   │   │   ├── public/     # Public pages
│   │   │   └── admin/      # Admin pages
│   │   └── services/       # API services
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # Uploaded files
│   └── server.js           # Main server file
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gym-website
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # In server/config.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gym-website
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ADMIN_EMAIL=admin@gym.com
   ADMIN_PASSWORD=admin123
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Initialize admin user**
   ```bash
   # Start the server first, then make a POST request to:
   POST http://localhost:5000/api/auth/init
   ```

7. **Start the development servers**

   **Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd client
   npm start
   ```

8. **Access the application**
   - Public website: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin/login
## 📊 Database Models

### User
- Admin authentication with JWT

### Event
- Title, description, date
- Poster image upload
- Active/inactive status

### Gallery
- Title, description, category
- Image upload
- Category filtering (gym, equipment, classes, facilities)

### Team
- Name, position, description
- Profile image upload
- Display order

### Settings
- Home video URL
- Gym history text
- Contact information

### Analytics
- Page visit tracking
- Daily statistics
- Visit counts per page

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/init` - Initialize admin user

### Events
- `GET /api/events` - Get public events
- `GET /api/events/admin` - Get all events (admin)
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Gallery
- `GET /api/gallery` - Get public gallery
- `GET /api/gallery/admin` - Get all gallery items (admin)
- `POST /api/gallery` - Create gallery item (admin)
- `PUT /api/gallery/:id` - Update gallery item (admin)
- `DELETE /api/gallery/:id` - Delete gallery item (admin)

### Team
- `GET /api/team` - Get public team members
- `GET /api/team/admin` - Get all team members (admin)
- `POST /api/team` - Create team member (admin)
- `PUT /api/team/:id` - Update team member (admin)
- `DELETE /api/team/:id` - Delete team member (admin)

### Settings
- `GET /api/settings` - Get public settings
- `GET /api/settings/admin` - Get all settings (admin)
- `PUT /api/settings` - Update settings (admin)

### Contact
- `GET /api/contact` - Get contact info
- `PUT /api/contact` - Update contact info (admin)

### Analytics
- `POST /api/analytics/track` - Track page visit
- `GET /api/analytics` - Get analytics (admin)
- `GET /api/analytics/daily` - Get daily analytics (admin)

## 🎨 Customization

### Colors
The website uses a custom color scheme defined in `client/tailwind.config.js`:
- Primary: Red tones (`#ef4444`)
- Secondary: Blue tones (`#3b82f6`)

### Styling
- All styling is done with TailwindCSS
- Custom components are in `client/src/components/`
- Responsive design for mobile and desktop

### Content Management
- All content is managed through the admin dashboard
- Images are stored in `server/uploads/`
- Database stores content metadata and relationships

## 🔒 Security Features

- JWT authentication for admin access
- Password hashing with bcryptjs
- Protected API routes
- File upload validation
- Rate limiting
- CORS configuration
- Helmet.js security headers

## 📱 Responsive Design

The website is fully responsive with:
- Mobile-first approach
- Responsive navigation
- Adaptive image grids
- Touch-friendly admin interface
- Optimized for all screen sizes

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy to Heroku, Vercel, or similar
4. Set up file storage (AWS S3 recommended for production)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or similar
3. Configure environment variables for API URL

### Environment Variables
```bash
# Production
REACT_APP_API_URL=https://your-backend-url.com/api
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-production-jwt-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Updates

### Version 1.0.0
- Initial release
- Complete public website
- Admin dashboard
- Content management system
- Analytics tracking
- Responsive design

---

**Built with ❤️ using modern web technologies** 
