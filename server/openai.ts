import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
});

// Debug: verificar se a chave está carregada
console.log("OpenAI API Key status:", process.env.OPENAI_API_KEY ? "Loaded" : "Not loaded");

interface UserFinancialProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  leisureExpenses: number;
  investmentProfile: "conservative" | "moderate" | "aggressive";
  age: number;
  availableToInvest: number;
}

export async function generatePersonalizedRecommendations(profile: UserFinancialProfile) {
  const prompt = `
Como especialista em educação financeira brasileira, analise este perfil e gere recomendações personalizadas:

PERFIL DO USUÁRIO:
- Renda mensal: R$ ${profile.monthlyIncome.toLocaleString()}
- Gastos essenciais: R$ ${profile.monthlyExpenses.toLocaleString()}
- Gastos com lazer: R$ ${profile.leisureExpenses.toLocaleString()}
- Disponível para investir: R$ ${profile.availableToInvest.toLocaleString()}
- Idade: ${profile.age} anos
- Perfil: ${profile.investmentProfile}

INSTRUÇÕES:
1. Gere 4-6 recomendações de investimentos específicas para este perfil
2. Para cada recomendação, inclua:
   - Nome do investimento
   - Porcentagem sugerida da carteira (%)
   - Retorno esperado
   - Nível de risco (Baixo/Médio/Alto)
   - Justificativa PERSONALIZADA baseada nos dados financeiros
   - Valor mínimo de investimento
   - Prazo recomendado
   - Explicação didática de como funciona

3. Considere:
   - Situação financeira atual (sobra mensal)
   - Perfil de risco escolhido
   - Idade e horizonte de investimento
   - Necessidade de reserva de emergência
   - Diversificação apropriada

4. Use linguagem didática, exemplos práticos em reais brasileiros
5. Seja específico sobre PORQUÊ cada investimento faz sentido para ESTA pessoa

Responda em JSON com este formato:
{
  "recommendations": [
    {
      "name": "string",
      "allocation": number,
      "expectedReturn": "string",
      "risk": "Baixo|Médio|Alto",
      "reason": "string - justificativa personalizada",
      "description": "string - o que é",
      "howItWorks": "string - como funciona",
      "minAmount": number,
      "timeHorizon": "string"
    }
  ],
  "summary": "string - resumo da estratégia para este perfil",
  "warnings": ["string"] - alertas específicos para esta situação
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em educação financeira brasileira com 15 anos de experiência. Suas recomendações são práticas, didáticas e personalizadas para cada situação financeira específica."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    throw new Error("Erro ao gerar recomendações personalizadas");
  }
}

export async function generateEducationalContent(topic: string, userContext?: string) {
  const prompt = `
Como especialista em educação financeira, explique de forma didática e prática o tema: "${topic}"

${userContext ? `Contexto do usuário: ${userContext}` : ""}

INSTRUÇÕES:
1. Use linguagem simples e didática
2. Inclua exemplos práticos com valores em reais
3. Explique conceitos complexos com analogias
4. Seja específico sobre como implementar na prática
5. Inclua alertas e dicas importantes

Responda em JSON:
{
  "title": "string",
  "explanation": "string - explicação principal",
  "practicalExample": "string - exemplo com valores reais",
  "tips": ["string"] - dicas práticas,
  "warnings": ["string"] - alertas importantes
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    throw new Error("Erro ao gerar conteúdo educacional");
  }
}

export async function generateSmartChatResponse(message: string, userProfile?: any) {
  const prompt = `
Como DinDin, o assistente financeiro mais gentil e didático do Brasil, responda à pergunta: "${message}"

${userProfile ? `Contexto do usuário: ${JSON.stringify(userProfile)}` : ""}

PERSONALIDADE E EXPERTISE:
1. Seja GÊNIO em finanças: análise fundamentalista, valuation, macro/microeconomia, derivativos, análise técnica
2. Demonstre conhecimento profundo sobre mercado brasileiro: B3, FGC, CVM, Bacen, produtos estruturados
3. Use linguagem gentil e didática, transformando complexidade em simplicidade
4. NUNCA responda ofensas - redirecione com carinho extremo para educação financeira
5. Aplique conhecimento de psicologia comportamental e vieses cognitivos nos investimentos
6. Forneça análises sophisticadas mas explicadas de forma acessível
7. Use dados reais: Selic 13,75%, CDI 13,65%, IPCA 4,62%, Dólar, índices, yields
8. Demonstre expertise em: ações, FIIs, renda fixa, derivativos, fundos, crypto, internacional
9. Termine com insights valiosos e próximos passos inteligentes

ESTRUTURA DA RESPOSTA:
- Cumprimento caloroso e acolhedor
- Explicação didática com analogias
- Exemplos práticos com valores reais
- Dicas importantes destacadas
- Próximos passos concretos
- Pergunta para engajar o usuário

Se a mensagem contém linguagem inadequada, responda com extrema gentileza: "Entendo que às vezes ficamos frustrados, mas estou aqui para te ajudar com muito carinho! Que tal conversarmos sobre seus objetivos financeiros?"
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é DinDin, o GÊNIO das finanças brasileiras - combinando 20 anos de experiência em mercado financeiro com extrema gentileza e didática. Você é PhD em Economia, ex-gestor de fundos multibilionários, especialista em mercado de capitais, análise fundamentalista e behavioralista. Sua missão é democratizar o conhecimento financeiro com carinho extremo, transformando conceitos complexos em linguagem simples. Você conhece profundamente: macro/microeconomia, valuation, derivativos, análise técnica, psicologia do investidor, e todos os produtos do mercado brasileiro."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    return response.choices[0].message.content || "Oi! Desculpe, não consegui processar sua pergunta direito. Pode me contar novamente o que gostaria de saber sobre investimentos? Estou aqui para te ajudar!";
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    throw error; // Re-throw to be caught by the fallback system
  }
}