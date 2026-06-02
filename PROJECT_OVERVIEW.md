# Bus Tracking System - Project Overview

## Project Summary
A real-time GPS-based bus tracking web application that enables students to locate and track their buses, while drivers can share their location in real-time. The system uses Firebase Realtime Database for location data synchronization and Leaflet/Mapbox for visualization.

---

## Key Features

### 1. **Role-Based Authentication**
   - Two distinct user roles: **Student** and **Driver**
   - Simple login with Bus ID and optional name
   - Session data stored in browser's localStorage
   - No complex authentication required (suitable for institutional use)

### 2. **Driver Features**
   - Share real-time GPS location
   - View current location on interactive map
   - Configure bus ID for tracking sessions
   - Start/Stop location sharing
   - Real-time status display

### 3. **Student Features**
   - View bus location in real-time on a map
   - Search and watch specific buses by Bus ID
   - Automatic location updates as bus moves
   - Session persistence (bus ID remembered)

### 4. **Real-Time Map Visualization**
   - Interactive maps using **Leaflet** (OpenStreetMap)
   - Marker placement for current bus location
   - Map centering and zoom controls
   - Default center: Hyderabad, India (17.3850°N, 78.4867°E)

---

## Technology Stack

### Frontend
- **HTML5** - Structure and UI
- **CSS3** - Styling (inline styles, responsive design)
- **JavaScript (ES6)** - Core application logic

### Mapping & Location
- **Leaflet.js** - Interactive map rendering
- **Geolocation API** - Browser-based GPS access
- **Mapbox** (alternative, referenced in index.js) - Advanced mapping features

### Backend & Database
- **Firebase Realtime Database** - Real-time data synchronization
- **Firebase Analytics** - Usage tracking

### Deployment
- **Vercel** - Static site hosting
- **Node.js/npm** - Package management

---

## Project Structure

```
Bus Tracking System/
├── public/                    # Vercel static assets
│   ├── index.html            # Default landing page
│   ├── login.html            # Authentication page
│   ├── driver.html           # Driver dashboard
│   ├── student.html          # Student tracking view
│   ├── firebase-config.js    # Firebase configuration
│   └── styles.css            # Global styles
├── scripts/
│   └── deploy-vercel.ps1     # PowerShell deployment script
├── firebase-config.js        # Firebase credentials (fallback)
├── index.js                  # Core application logic
├── index_styles.css          # Secondary styles
├── fire.json                 # Firebase rules/config
├── fi.json/                  # Firebase data structure
├── package.json              # Project dependencies
├── vercel.json               # Vercel deployment config
└── README_VERCEL.md          # Deployment instructions
```

---

## Core Workflows

### 1. **Login Flow**
```
User → Login Page → Select Role (Student/Driver) → Enter Bus ID → LocalStorage Save → Redirect to Dashboard
```

### 2. **Driver Sharing Location**
```
Driver Dashboard → Click "Start Sharing" → Browser requests geolocation → GPS coordinates → Firebase writes to /busLocation/{busId} → Map updates
```

### 3. **Student Tracking Bus**
```
Student View → Enter Bus ID → Click "Watch Bus" → Firebase listens to /buses/{busId}/location → Real-time marker updates
```

---

## Firebase Data Structure

### Driver Location Path
```
busLocation/
├── bus1/
│   ├── latitude: 17.3850
│   ├── longitude: 78.4867
│   └── timestamp: 1234567890
├── bus2/
│   └── (similar structure)
```

### Alternative Student Path (from code)
```
buses/
├── bus1/
│   └── location/
│       ├── lat: 17.3850
│       ├── lng: 78.4867
│       └── timestamp: 1234567890
```

---

## Dependencies

```json
{
  "dependencies": {
    "firebase": "^11.10.0"
  }
}
```

### External Libraries (CDN)
- **Leaflet.js**: https://unpkg.com/leaflet@1.9.4/
- **Firebase SDK (v9.22.2 compat)**: https://www.gstatic.com/firebasejs/9.22.2/

---

## File Descriptions

| File | Purpose |
|------|---------|
| **login.html** | Entry point; handles role selection and bus ID input |
| **driver.html** | Driver interface; starts/stops location sharing |
| **student.html** | Student interface; displays bus location tracking |
| **firebase-config.js** | Firebase SDK initialization with credentials |
| **index.js** | Legacy/Mapbox version of core logic (may be superseded) |
| **vercel.json** | Vercel deployment routing configuration |
| **package.json** | NPM dependencies (Firebase only) |
| **deploy-vercel.ps1** | Automated deployment script for PowerShell |

---

## Deployment & Setup

### Local Testing
1. Install Node.js and npm
2. Run: `npm install` (installs Firebase)
3. Update Firebase config in `firebase-config.js` with your project credentials
4. Open `public/index.html` in browser or use a local server

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Or use PowerShell script: `.\scripts\deploy-vercel.ps1`

### HTTPS Requirements
- Geolocation API requires HTTPS in production
- Use `localhost` or `ngrok` for local HTTPS testing

---

## Firebase Configuration

### Current Configuration (from `firebase-config.js`)
```javascript
projectId: "tracking-7473f"
authDomain: "tracking-7473f.firebaseapp.com"
databaseURL: "https://tracking-7473f-default-rtdb.firebaseio.com"
```

### Security Considerations
- Firebase API keys are exposed in client-side code (expected for public web apps)
- Consider implementing Firebase Realtime Database security rules:
  - Allow drivers to write only their own bus location
  - Allow students to read all bus locations
  - Implement timestamp validation

---

## Key Features by Component

### **Login Page (`login.html`)**
- Role selection dropdown (Student/Driver)
- Bus ID input field
- Optional name field
- Stores session data in localStorage
- Redirects to appropriate dashboard

### **Driver Dashboard (`driver.html`)**
- Bus ID configuration panel
- Leaflet map with current location marker
- Start/Stop location sharing buttons
- Status indicator
- Debug panel for troubleshooting

### **Student View (`student.html`)**
- Bus selection input
- Leaflet map with bus marker
- Real-time location updates
- Watch/Stop buttons
- Info display (location data)
- Debug panel

---

## Browser APIs Used
- **Geolocation API** - Obtain driver's GPS coordinates
- **LocalStorage API** - Persist session data
- **Fetch API** - HTTP requests (if used)
- **DOM API** - UI manipulation

---

## Performance Considerations
- Real-time Firebase listeners automatically update without polling
- Map rendering optimized with Leaflet (lightweight alternative to Mapbox)
- Inline CSS reduces HTTP requests
- Static site hosting on Vercel ensures fast global CDN delivery

---

## Potential Improvements
1. Add user authentication (Firebase Auth)
2. Implement Firebase security rules for data isolation
3. Add arrival time estimation and notifications
4. Support multiple students tracking one bus
5. Driver route history and analytics
6. Offline mode support with service workers
7. Mobile app version (React Native/Flutter)
8. Add map filters and search functionality
9. Implement bus capacity tracking
10. Add user ratings and feedback system

---

## Environment Variables (Recommended)
- `FIREBASE_API_KEY`
- `FIREBASE_PROJECT_ID`
- `MAPBOX_TOKEN`
- `VERCEL_TOKEN` (for automated deployment)

---

## Security Notes
⚠️ **Current State:**
- Firebase API keys hardcoded in client code (acceptable for read-public scenarios)
- No authentication layer (use Firebase Auth for production)
- No data validation on client side

✅ **Recommended for Production:**
- Implement Firebase security rules
- Add Firebase Authentication
- Use environment variables for sensitive keys
- Validate all inputs server-side
- Add CORS restrictions
- Implement rate limiting

---

## License & Credits
- Uses Firebase (Google Cloud)
- Uses Leaflet.js (open-source)
- Uses Vercel for hosting
- Default map center: Hyderabad, India

---

*Last Updated: May 2026*
