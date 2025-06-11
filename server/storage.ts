import { 
  users, 
  marketData, 
  educationalContent, 
  chatMessages,
  type User, 
  type InsertUser,
  type MarketData,
  type InsertMarketData,
  type EducationalContent,
  type InsertEducationalContent,
  type ChatMessage,
  type InsertChatMessage,
  type InvestmentProfile
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(userId: number, profile: InvestmentProfile): Promise<User | undefined>;

  // Market data
  getMarketData(): Promise<MarketData[]>;
  updateMarketData(data: InsertMarketData[]): Promise<void>;

  // Educational content
  getEducationalContent(): Promise<EducationalContent[]>;
  getEducationalContentById(id: number): Promise<EducationalContent | undefined>;

  // Chat messages
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(userId?: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private marketDataStore: Map<string, MarketData>;
  private educationalContentStore: Map<number, EducationalContent>;
  private chatMessagesStore: Map<number, ChatMessage>;
  private currentUserId: number;
  private currentMarketDataId: number;
  private currentEducationalContentId: number;
  private currentChatMessageId: number;

  constructor() {
    this.users = new Map();
    this.marketDataStore = new Map();
    this.educationalContentStore = new Map();
    this.chatMessagesStore = new Map();
    this.currentUserId = 1;
    this.currentMarketDataId = 1;
    this.currentEducationalContentId = 1;
    this.currentChatMessageId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Initialize market data
    const initialMarketData = [
      { symbol: "CDI", name: "CDI", price: 13.65, change: 0.25, changePercent: 1.87 },
      { symbol: "SELIC", name: "SELIC", price: 13.25, change: 0, changePercent: 0 },
      { symbol: "BTC", name: "Bitcoin", price: 298450, change: -6421.5, changePercent: -2.15 },
      { symbol: "IBOV", name: "IBOVESPA", price: 126842, change: 1553.32, changePercent: 1.24 },
    ];

    initialMarketData.forEach(data => {
      const marketDataItem: MarketData = {
        id: this.currentMarketDataId++,
        symbol: data.symbol,
        name: data.name,
        price: data.price.toString(),
        change: data.change.toString(),
        changePercent: data.changePercent.toString(),
        updatedAt: new Date(),
      };
      this.marketDataStore.set(data.symbol, marketDataItem);
    });

    // Initialize educational content
    const initialEducationalContent = [
      {
        title: "O que são Criptomoedas?",
        description: "Entenda como funcionam as moedas digitais e suas características.",
        content: "Bitcoin é uma criptomoeda descentralizada que funciona através de blockchain. É considerado um ativo de alto risco, mas com potencial de grandes retornos. Para investidores iniciantes, recomendo começar com uma pequena parcela da carteira (máximo 5%).",
        category: "cryptocurrency",
        imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      },
      {
        title: "Renda Fixa vs Variável",
        description: "Compare os diferentes tipos de investimentos e seus riscos.",
        content: "Renda Fixa oferece retornos previsíveis e menor risco (CDB, Tesouro Direto), enquanto Renda Variável tem potencial de maiores ganhos mas com volatilidade (ações, FIIs). A proporção ideal depende do seu perfil de risco.",
        category: "investments",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      },
      {
        title: "Diversificação de Carteira",
        description: "Aprenda a distribuir seus investimentos para reduzir riscos.",
        content: "Diversificação é essencial para reduzir riscos. Recomendo: 40% renda fixa, 40% ações nacionais, 10% ações internacionais, 10% alternativos (FIIs, crypto). Ajuste conforme seu perfil de risco.",
        category: "portfolio",
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      },
    ];

    initialEducationalContent.forEach(content => {
      const educationalContentItem: EducationalContent = {
        id: this.currentEducationalContentId++,
        title: content.title,
        description: content.description,
        content: content.content,
        category: content.category,
        imageUrl: content.imageUrl,
        createdAt: new Date(),
      };
      this.educationalContentStore.set(educationalContentItem.id, educationalContentItem);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserProfile(userId: number, profile: InvestmentProfile): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.investmentProfile = profile;
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async getMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketDataStore.values());
  }

  async updateMarketData(data: InsertMarketData[]): Promise<void> {
    data.forEach(item => {
      const existing = this.marketDataStore.get(item.symbol);
      if (existing) {
        existing.price = item.price;
        existing.change = item.change || "0";
        existing.changePercent = item.changePercent || "0";
        existing.updatedAt = new Date();
        this.marketDataStore.set(item.symbol, existing);
      }
    });
  }

  async getEducationalContent(): Promise<EducationalContent[]> {
    return Array.from(this.educationalContentStore.values());
  }

  async getEducationalContentById(id: number): Promise<EducationalContent | undefined> {
    return this.educationalContentStore.get(id);
  }

  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const chatMessage: ChatMessage = {
      ...message,
      id,
      timestamp: new Date(),
    };
    this.chatMessagesStore.set(id, chatMessage);
    return chatMessage;
  }

  async getChatHistory(userId?: number): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessagesStore.values());
    if (userId) {
      return messages.filter(message => message.userId === userId);
    }
    return messages;
  }
}

export const storage = new MemStorage();
