import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CustomGptManagerPage from "@/pages/CustomGptManagerPage";
import { Brain, Keyboard } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useKeyboardShortcuts, KeyboardShortcut } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsHelp } from "@/components/ui/keyboard-shortcuts-help";
import { useState } from "react";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function AppNavigation() {
  const [location, setLocation] = useLocation();
  const [helpVisible, setHelpVisible] = useState(false);

  // Define app-level keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'g h',
      action: () => setLocation('/'),
      description: 'Go to Home',
      category: 'Navigation'
    },
    {
      key: 'g a',
      action: () => setLocation('/custom-gpt'),
      description: 'Go to AI Assistants',
      category: 'Navigation'
    },
    {
      key: '?',
      action: () => setHelpVisible(true),
      description: 'Show keyboard shortcuts',
      category: 'Help'
    }
  ];

  // Use the keyboard shortcuts hook
  const { shortcutsByCategory } = useKeyboardShortcuts(shortcuts);

  return (
    <>
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto px-2 md:px-4 py-2 flex justify-between items-center">
          <Link href="/">
            <img 
              src="/assets/get-more-views-logo-horizontal.png" 
              alt="Get More Views" 
              className="h-6 md:h-8 cursor-pointer"
            />
          </Link>
          <nav className="flex items-center space-x-1 md:space-x-2">
            <Button variant="ghost" size="sm" asChild className="text-xs md:text-sm px-2 md:px-3">
              <Link href="/custom-gpt" className="flex items-center">
                <Brain className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">AI Assistants</span>
                <span className="sm:hidden">AI</span>
              </Link>
            </Button>
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs md:text-sm px-2 md:px-3"
              onClick={() => setHelpVisible(true)}
            >
              <Keyboard className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
              <span className="hidden md:inline">Shortcuts</span>
            </Button>
          </nav>
        </div>
      </header>

      <KeyboardShortcutsHelp
        open={helpVisible}
        onOpenChange={setHelpVisible}
        shortcutsByCategory={shortcutsByCategory}
      />

      <main className="flex-1 overflow-y-auto">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/custom-gpt" component={CustomGptManagerPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
          <AppNavigation />
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;