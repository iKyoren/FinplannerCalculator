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
Como DinDin, assistente financeiro educativo e extremamente educado, responda à pergunta: "${message}"

${userProfile ? `Perfil do usuário: ${JSON.stringify(userProfile)}` : ""}

DIRETRIZES:
1. Seja educado, didático e prático
2. Use exemplos com valores brasileiros
3. Não responda a xingamentos - redirecione educadamente
4. Inclua dados reais do mercado brasileiro quando relevante
5. Formate informações importantes com **negrito**
6. Use analogias para explicar conceitos complexos
7. Seja específico e actionável

Se a mensagem contém linguagem inadequada, responda educadamente redirecionando para educação financeira.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é DinDin, um assistente financeiro brasileiro extremamente educado, didático e especialista em educação financeira. Nunca responde a ofensas, sempre redireciona educadamente para temas financeiros."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    return response.choices[0].message.content || "Desculpe, não consegui processar sua pergunta. Pode reformular?";
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    return "Desculpe, estou com dificuldades técnicas no momento. Pode tentar novamente?";
  }
}