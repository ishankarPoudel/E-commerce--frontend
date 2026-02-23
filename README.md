

# Avisekh Bag Pashal – E-commerce Frontend

A modern, secure, and scalable e-commerce frontend built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**, focused on performance, accessibility, and real-world production patterns.

---

## 🌟 Features

### 🔐 Authentication & Security

* **Email / Password Authentication** with OTP verification
* **Google OAuth** integration
* **JWT-based Authentication** with automatic access token refresh
* **Session Management** with multi-device logout
* **Login Activity Tracking** (device & browser detection)
* **Email Alerts** for suspicious login attempts
* **Secure Password Reset** via OTP
* **HTTP-only cookie support** for sensitive tokens

---

### 🛍️ Shopping Experience

* **Guest Browsing** without account creation
* **Product Listing & Filtering**
* **Real-time Cart Management**
* **Multiple Payment Methods**:

  * eSewa (Nepal)
  * Stripe (International)
  * Cash on Delivery
* **Order Placement & Tracking**
* **Delivery Options** (Home delivery / Store pickup)

---

### 🎨 User Experience

* **Fully Responsive Design** (mobile, tablet, desktop)
* **Accessible UI components** using Radix UI
* **Smooth Animations** using Motion
* **Toast & Notification System**

---

### 🧩 Design & Accessibility

* **Tailwind CSS v4** for utility-first styling
* **Shadcn UI** component patterns
* **Radix UI primitives** for accessibility
* **Lucide Icons** for consistent iconography
* **Class Variance Authority** for scalable styling
* **Responsive Typography & Layouts**

---

## 🧠 Advanced & Developer-Focused Features

* **AI SDK Integration**

  * OpenAI SDK
  * React AI bindings
* **OpenAPI Client Code Generation**

  * Auto-generated API clients via `openapi-ts`
* **Form Validation**

  * React Hook Form + Zod
* **State & Server Management**

  * TanStack Query (server state)
  * TanStack Router (type-safe routing)
* **Charts & Data Visualization**

  * Recharts
* **Security & Device Detection**



## 🧰 Tech Stack

| Technology          | Purpose                  |
| ------------------- | ------------------------ |
| **React 19**        | UI framework             |
| **TypeScript**      | Static typing            |
| **Vite**            | Build tool & dev server  |
| **TanStack Router** | Type-safe routing        |
| **TanStack Query**  | Server-state management  |
| **Tailwind CSS v4** | Styling                  |
| **Radix UI**        | Accessible UI primitives |
| **Shadcn UI**       | Component patterns       |
| **Axios**           | HTTP client              |
| **React Hook Form** | Form handling            |
| **Zod**             | Schema validation        |
| **Motion**          | Animations               |
| **Recharts**        | Data visualization       |
| **Gemini Ai**       | AI features              |
| **OpenAPI TS**      | API client generation    |
| **Husky**           | Git hooks                |
| **ESLint**          | Code quality             |

---

## 📦 Installation

### Prerequisites

* Node.js **>= 18**
* pnpm (recommended) / npm
* Git

---

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/ishankarPoudel/ecommerce-frontend.git
cd ecommerce-frontend
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Environment variables**

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

4. **Start development server**

```bash
pnpm start:dev
```

5. **Open in browser**

```
http://localhost:5173
```

---

## 🏗️ Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI (buttons, inputs, modals)
│   ├── auth/         # Authentication components
│   ├── cart/         # Cart & checkout UI
│   └── product/      # Product components
├── pages/            # Route pages
├── hooks/            # Custom React hooks
├── services/         # API & OpenAPI clients
├── stores/           # Client-side state
├── types/            # Shared TypeScript types
├── lib/              # Utilities & helpers
└── routes/           # TanStack Router config
```

---

## 🔧 Available Scripts

```bash
pnpm start:dev       # Start development server
pnpm build           # Type-check + production build
pnpm preview         # Preview production build
pnpm lint            # Run ESLint
pnpm codegen:local   # Generate OpenAPI clients
```


##  Security Highlights

* HTTP-only cookies
* SameSite cookie policy
* Token rotation support
* Rate-limit ready architecture
* Device & browser fingerprinting
* Secure password policies


---

---

## 🧪 Testing Payment Gateways

### eSewa Test Credentials

For testing eSewa payments in development/staging, use these official test credentials:

```
eSewa ID: 9806800001, 9806800002, 9806800003, 9806800004, or 9806800005
Password: Nepal@123
MPIN: 1122 (for application only)
Token: 123456
```

⚠️ **Important Notes:**
- These credentials only work in eSewa's sandbox/test environment
- Use `ESEWA_MERCHANT_CODE=EPAYTEST` in your `.env` for testin
### Stripe Test Cards

For testing Stripe payments, use these test card numbers:

| Card Type | Number | CVC | Date |
|-----------|--------|-----|------|
| Visa (Success) | `4242 4242 4242 4242` | Any 3 digits | Any future date |
| Mastercard (Success) | `5555 5555 5555 4444` | Any 3 digits | Any future date |
| Visa (Declined) | `4000 0000 0000 0002` | Any 3 digits | Any future date |

📚 [Full Stripe Test Cards List](https://stripe.com/docs/testing)

---

## ⚠️ Known Limitations & Future Enhancements

### Payment Integration Status

#### ✅ eSewa (Fully Implemented)
- Complete integration with order flow
- Payment verification working
- Email confirmations active
- **Test Credentials Available** (see Backend README)

#### 🚧 Stripe(Fully implemented but not active) 
The Stripe payment integration code is currently **commented out** in the codebase and not active.

**Current Status:**
- ✅ Stripe dependencies installed (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- ✅ Payment intent creation implemented
- ✅ UI components ready
- ⏳ **Temporarily disabled** pending final testing and live credentials

**To Enable Stripe:**
1. Uncomment Stripe-related code in:
   - `src/components/checkout/StripeCheckout.tsx`
   - `src/pages/Checkout/CheckoutPage.tsx`
   - Payment selection logic
2. Add Stripe publishable key to `.env`:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   ```
3. Ensure backend has `STRIPE_SECRET_KEY` configured
4. Test thoroughly with [Stripe test cards](https://stripe.com/docs/testing)

## 👨‍💻 Developer

**Shankar Poudel**
GitHub: [https://github.com/ishankarPoudel](https://github.com/ishankarPoudel)
