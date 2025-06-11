import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "@/lib/api";
import { Bot, Send, X, MessageCircle } from "lucide-react";
import type { ChatMessage } from "@/types";

export default function ChatAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "Olá! Sou DinDin, seu assistente financeiro. Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      const responseMessage: ChatMessage = {
        id: Date.now().toString(),
        message: data.response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);
    }
  });

  const suggestedQuestions = [
    "O que é Bitcoin e como funciona?",
    "Qual a diferença entre renda fixa e variável?",
    "Como diversificar minha carteira?",
    "Qual investimento é melhor para meu perfil?",
    "O que é CDI e como investir?",
    "Como escolher entre perfil conservador e agressivo?",
    "Quais são os riscos das criptomoedas?",
    "Como calcular o retorno dos meus investimentos?"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage("");
    setShowSuggestions(false); // Hide suggestions after typing message
  };

  const handleSuggestedQuestion = (question: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: question,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(question);
    setShowSuggestions(false); // Hide suggestions after selection
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Minimized Chat Bubble */}
      {!isExpanded && (
        <div className="relative">
          <Button
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 rounded-full bg-card border-2 border-transparent bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] p-0.5 hover:scale-110 transition-all shadow-lg"
            size="icon"
          >
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
              <img 
                src="/attached_assets/_395a0789-9ccf-4ddd-8fff-cc9453078074_1749608011758.jpeg" 
                alt="DinDin Assistant" 
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="w-12 h-12 rounded-full gradient-primary flex items-center justify-center"><span class="text-white font-bold text-lg">D</span></div>';
                }}
              />
            </div>
          </Button>
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 animate-fade-in-up">
              <div className="bg-card border border-border rounded-lg shadow-lg p-3 max-w-xs">
                <p className="text-sm text-foreground">Oi! Sou DinDin, seu assistente financeiro! 👋</p>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expanded Chat Window */}
      {isExpanded && (
        <Card className="w-80 h-96 border-border/50 shadow-xl animate-fade-in-up">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-transparent bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] p-0.5">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                    <img 
                      src="/attached_assets/_395a0789-9ccf-4ddd-8fff-cc9453078074_1749608011758.jpeg" 
                      alt="DinDin Assistant" 
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-8 h-8 rounded-full gradient-primary flex items-center justify-center"><span class="text-white font-bold text-sm">D</span></div>';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-sm gradient-text">DinDin</CardTitle>
                  <p className="text-xs text-muted-foreground">Assistente Financeiro IA</p>
                </div>
              </div>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.isUser 
                      ? 'ml-8 bg-primary text-primary-foreground' 
                      : 'mr-8 bg-muted text-muted-foreground'
                  } rounded-lg p-3`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="mr-8 bg-muted text-muted-foreground rounded-lg p-3">
                  <p className="text-sm">DinDin está digitando...</p>
                </div>
              )}

              {/* Suggested Questions */}
              {showSuggestions && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground px-2 font-medium">💡 Perguntas sugeridas:</p>
                  <div className="grid gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="w-full text-left bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 border border-blue-200/50 dark:border-purple-700/30 rounded-lg p-3 text-sm text-foreground transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                      >
                        <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta..."
                  className="flex-1"
                  disabled={chatMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  disabled={!inputMessage.trim() || chatMutation.isPending}
                  className="gradient-primary hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
