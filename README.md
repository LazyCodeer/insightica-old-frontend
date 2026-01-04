# Insightica

![Insightica Logo](./public/favicon.svg)

**Clarity Over Chaos, Insights Over Noise**

Insightica is a comprehensive trading analytics platform designed to empower retail traders with data-driven insights, machine learning-powered predictions, and intuitive visualizations. Cut through the noise and make informed trading decisions based on historical indicator performance and AI-powered forecasts.

---

## 🚀 Features

### Core Tools

- **🔍 Evaluator Tool**
  - Generate performance benchmarks of technical indicators using historical market data
  - Compare multiple indicators side-by-side
  - Analyze indicator combinations for optimal pairings
  - Detailed metrics including Sharpe Ratio, Total Return, Win Rate, Max Drawdown, and more

- **🔮 Predictor Tool** (Coming Soon)
  - AI-powered prediction of technical indicator effectiveness
  - Machine learning models trained on historical data
  - Confidence scores for each indicator
  - Personalized recommendations based on trading parameters

- **📊 Backtester Tool** (In Development)
  - Test trading strategies against historical data
  - Comprehensive performance analytics
  - Risk assessment and optimization

### Platform Features

- **📈 Intuitive Graphical Views**: Interactive charts and visualizations for easy data interpretation
- **🤖 Machine Learning Powered**: Advanced algorithms for pattern recognition and forecasting
- **👤 User Authentication**: Secure Firebase-based authentication system
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI**: Built with Radix UI components and Tailwind CSS
- **⚡ Fast Performance**: Powered by Next.js 15 with Turbopack

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (React 18)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Charts**: [Recharts](https://recharts.org/), React Grid Heatmap, React Chord Diagram
- **Icons**: [Lucide React](https://lucide.dev/), React Icons
- **Forms**: React Hook Form with Zod validation
- **Animations**: AOS (Animate On Scroll), Tailwind Animate

### Backend & Services
- **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **Hosting**: Firebase App Hosting
- **AI/ML**: [Google Genkit](https://firebase.google.com/docs/genkit) with Google AI
- **API**: Next.js API Routes

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Next.js with Turbopack
- **Linting**: ESLint
- **Type Checking**: TypeScript

---

## 📦 Installation

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/codecylabsofficial/insightica.git
   cd insightica
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:9002`

---

## 🎯 Available Scripts

- `npm run dev` - Start development server with Turbopack on port 9002
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run typecheck` - Run TypeScript type checking

---

## 📂 Project Structure

```
insightica/
├── public/                 # Static assets (images, icons, etc.)
│   └── assets/            # Team photos and other assets
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── about/         # About page
│   │   ├── auth/          # Authentication pages (login, signup, etc.)
│   │   ├── contact/       # Contact page
│   │   ├── early-access/  # Early access signup
│   │   ├── forms/         # Form pages (feedback, invest, work-with-us)
│   │   ├── privacy-policy/# Privacy policy page
│   │   ├── terms-and-conditions/ # Terms and conditions
│   │   ├── testing-results/ # Testing results page
│   │   ├── tools/         # Trading tools pages
│   │   │   ├── backtester/
│   │   │   ├── evaluator/
│   │   │   └── predictor/
│   │   ├── tutorials/     # Tutorial pages
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Homepage
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   ├── marketing/     # Marketing sections
│   │   └── ui/            # Reusable UI components (shadcn/ui)
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── data/              # Static data and constants
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   │   ├── apiClient.ts   # API client configuration
│   │   ├── constants.ts   # Application constants
│   │   └── utils.ts       # Utility functions
│   └── types/             # TypeScript type definitions
├── docs/                  # Documentation
│   └── blueprint.md       # Project blueprint
├── .gitignore             # Git ignore rules
├── apphosting.yaml        # Firebase App Hosting configuration
├── components.json        # shadcn/ui configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Deep Indigo (#4B0082) - Intellect, insight, sophistication
- **Background**: Very Dark Indigo (#1A0033) - Legibility and focus
- **Accent**: Purple (#800080) - Contrast for CTAs and highlights

### Typography
- **Font**: PT Sans (sans-serif) for body text and headlines
- **Icons**: Minimalist design to represent data points and insights

### Layout
- Grid-based layout for organized content
- Responsive design for all screen sizes
- Subtle animations on data visualizations
  
---

## 👥 Team

### Founders

**Manas Nandan** - Founder  
*Product, Algorithms & Vision*  
[LinkedIn](https://www.linkedin.com/in/manas-nandan/)

**Saatvik Pandey** - Co-founder  
*Technology & Product Design*  
[LinkedIn](https://www.linkedin.com/in/saatvik-pandey-8250642a7/)

**Saisab Sadhu** - Co-founder  
*Operations, Finance & Coordination*  
[LinkedIn](https://www.linkedin.com/in/saisab-sadhu/)

**Anuj Wani** - Co-founder  
*Strategy, Product & Market Understanding*  
[LinkedIn](https://www.linkedin.com/in/anuj--wani/)

---

## 📞 Contact

- **Website**: [Insightica](https://insightica.com)
- **Email**: Contact us through the website
- **Early Access**: [Sign up for early access](https://insightica.com/early-access)

---

## 🎯 Mission

Insightica began with a simple frustration shared by countless traders: technical indicators are inconsistent. Our mission is to empower traders everywhere with structured clarity and evidence-driven tools. Through robust analysis, transparent methodologies, and AI-driven insights, Insightica transforms trading into a clear, evidence-based pursuit—not a gamble.

---

**Made with ❤️ by the CodecyLabs Team**
