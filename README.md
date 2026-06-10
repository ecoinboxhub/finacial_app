# EcoFinApp - AI Financial Education & Investment Academy

EcoFinApp is a modern, responsive, and AI-powered web application designed to teach financial literacy, investment strategies, and budgeting principles. Built for **students, market traders, and corporate executives across Africa and globally**.

🌐 **Live**: [https://financial-app-iota-rouge.vercel.app](https://financial-app-iota-rouge.vercel.app)

---

## 🚀 Key Features

- 📊 **Dynamic Dashboard**: View net worth, savings/investments/debts stats, budget progress bars, and long-term compound interest projections (8% APY).
- 🎓 **Learning Academy (19 Modules)**:
  - **Financial Education (6)**: Budgeting, Savings, Banking (+Mobile Money/M-Pesa), Credit & Debt, Mortgages, Retirement & Pension (RSA/NSSF).
  - **Investment Modules (13)**: Mutual Funds, Bonds, Stocks, T-Bills, Commercial Paper, Forex, Crypto, Real Estate, Agriculture, Transportation, Oil & Gas, Referrals, Local Arbitrage — all with African market context.
  - **Platform Directory**: NGX, NSE, GSE, PiggyVest, Chipper Cash, M-KOPA, Fidelity, Vanguard, Coinbase.
- 🧮 **6 Interactive Calculators**: Mortgage, Investment Growth, Compound Interest, Simple Interest, Savings Goal + **Basic Arithmetic Calculator** (add, subtract, multiply, divide, √, %, π, memory, history).
- 🖊️ **Dual Input Controls**: Every calculator field has both a **slider** and a **typeable number input** — drag or type exact values.
- 🤖 **AI Financial Coach**: Chat-based assistant with offline fallback + optional Gemini API integration.
- 💬 **Community Q&A Forum**: Create posts, like discussions, and comment — persisted to LocalStorage.
- 💱 **Multi-Currency Support**: USD, NGN (Naira), KES (Shilling), GHS (Cedi), ZAR (Rand), EGP (Pound), GBP, EUR — switch anytime from the header.
- 🎉 **Confetti & Animations**: Page transitions, staggered list animations, ripple effects, count-up numbers, and toast notifications on every action.

## 👥 User Personas

| Persona | Key Features |
|---------|-------------|
| 🎓 **Students** | Budget tracking, learning modules, savings calculators, T-Bill investing |
| 🏪 **Market Traders (Africa)** | Local arbitrage, T-Bills, forex, mobile money (M-Pesa), agriculture investing |
| 💼 **Corporate Executives** | Investment growth projection, mortgage calc, retirement/pension planning, REITs |
| 🌍 **African Diaspora** | Multi-currency (NGN/KES/GHS/ZAR), remittance context, cross-border platform directory |
| 📱 **Mobile-First Users** | Responsive design, bottom navigation, Android APK support |

## 💻 Tech Stack

- **Core**: React 19 + Vite 8
- **Styling**: Pure CSS (glassmorphism, custom properties, responsive grids)
- **State**: React Context (Toast, Currency)
- **Persistence**: LocalStorage (offline-first, no backend required)
- **Native**: Capacitor (Android APK build)
- **Deployment**: Vercel

## 📁 Project Structure

```
FINANCIAL_APP/
├── android/                    # Capacitor native Android config
├── public/                     # Static assets (favicon, logo, manifest)
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx       # Login/Signup/Reset with toast feedback
│   │   ├── Dashboard.jsx       # Overview, budgets, projections, confetti
│   │   ├── LearningHub.jsx     # 19 modules, directory, confetti on rank-up
│   │   ├── Calculators.jsx     # 5 financial calculators (multi-currency)
│   │   ├── AiAssistant.jsx     # Gemini chat + offline fallback
│   │   ├── Community.jsx       # Q&A forum with likes/comments
│   │   ├── ProfileSettings.jsx # Profile, currency, API key, sync/export
│   │   ├── ToastContext.jsx    # Global toast notification system
│   │   └── CurrencyContext.jsx # Multi-currency formatter & exchange rates
│   ├── App.jsx                 # Layout router, theme, confetti system
│   ├── index.css               # Full design system + animations
│   └── main.jsx                # React mount
├── dist/                       # Vite build output
├── capacitor.config.json
├── vite.config.js
├── package.json
└── README.md
```

## 🔧 Development

```bash
npm install
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## 📱 Android APK

The app is compiled into a native Android APK via Capacitor.

- **APK**: `ecofinapp-debug.apk` (in project root)
- **Build**: Target SDK 36, Min SDK 24

To install: transfer APK to phone, enable "Install from Unknown Sources", tap to install.

## 🐙 GitHub

- **Repository**: [https://github.com/ecoinboxhub/finacial_app](https://github.com/ecoinboxhub/finacial_app)
- **Latest Release**: [v1.1.0](https://github.com/ecoinboxhub/finacial_app/releases/tag/v1.1.0)
- **Releases include**: Source code + APK binary for direct download

## 📜 License

Educational use. This app does not provide certified financial advice.
