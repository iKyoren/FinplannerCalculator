import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, TrendingUp } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navigationItems = [
    { id: "mercado", label: "Dados de Mercado" },
    { id: "educacao", label: "Educação" },
    { id: "perfis", label: "Perfis" },
    { id: "calculadoras", label: "Calculadoras" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-2 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 -ml-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-transparent bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] p-0.5">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <img 
                  src="/attached_assets/1000039624_1749767113981.png" 
                  alt="FinPlanner Logo" 
                  className="w-full h-full object-contain p-1 sm:p-1.5"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="w-full h-full gradient-primary rounded-full flex items-center justify-center"><span class="text-white font-bold text-sm sm:text-lg">F</span></div>';
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] bg-clip-text text-transparent tracking-tight">
                FinPlanner
              </span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider hidden sm:block">
                Educação Financeira
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
