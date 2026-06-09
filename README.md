# EcoFinApp - AI Financial Education & Investment Academy

EcoFinApp is a modern, responsive, and AI-powered web application designed to teach financial literacy, investment strategies, and budgeting principles. It features real-time calculators, an interactive forum, and a Gemini-powered conversational assistant to guide learners.

## 🚀 Key Features

- 📊 **Dynamic Dashboard**: View net worth balance, savings/investments/debts stats, budget progress charts, and long-term compound interest projections (8% APY).
- 🎓 **Learning Academy (19 Modules)**:
  - **Financial Education**: Budgeting, Savings, Banking, Credit & Debt, Mortgages, and Retirement.
  - **Investment Modules**: Mutual Funds, Bonds, Stocks, Treasury Bills, Commercial Papers, Forex, Crypto, Real Estate, Agriculture, Transportation, Oil & Gas, Referral Ops, and Local Arbitrage.
  - Platform directory of trusted brokers (Fidelity, Vanguard, TreasuryDirect, Coinbase, etc.).
- 🧮 **Interactive Calculators**:
  - Mortgage Calculator (down payments, monthly totals, and total interest).
  - Investment Growth Calculator (starting lump sum, monthly additions, APY compound projection).
  - Compound Interest Calculator (adjustable compounding frequencies).
  - Simple Interest Calculator.
  - Savings Goal Calculator (calculates exact months needed to hit a goal).
- 🤖 **AI Financial Coach**: Interactive assistant that processes conversational queries. Includes offline mock-advice fallback or integrates your personal Google Gemini API key (saved securely in `localStorage`).
- 💬 **Community Discussions Q&A**: LocalStorage-persisted forum allowing users to post questions, like discussions, and write comments.
- ⚙️ **Premium Settings**: Light/Dark theme toggling, custom profile/capital editor, JSON export/import of profile settings, and data resets.

---

## 💻 Tech Stack

- **Core**: React 19 + Vite
- **Styling**: Vanilla CSS (modern variables, glassmorphism, responsive grids)
- **App Platform**: Capacitor (for native Android builds)
- **Deployment**: Vercel

---

## 🌐 Live Web Deployment

The application has been successfully deployed to Vercel and is live at:
👉 **[https://financial-app-iota-rouge.vercel.app](https://financial-app-iota-rouge.vercel.app)**

*Note: All updates made to the master branch will automatically sync and redeploy via Vercel integration.*

---

## 📱 Android APK App

The PWA has been compiled into a native Android application using Capacitor.
- **Local APK File**: [ecofinapp-debug.apk](file:///C:/Users/ibrah/Documents/Gemini/D_G_Workspace/FINANCIAL_APP/ecofinapp-debug.apk) (approx. 5.4 MB)
- **Build Target**: Java 17, Android SDK Level 36 (minSdkVersion 24).

### How to Install the APK on Android:
1. Transfer the `ecofinapp-debug.apk` file to your Android phone.
2. Open the file manager on your phone and tap the APK file.
3. If prompted, enable **"Install from Unknown Sources"** in your phone settings.
4. Complete the installation and open the app!

---

## 🐙 Git Push & GitHub Releases (User Action Required)

Since we are running in a background environment, interactive GitHub authentication (browser login/Git Credential Manager) is blocked. To publish the code and release the APK, please complete these steps:

1. **Push Code to GitHub**:
   Open your terminal in this directory (`C:\Users\ibrah\Documents\Gemini\D_G_Workspace\FINANCIAL_APP`) and run:
   ```bash
   git push -u origin main
   ```
   *This will prompt your system's Git Credential Manager to sign in and complete the push.*

2. **Publish the Release on GitHub**:
   - Go to your repository page: [https://github.com/ecoinboxhub/finacial_app](https://github.com/ecoinboxhub/finacial_app)
   - Click **Releases** on the right sidebar -> **Draft a new release**.
   - Set tag version to `v1.0.0` and title to `Release v1.0.0 - Production Build`.
   - Drag and drop the `ecofinapp-debug.apk` file from your project root into the binaries box.
   - Click **Publish release**.

---

## 🏗️ Project Architecture

```
FINANCIAL_APP/
├── android/               # Native Android build configuration (Capacitor)
├── public/                # Static assets (favicons, app logo, manifest)
│   ├── logo.png           # Professional App Logo
│   ├── icon.png           # Android launcher icon
│   └── favicon.png        # Web favicon
├── src/
│   ├── components/        # Modular components
│   │   ├── AuthModal.jsx        # Login, Register, Profile auth modal
│   │   ├── Dashboard.jsx        # Main overview, budget progress, compounding growth
│   │   ├── LearningHub.jsx      # 19 learning modules & platform directory
│   │   ├── Calculators.jsx      # 5 financial calculators
│   │   ├── AiAssistant.jsx      # Client-side Gemini chat API & local fallback
│   │   ├── Community.jsx        # Q&A forums, likes, and comments
│   │   └── ProfileSettings.jsx  # Dark mode toggles, API key, backup JSON
│   ├── App.jsx            # State coordinator, sidebar/mobile layout router
│   ├── index.css          # Core design system stylesheet
│   └── main.jsx           # React mounting index
├── capacitor.config.json  # Capacitor app configuration
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```
