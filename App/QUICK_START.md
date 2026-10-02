# Quick Start Guide - FinOps Dashboard Enhancements

## 🚀 Get Started in 5 Minutes

### Step 1: Start Your App
```bash
npm start
# or
npm run dev
```

### Step 2: Login with Demo Account
Navigate to: `http://localhost:3000/login`

**Credentials**:
```
Email: demo@finops.com
Password: demo123
```

Or click "Fill Demo Credentials" button for quick login.

### Step 3: Explore the Features
1. **View Dashboard** → Click "Dashboard" in sidebar
2. **See All Features** → Navigate to `/features` route
3. **Manage Profile** → Click avatar in top-right header
4. **Toggle Dark Mode** → Click moon/sun icon in header

---

## 🎯 Quick Feature Access

### Authentication
```bash
/login          Login page
/signup         Create new account
```

### Profile & Settings
```bash
/profile        Edit profile, security, notifications
```

### Feature Showcase
```bash
/features       Live demo of all new features
```

---

## 💡 Common Tasks

### Export Data as CSV
Any data table on the dashboard has an export button:
1. Look for the "CSV" button at the top of tables
2. Click it to download the data

### Change Theme
1. Click the **moon/sun icon** in the top-right
2. Select Light, Dark, or System
3. Preference saves automatically

### Send Notifications
In your code:
```tsx
import { useNotificationActions } from '@/context/NotificationContext';

const { success, error, warning, info } = useNotificationActions();

// Send success notification
success('Success!', 'Your operation completed');

// Send error notification
error('Error!', 'Something went wrong');
```

### Create Charts
```tsx
import { TrendLineChart } from '@/components/charts/AdvancedCharts';

<TrendLineChart
  data={myData}
  title="Cost Trends"
  xAxisKey="date"
  yAxisKey="cost"
/>
```

### Add Data Table
```tsx
import { DataTable } from '@/components/DataTableComponent';

<DataTable
  columns={columns}
  data={data}
  title="My Table"
  exportable
/>
```

---

## 🔐 Authentication Details

### Login/Logout Flow
- **Page loads** → Check for logged-in user
- **Not logged in** → Redirect to /login
- **Logged in** → Show dashboard
- **Click avatatar** → User menu appears
- **Click "Sign Out"** → Logout and redirect to login

### User Roles
Your demo user has role: **analyst**

Available roles:
- `viewer` - Read-only access
- `analyst` - View and analyze
- `manager` - Can manage teams
- `admin` - Full access

---

## 📊 View New Charts

Go to `/features` route to see:
1. **Trend Line Chart** - Line chart with trends
2. **Multi-Line Chart** - Compare multiple metrics
3. **Filled Area Chart** - Area with gradient
4. **Scatter Plot** - Correlation visualization

---

## 🔍 Search & Filter Example

Click on search boxes to:
- Type to search by text
- Click filters icon to add filters
- Select multiple filters
- Click "Clear all" to reset

---

## 📱 Mobile-Friendly
All features are optimized for mobile:
- Touch-friendly buttons
- Responsive layouts
- Collapsible navigation
- Readable text on all screen sizes

---

## 🎨 Customization

### Change Colors
1. Open `tailwind.config.js`
2. Modify color schemes
3. Rebuild CSS

### Update Logo
1. Replace image in `public/` folder
2. Update path in components

### Add Your Brand
1. Modify header in `src/components/layout/Header.tsx`
2. Update colors in theme context
3. Customize buttons and badges

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Login not working | Use demo email: `demo@finops.com` |
| Dark mode not saving | Clear localStorage: `localStorage.clear()` |
| Can't see notifications | Check NotificationsContainer in app |
| Charts not showing | Verify data format is correct |
| Pages not loading | Check network tab for errors |

---

## 📁 Key Files to Know

```
src/
├── pages/
│   ├── Login.tsx          ← Login page
│   ├── Signup.tsx         ← Registration
│   ├── Profile.tsx        ← User settings
│   ├── FeatureShowcase.tsx ← Demo page
│   └── Dashboard.tsx      ← Main dashboard
├── components/
│   ├── AdvancedSearch.tsx ← Search component
│   ├── DataTableComponent.tsx ← Tables
│   ├── ThemeToggle.tsx    ← Theme switcher
│   └── charts/AdvancedCharts.tsx ← New charts
├── context/
│   ├── AuthContext.tsx    ← Authentication
│   ├── ThemeContext.tsx   ← Dark mode
│   └── NotificationContext.tsx ← Notifications
├── services/
│   └── apiService.ts      ← API layer  
├── utils/
│   └── exportUtils.ts     ← Export functions
└── App.tsx               ← Routes setup
```

---

## 🎓 Learning Path

1. **Learn the basics** → Visit `/features` page
2. **Read documentation** → Check NEW_FEATURES_GUIDE.md
3. **Explore code** → Review component files
4. **Integrate APIs** → Update apiService.ts
5. **Customize** → Modify components for your needs

---

## 🚦 Status Indicators

Look for these visual indicators:

| Icon | Meaning |
|------|---------|
| 🟢 | Working/Active |
| 🟡 | Warning/Caution |
| 🔴 | Error/Alert |
| 🔵 | Info |
| ✓ | Success |
| ✗ | Failed |

---

## 💻 Code Examples

### Check if User is Logged In
```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <LoginPage />;
  
  return <div>Welcome, {user?.name}!</div>;
}
```

### Get Current Theme
```tsx
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { isDark, theme, setTheme } = useTheme();
  
  return <button onClick={() => setTheme('dark')}>Dark</button>;
}
```

### Show Notification on Action
```tsx
import { useNotificationActions } from '@/context/NotificationContext';

function MyComponent() {
  const { success } = useNotificationActions();
  
  const handleClick = () => {
    // Do something
    success('Done!', 'Operation successful');
  };
  
  return <button onClick={handleClick}>Do it</button>;
}
```

---

## 🔗 Routes Quick Reference

```
Login & Auth:
  /login       ← Start here
  /signup      ← Create account
  /            ← Dashboard (protected)

Feature Showcase:
  /features    ← See all new features!

Profile & Settings:
  /profile     ← User settings

Existing Dashboards:
  /dashboard
  /cost-analyzer
  /categories
  /kubernetes
  /recommendations
  /anomalies
  /reports
  /virtual-tags
  /cost-allocation
  /unit-economics
  /forecasting
  /budgeting
```

---

## ⚡ Performance Tips

1. **Use pagination** for large data sets
2. **Debounce search** for real-time input
3. **Lazy load** images and heavy components
4. **Cache API responses** with React Query
5. **Optimize chart data** before rendering

---

## 📞 Need Help?

### Check These First
1. NEW_FEATURES_GUIDE.md - Detailed documentation
2. FeatureShowcase.tsx - See working examples
3. Component files - Comments explain usage
4. Browser console - Check for error messages

### Common Errors & Fixes
- **"useAuth must be used within AuthProvider"** → Check App.tsx wrapping
- **"Cannot read property of undefined"** → Check data format
- **"Route not found"** → Verify route path in App.tsx

---

## ✅ Verification Checklist

- [ ] Can login with demo credentials
- [ ] Dashboard loads after login
- [ ] Dark mode works
- [ ] Profile page accessible
- [ ] Feature showcase page works
- [ ] Logout works
- [ ] Notifications appear
- [ ] Tables export to CSV
- [ ] Charts display correctly

---

## 🎉 You're Ready!

Everything is set up and ready to use. Start by:

1. **Login** at `/login`
2. **Explore** at `/features`
3. **Customize** your preferences
4. **Integrate** with your backend APIs

---

## 📈 Next: Connect Your Backend

When ready, update `src/services/apiService.ts`:

```tsx
// Change this:
this.baseUrl = baseUrl;

// To your actual API:
this.baseUrl = 'https://your-api.com/api';
```

Then replace mock data with real API calls.

---

**Happy coding! 🚀**

*Last updated: March 2026*
