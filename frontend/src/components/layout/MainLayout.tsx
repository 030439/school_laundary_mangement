import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';

interface MainLayoutProps {
  children: ReactNode;
}



export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 lg:ml-64 min-h-screen">
        {/* Content */}
        <main className="flex-1">
          <div className="p-4 lg:p-8 pt-16 lg:pt-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background px-4 py-3 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          © {new Date().getFullYear()} YourAppName. All rights reserved.
        </span>
        

      <span className="text-xs">
        Developed with ❤️ by Praim
        
      </span>


        </div>
      </footer>

      </div>
    </div>
  );
}
