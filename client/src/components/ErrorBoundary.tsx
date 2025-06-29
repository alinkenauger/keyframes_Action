import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Check if it's a rate limit error
      const isRateLimit = this.state.error?.message?.includes('rate limit') || 
                         this.state.error?.message?.includes('Too many requests');

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              
              <h1 className="text-2xl font-bold">
                {isRateLimit ? 'Rate Limit Exceeded' : 'Oops! Something went wrong'}
              </h1>
              
              <p className="text-muted-foreground">
                {isRateLimit 
                  ? 'You\'ve made too many requests. Please wait a moment and try again.'
                  : 'We encountered an unexpected error. Please refresh the page to continue.'}
              </p>

              {isRateLimit && (
                <div className="bg-muted p-4 rounded-lg text-sm text-left w-full">
                  <p className="font-medium mb-2">Quick fixes:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Wait 30 seconds and refresh</li>
                    <li>Clear browser cache (Ctrl+Shift+Delete)</li>
                    <li>Try incognito/private mode</li>
                  </ul>
                </div>
              )}

              <Button onClick={this.handleReset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}