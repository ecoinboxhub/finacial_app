export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  balance: number;
  savings: number;
  investments: number;
  debts: number;
  monthlyIncome: number;
  budgetHousing: number;
  budgetFood: number;
  budgetUtilities: number;
  budgetSavings: number;
  budgetInvestments: number;
  completedModules: string[];
  createdAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  category: string;
  body: string;
  author: string;
  authorId?: string;
  likes: number;
  likedBy: string[];
  comments: ForumComment[];
  createdAt: string;
}

export interface ForumComment {
  author: string;
  text: string;
}

export interface EducationModule {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  desc: string;
  explanation: string;
  benefits: string[];
  risks: string[];
  example: string;
}

export interface PlatformEntry {
  name: string;
  type: string;
  info: string;
}

export interface CalculatorInputs {
  homePrice: number;
  downPayment: number;
  mortgageTerm: number;
  interestRate: number;
  principal: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number;
  compoundingFrequency: number;
  simplePrincipal: number;
  simpleRate: number;
  simpleTime: number;
  targetSavings: number;
  startingSavings: number;
  savingsMonthly: number;
  savingsRate: number;
}

export interface CalculatorResults {
  mortgageMonthly: number;
  mortgageTotalInterest: number;
  mortgageTotalPayment: number;
  investmentFutureValue: number;
  investmentTotalDeposits: number;
  investmentTotalInterest: number;
  compoundFutureValue: number;
  compoundTotalDeposits: number;
  compoundTotalInterest: number;
  simpleTotalInterest: number;
  simpleFutureValue: number;
  savingsMonthsToGoal: number;
  savingsTotalDeposits: number;
  savingsTotalInterest: number;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
}
