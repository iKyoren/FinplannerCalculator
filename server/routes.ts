import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

const investmentRecommendationSchema = z.object({
  profile: z.enum(["conservative", "moderate", "aggressive"]),
  amount: z.number(),
  timeHorizon: z.number(),
  monthlyContribution: z.number().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Market data endpoint
  app.get("/api/market-data", async (req, res) => {
    try {
      const marketData = await storage.getMarketData();
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // Educational content endpoint
  app.get("/api/educational-content", async (req, res) => {
    try {
      const content = await storage.getEducationalContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch educational content" });
    }
  });

  // Get specific educational content
  app.get("/api/educational-content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getEducationalContentById(id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch educational content" });
    }
  });

  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = generateAIResponse(message);
      
      const chatMessage = await storage.saveChatMessage({
        userId: userId || null,
        message,
        response,
      });

      res.json({ response, messageId: chatMessage.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Investment recommendation endpoint
  app.post("/api/investment-recommendation", async (req, res) => {
    try {
      const validatedData = investmentRecommendationSchema.parse(req.body);
      const recommendation = generateInvestmentRecommendation(validatedData);
      res.json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to generate investment recommendation" });
    }
  });

  // Calculator endpoints
  app.post("/api/calculate/compound-interest", async (req, res) => {
    try {
      const { initialAmount, monthlyContribution, interestRate, timePeriod } = req.body;
      
      const monthlyRate = interestRate / 100 / 12;
      const months = timePeriod * 12;
      
      let futureValue = initialAmount;
      for (let month = 0; month < months; month++) {
        futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
      }
      
      const totalInvested = initialAmount + (monthlyContribution * months);
      const totalInterest = futureValue - totalInvested;
      
      res.json({
        totalInvested,
        totalInterest,
        finalAmount: futureValue,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate compound interest" });
    }
  });

  app.post("/api/calculate/retirement", async (req, res) => {
    try {
      const { currentAge, retirementAge, desiredIncome, currentSavings } = req.body;
      
      const yearsToRetirement = retirementAge - currentAge;
      const totalNeeded = desiredIncome * 12 / 0.04; // 4% withdrawal rule
      
      const futureValueOfCurrentSavings = currentSavings * Math.pow(1.10, yearsToRetirement);
      const stillNeeded = Math.max(0, totalNeeded - futureValueOfCurrentSavings);
      
      const monthlyRate = 0.10 / 12;
      const monthsToRetirement = yearsToRetirement * 12;
      const monthlyNeeded = stillNeeded * monthlyRate / (Math.pow(1 + monthlyRate, monthsToRetirement) - 1);
      
      res.json({
        yearsToRetirement,
        totalNeeded,
        monthlyNeeded,
        futureValueOfCurrentSavings,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate retirement plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('bitcoin') || lowerMessage.includes('cripto')) {
    return 'Bitcoin é uma criptomoeda descentralizada que funciona através de blockchain. É considerado um ativo de alto risco, mas com potencial de grandes retornos. Para investidores iniciantes, recomendo começar com uma pequena parcela da carteira (máximo 5%). Volatilidade média de ±60% ao ano.';
  }
  
  if (lowerMessage.includes('renda fixa') || lowerMessage.includes('renda variável')) {
    return 'Renda Fixa oferece retornos previsíveis e menor risco (CDB 13%, Tesouro 11%), enquanto Renda Variável tem potencial de maiores ganhos mas com volatilidade (IBOVESPA 21% em 2023). A proporção ideal depende do seu perfil de risco e prazo de investimento.';
  }
  
  if (lowerMessage.includes('diversificar') || lowerMessage.includes('carteira')) {
    return 'Diversificação é essencial para reduzir riscos. Para perfil moderado recomendo: 35% renda fixa, 40% ações nacionais, 15% FIIs, 10% criptomoedas. Rebalanceie trimestralmente e mantenha reserva de emergência separada.';
  }
  
  if (lowerMessage.includes('perfil') || lowerMessage.includes('conservador') || lowerMessage.includes('agressivo')) {
    return 'Conservador (8-12% a.a.): Foca em segurança com CDB, Tesouro. Moderado (14-18% a.a.): Equilibra renda fixa e ações. Agressivo (18-30% a.a.): Prioriza crescimento com ações e crypto. Considere idade, objetivos e tolerância a perdas.';
  }
  
  if (lowerMessage.includes('cdb')) {
    return 'CDB (Certificado de Depósito Bancário) rende cerca de 13% a.a. atualmente, com segurança do FGC até R$ 250 mil por banco. Ideal para reserva de emergência e perfis conservadores. Liquidez varia conforme o produto escolhido.';
  }
  
  if (lowerMessage.includes('tesouro direto')) {
    return 'Tesouro Direto são títulos públicos do governo federal, considerados os investimentos mais seguros do país. Tesouro IPCA+ oferece 6,2% + inflação. Aplicação mínima R$ 30, ideal para objetivos de longo prazo.';
  }
  
  if (lowerMessage.includes('risco') || lowerMessage.includes('riscos')) {
    return 'Principais riscos: Mercado (volatilidade), Crédito (calote), Liquidez (dificuldade de venda), Inflação (perda do poder de compra). Criptomoedas têm risco máximo. Diversificação é a melhor proteção.';
  }
  
  if (lowerMessage.includes('calcular') || lowerMessage.includes('retorno') || lowerMessage.includes('rendimento')) {
    return 'Para calcular retornos use nossa calculadora de juros compostos! Exemplo: R$ 1.000 inicial + R$ 500/mês a 12% a.a. por 10 anos = R$ 115.000 finais (R$ 61.000 investido + R$ 54.000 juros).';
  }
  
  return 'Ótima pergunta! Baseado em dados reais do mercado brasileiro, posso ajudar com estratégias personalizadas. Use nossas calculadoras para simular cenários específicos para sua situação financeira. Em que posso ajudar mais?';
}

function generateInvestmentRecommendation(data: z.infer<typeof investmentRecommendationSchema>) {
  const { profile, amount, timeHorizon, monthlyContribution = 0 } = data;
  
  let recommendation = '';
  let suggestedAllocation: Record<string, number> = {};
  let expectedReturn = 0;
  
  switch (profile) {
    case 'conservative':
      expectedReturn = 0.10; // 10% a.a.
      suggestedAllocation = {
        'Poupança/CDB': 40,
        'Tesouro Direto': 30,
        'LCI/LCA': 20,
        'Fundos DI': 10,
      };
      recommendation = 'Para seu perfil conservador, recomendamos focar em renda fixa com liquidez e segurança. O CDB e Tesouro Direto são ideais para preservar o capital com rentabilidade superior à poupança.';
      break;
      
    case 'moderate':
      expectedReturn = 0.14; // 14% a.a.
      suggestedAllocation = {
        'Renda Fixa': 50,
        'Ações Blue Chips': 25,
        'FIIs': 15,
        'Fundos Multimercado': 10,
      };
      recommendation = 'Seu perfil moderado permite uma boa diversificação entre renda fixa e variável. Mantenha uma base sólida em renda fixa e diversifique em ações de empresas consolidadas.';
      break;
      
    case 'aggressive':
      expectedReturn = 0.18; // 18% a.a.
      suggestedAllocation = {
        'Ações Growth': 40,
        'Ações Value': 20,
        'FIIs': 15,
        'ETFs Internacionais': 15,
        'Criptomoedas': 5,
        'Renda Fixa': 5,
      };
      recommendation = 'Como investidor agressivo, você pode explorar ativos de maior risco e retorno. Foque em ações de crescimento e diversifique internacionalmente, mantendo apenas uma pequena reserva em renda fixa.';
      break;
  }
  
  // Calculate projected values
  const futureValue = (amount + monthlyContribution * 12 * timeHorizon) * Math.pow(1 + expectedReturn, timeHorizon);
  const totalInvested = amount + monthlyContribution * 12 * timeHorizon;
  const totalGains = futureValue - totalInvested;
  
  return {
    recommendation,
    suggestedAllocation,
    expectedReturn: expectedReturn * 100,
    projectedValue: futureValue,
    totalInvested,
    totalGains,
    riskLevel: profile === 'conservative' ? 'Baixo' : profile === 'moderate' ? 'Médio' : 'Alto',
  };
}
