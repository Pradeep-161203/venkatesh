# Sri Venkateshwara Company - Rivets Billing System

A simple billing and stock management system specifically designed for Sri Venkateshwara Company's rivets business.

## Features

- **Simple Billing**: Create bills for customers with rivets size, quantity, and rate
- **Stock Management**: Track rivet inventory and get low stock alerts
- **Sales Reports**: Generate daily, weekly, monthly, and yearly sales reports
- **Dashboard**: Real-time view of sales performance
- **Customer Management**: Basic customer information storage
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
sri-venkateshwara-rivets/
├── backend/
│   ├── models/
│   │   ├── Rivet.js      # Rivet model (size, rate, stock)
│   │   └── Bill.js       # Bill model (customer, items, total)
│   ├── routes/
│   │   ├── billing.js     # Billing endpoints
│   │   ├── rivets.js      # Rivet management endpoints
│   │   └── reports.js    # Sales reports endpoints
│   ├── package.json
│   ├── server.js         # Express server
│   └── .env            # Environment variables
├── frontend/
│   ├── index.html       # Main HTML page
│   └── app.js          # Frontend JavaScript
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sri_venkateshwara_rivets
COMPANY_NAME=Sri Venkateshwara Company
COMPANY_ADDRESS=Industrial Area, Bangalore, Karnataka
COMPANY_PHONE=+91-80-12345678
COMPANY_EMAIL=billing@sri-venkateshwara.com
```

4. Start MongoDB service

5. Start backend server:
```bash
npm start
# or for development
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Start a simple HTTP server (you can use any static file server):
```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .

# Or use Live Server extension in VS Code
```

3. Open your browser and go to `http://localhost:3000`

## Usage

### 1. Manage Rivets
- Go to "Manage Rivets" section
- Add new rivet types with size, rate, and stock
- Update stock levels as needed
- Delete rivet types if no longer used

### 2. Create Bills
- Go to "New Bill" section
- Enter customer details (name, phone, address)
- Add rivet items by selecting size and quantity
- System automatically calculates amounts and total
- Add notes if needed
- Click "Create Bill" to save

### 3. View Bills
- Go to "All Bills" section
- Search bills by number, customer name, or phone
- View bill details and payment status

### 4. Generate Reports
- Go to "Reports" section
- Select report period (daily, weekly, monthly, yearly)
- Set date range if needed
- Click "Generate Report" to view sales data

### 5. Dashboard
- View today's, weekly, monthly, and total sales
- See recent bills
- Track top-selling rivet sizes

## API Endpoints

### Billing
- `GET /api/billing` - Get all bills
- `GET /api/billing/:id` - Get bill by ID
- `POST /api/billing` - Create new bill
- `PUT /api/billing/:id` - Update bill
- `DELETE /api/billing/:id` - Delete bill

### Rivets
- `GET /api/rivets` - Get all rivets
- `GET /api/rivets/:id` - Get rivet by ID
- `POST /api/rivets` - Add new rivet
- `PUT /api/rivets/:id` - Update rivet
- `PUT /api/rivets/:id/stock` - Update rivet stock
- `DELETE /api/rivets/:id` - Delete rivet

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/sales` - Get sales reports
- `GET /api/reports/stock` - Get stock report

### Company
- `GET /api/company` - Get company information

## Database Schema

### Rivet Model
```javascript
{
    size: String,        // Rivet size (e.g., "6mm", "8mm")
    rate: Number,        // Price per piece
    stock: Number,       // Current stock quantity
    unit: String,        // Unit (default: "pcs")
    createdAt: Date,
    updatedAt: Date
}
```

### Bill Model
```javascript
{
    billNumber: String,      // Auto-generated bill number
    customerName: String,    // Customer name
    customerPhone: String,    // Customer phone
    customerAddress: String,  // Customer address
    items: [{
        rivetId: ObjectId,    // Reference to rivet
        size: String,         // Rivet size
        quantity: Number,     // Quantity purchased
        rate: Number,         // Rate at time of purchase
        amount: Number        // Total amount for this item
    }],
    totalAmount: Number,     // Total bill amount
    billDate: Date,        // Bill date
    paymentStatus: String,   // pending/paid/partial
    paidAmount: Number,      // Amount paid
    notes: String,          // Additional notes
    createdAt: Date
}
```

## Features in Detail

### Stock Management
- Automatic stock deduction when bills are created
- Stock restoration when bills are deleted
- Low stock alerts (when stock < 10)
- Real-time stock availability check during billing

### Billing System
- Automatic bill number generation (SVYYMMDDXXX)
- GST-ready structure (can be extended)
- Payment status tracking
- Customer information storage

### Reports
- Daily, weekly, monthly, yearly sales summaries
- Total quantity and revenue calculations
- Average sale value calculations
- Top-selling rivet analysis

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Frontend
- **HTML5/CSS3** - Markup and styling
- **JavaScript (ES6+)** - Client-side scripting
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icons

## Development

### Adding New Features
1. Backend: Add new routes in `/backend/routes/`
2. Frontend: Add new sections in `/frontend/app.js`
3. Database: Update models in `/backend/models/`

### Customization
- Update company details in `.env` file
- Modify styling in `index.html`
- Add new report types in `reports.js`

## Support

For technical support:
- Email: billing@sri-venkateshwara.com
- Phone: +91-80-12345678

## License

This project is proprietary to Sri Venkateshwara Company. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Developed for**: Sri Venkateshwara Company
