export interface MarketDataPoint {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface CalculatorInputs {
  initialAmount: number;
  monthlyContribution: number;
  interestRate: number;
  timePeriod: number;
  investmentType?: string;
}

export interface CalculatorResult {
  totalInvested: number;
  totalInterest: number;
  finalAmount: number;
  recommendation?: string;
}

export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  desiredIncome: number;
  currentSavings: number;
}

export interface RetirementResult {
  yearsToRetirement: number;
  totalNeeded: number;
  monthlyNeeded: number;
  futureValueOfCurrentSavings: number;
}

export interface InvestmentComparison {
  name: string;
  rate: number;
  tax: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  isUser: boolean;
  timestamp: Date;
}

export type InvestmentProfile = "conservative" | "moderate" | "aggressive";

export interface ProfileData {
  name: string;
  color: string;
  description: string;
  expectedReturn: string;
  riskLevel: string;
  timeHorizon: string;
  characteristics: string[];
  investments: string[];
}
