# Healthcare Management System

A comprehensive role-based healthcare management application built with React and Vite, featuring patient management, staff administration, appointment scheduling, medical imaging, diagnosis reports, and billing.

## 🎯 Features

### Role-Based Access Control
- **Admin**: Full system access, patient & staff management, system dashboard
- **Management**: Patient records, staff oversight, appointments, analytics
- **Doctor**: View patients, diagnose, create reports, view medical images
- **Radiologist**: Upload medical images, manage imaging metadata
- **Finance**: Create invoices, manage billing, track payments

### Core Modules

#### 1. Authentication & Authorization
- Secure role-based login
- Protected routes based on user roles
- Session management

#### 2. Patient Management (Admin, Management, Doctor)
- Register new patients
- Update patient information
- Search patients by ID, name
- View complete medical history
- Track blood type, allergies, conditions

#### 3. Staff Management (Admin, Management)
- Add doctors, radiologists, finance staff
- Assign roles and departments
- Manage staff information

#### 4. Appointment Scheduling (Admin, Management, Doctor)
- Create new appointments
- Assign doctors to patients
- Schedule consultations, follow-ups
- Cancel appointments
- Track appointment status

#### 5. Medical Imaging (Radiologist, Doctor)
- Upload MRI, CT, X-Ray images
- Classify by type and category
- Add scan metadata (date, machine ID)
- Link images to appointments
- View patient imaging history

#### 6. Diagnosis & Reports (Doctor)
- Create diagnosis reports
- View medical images for diagnosis
- Add detailed medical notes
- Mark follow-up requirements
- Confirm diagnosis

#### 7. Billing & Invoices (Finance, Admin)
- Generate patient invoices
- Auto-calculate costs with tax
- Track payment status
- Manage due dates
- View invoice details

#### 8. Dashboard (All Roles)
- System statistics
- Patient & staff counts
- Appointment metrics
- Revenue tracking
- Performance indicators

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Extract the project files**
   ```bash
   cd healthcare-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Credentials

Use these credentials to login and test different roles:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Radiologist | radiologist@hospital.com | radio123 |
| Finance | finance@hospital.com | finance123 |
| Management | management@hospital.com | manage123 |

## 🏗️ Project Structure

```
healthcare-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Main layout with sidebar
│   │   └── ProtectedRoute.jsx   # Route protection component
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication context
│   │   └── ThemeContext.jsx     # Theme management
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── Dashboard.jsx        # Dashboard
│   │   ├── PatientManagement.jsx
│   │   ├── StaffManagement.jsx
│   │   ├── AppointmentScheduling.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── DiagnosisReports.jsx
│   │   └── BillingInvoice.jsx
│   ├── services/
│   │   └── api.js               # API service with mock data
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # Global styles
│   └── main.jsx                 # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design Features

- **Green Health Theme**: Professional healthcare color scheme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Fade-in effects and transitions
- **Modern UI**: Clean, professional interface
- **Accessible**: WCAG compliant design principles

## 🔧 Technical Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **Styling**: CSS with CSS Variables
- **Icons**: Lucide React
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📡 API Integration

The application is designed to work with a backend API but includes comprehensive mock data for demonstration purposes.

### API Endpoints Expected

```
GET    /api/patients
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
GET    /api/patients/search?q=

GET    /api/staff
POST   /api/staff
PUT    /api/staff/:id
DELETE /api/staff/:id

GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
PATCH  /api/appointments/:id/cancel

GET    /api/images
POST   /api/images
PATCH  /api/images/:id

GET    /api/diagnoses
POST   /api/diagnoses
PUT    /api/diagnoses/:id
PATCH  /api/diagnoses/:id/confirm

GET    /api/invoices
POST   /api/invoices
PUT    /api/invoices/:id
PATCH  /api/invoices/:id/status

GET    /api/dashboard/stats
```

### Mock Data Behavior

When API calls fail, the system automatically falls back to mock data:
- Pre-populated sample patients, staff, appointments
- Simulated CRUD operations
- Data persists during session (resets on refresh)
- Console warnings indicate mock mode

## 🔐 Security Features

- Role-based access control (RBAC)
- Protected routes
- Session management
- Input validation
- Secure authentication flow

## 🎯 Role Permissions Matrix

| Feature | Admin | Management | Doctor | Radiologist | Finance |
|---------|-------|------------|--------|-------------|---------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Patient Management | ✅ | ✅ | ✅ | ❌ | ❌ |
| Staff Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Appointments | ✅ | ✅ | ✅ | ❌ | ❌ |
| Medical Images | ❌ | ❌ | ✅ | ✅ | ❌ |
| Diagnosis Reports | ❌ | ❌ | ✅ | ❌ | ❌ |
| Billing & Invoices | ✅ | ❌ | ❌ | ❌ | ✅ |

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔄 Future Enhancements

- Real-time notifications
- Advanced analytics dashboard
- Document management system
- Telemedicine integration
- Mobile app
- Multi-language support
- Advanced reporting
- Email notifications
- SMS reminders

## 📝 License

This is a demo project for educational purposes.

## 👥 Support

For issues or questions, please refer to the documentation or contact your system administrator.

---

**Note**: This application uses mock data for demonstration. In production, connect to a real backend API by updating the `API_BASE_URL` in `src/services/api.js`.
