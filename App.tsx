import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import DataUpload from "@/pages/DataUpload";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import type { CSSProperties } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/upload" component={DataUpload} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const style: CSSProperties = {
    "--sidebar-width": "16rem",       // 256px
    "--sidebar-width-icon": "3rem",   // default icon width
  } as CSSProperties;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style}>
          <AppSidebar />
          <SidebarInset>
            <header className="flex items-center justify-between p-4 border-b border-border/50 bg-card sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-foreground">Robinhood</h1>
                  <p className="text-xs text-muted-foreground">COVID-19 Test Supply Control Tower</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Status</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-foreground">Operational</span>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-auto">
              <div className="max-w-screen-2xl mx-auto px-8 py-10">
                <Router />
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
