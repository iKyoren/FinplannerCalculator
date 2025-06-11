import { apiRequest } from "./queryClient";

export async function fetchMarketData() {
  const response = await apiRequest("GET", "/api/market-data");
  return response.json();
}

export async function fetchEducationalContent() {
  const response = await apiRequest("GET", "/api/educational-content");
  return response.json();
}

export async function fetchEducationalContentById(id: number) {
  const response = await apiRequest("GET", `/api/educational-content/${id}`);
  return response.json();
}

export async function sendChatMessage(message: string, userId?: number) {
  const response = await apiRequest("POST", "/api/chat", { message, userId });
  return response.json();
}

export async function getInvestmentRecommendation(data: {
  profile: string;
  amount: number;
  timeHorizon: number;
  monthlyContribution?: number;
}) {
  const response = await apiRequest("POST", "/api/investment-recommendation", data);
  return response.json();
}

export async function calculateCompoundInterest(data: {
  initialAmount: number;
  monthlyContribution: number;
  interestRate: number;
  timePeriod: number;
}) {
  const response = await apiRequest("POST", "/api/calculate/compound-interest", data);
  return response.json();
}

export async function calculateRetirement(data: {
  currentAge: number;
  retirementAge: number;
  desiredIncome: number;
  currentSavings: number;
}) {
  const response = await apiRequest("POST", "/api/calculate/retirement", data);
  return response.json();
}
