# Healthcare Scheduling System

A comprehensive React-based scheduling module for healthcare providers and patients, featuring real-time availability management, appointment booking, and timezone-sensitive slot handling.

## 🚀 Features

### For Healthcare Providers
- **Interactive Calendar View**: Weekly/monthly calendar with slot visualization
- **Slot Management**: Create, edit, and delete availability slots
- **Recurring Appointments**: Set up daily, weekly, or monthly recurring slots
- **Conflict Detection**: Real-time validation to prevent scheduling conflicts
- **Pricing Management**: Set different prices for various appointment types
- **Location Support**: In-person, telemedicine, home visits, and mobile clinics

### For Patients
- **Advanced Search**: Filter by specialization, location, date range, and price
- **Provider Profiles**: View ratings, experience, and clinic information
- **Slot Booking**: Easy appointment booking with confirmation
- **Timezone Conversion**: Automatic timezone handling for global users
- **Insurance Support**: Filter by insurance acceptance

## 🛠️ Technical Stack

- **React 18** with TypeScript
- **Ant Design** for UI components
- **TanStack Router** for client-side routing
- **Day.js** for date/time handling and timezone support
- **Vite** for fast development and building

## 📁 Project Structure

```
src/
├── components/
│   ├── provider/
│   │   ├── AvailabilityCalendar.tsx    # Main calendar view
│   │   ├── SlotFormModal.tsx          # Slot creation/editing
│   │   └── SlotItem.tsx               # Individual slot display
│   ├── patient/
│   │   ├── SearchForm.tsx             # Patient search interface
│   │   ├── ProviderList.tsx           # Provider search results
│   │   ├── SlotGroup.tsx              # Grouped slot display
│   │   └── SlotBookingModal.tsx       # Booking confirmation
│   └── shared/
│       ├── TimezoneSelector.tsx       # Timezone selection
│       └── ConflictWarning.tsx        # Conflict detection UI
├── pages/
│   ├── ProviderAvailabilityPage.tsx   # Provider dashboard
│   ├── PatientBookingPage.tsx         # Patient booking interface
│   └── SchedulingDemo.tsx             # Demo landing page
└── App.tsx                           # Main app with routing
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-first-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 📱 Available Routes

- `/` - Redirects to scheduling demo
- `/scheduling-demo` - Main demo page
- `/provider/availability` - Provider availability management
- `/patient/booking` - Patient booking interface
- `/login` - Provider login
- `/register` - Provider registration
- `/patient/login` - Patient login
- `/patient/register` - Patient registration

## 🎯 Key Components

### Provider Components

#### `AvailabilityCalendar`
- Interactive calendar with slot visualization
- Quick actions for adding/editing slots
- Today's slots sidebar
- Responsive design for mobile/desktop

#### `SlotFormModal`
- Comprehensive slot creation form
- Time validation and conflict detection
- Recurring appointment support
- Location and pricing configuration

#### `SlotItem`
- Individual slot display with actions
- Edit/delete functionality
- Visual indicators for today/past slots

### Patient Components

#### `SearchForm`
- Advanced filtering options
- Date range selection
- Specialization and location filters
- Price and insurance filters

#### `ProviderList`
- Provider search results
- Rating and experience display
- Expandable slot views
- Booking integration

#### `SlotBookingModal`
- Two-step booking process
- Patient information collection
- Appointment confirmation
- Insurance and emergency contact fields

### Shared Components

#### `TimezoneSelector`
- Timezone selection with current time display
- Automatic timezone detection
- User-friendly timezone labels

#### `ConflictWarning`
- Conflict detection and display
- Severity-based warnings
- Suggested resolutions
- Manual conflict resolution

## 🔧 Configuration

### Timezone Support
The system uses Day.js with timezone plugins for accurate time handling:

```typescript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
```

### Validation Rules
- Start time must be before end time
- Slot duration: 15-240 minutes
- Break duration: 0-60 minutes
- Required fields for in-person appointments
- Email and phone number validation

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface elements

### Accessibility
- Screen reader support
- Keyboard navigation
- High contrast ratios
- Clear visual hierarchy

### Real-time Feedback
- Loading states
- Success/error messages
- Form validation
- Conflict warnings

## 🔒 Security Considerations

### Role-based Access
- Provider-only slot editing
- Patient-only booking access
- Session-based authentication

### Data Protection
- HTTPS enforcement
- Sensitive data masking
- Input sanitization
- CSRF protection

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔮 Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration for live updates
- **Calendar Integration**: Google Calendar, Outlook sync
- **Payment Processing**: Stripe/PayPal integration
- **Video Conferencing**: Zoom/Teams integration for telemedicine
- **Analytics Dashboard**: Booking analytics and insights
- **Multi-language Support**: Internationalization
- **Mobile App**: React Native version

### API Integration
The current implementation uses mock data. To integrate with a backend API:

1. Replace mock data functions with API calls
2. Implement proper error handling
3. Add authentication/authorization
4. Set up real-time updates via WebSocket
5. Add caching for performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ for the healthcare community**
