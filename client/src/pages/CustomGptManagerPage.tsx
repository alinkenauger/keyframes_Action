import { Helmet } from 'react-helmet';
import CustomGptManager from '@/components/ai/CustomGptManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import { Link } from 'wouter';

export default function CustomGptManagerPage() {
  return (
    <>
      <Helmet>
        <title>AI Assistants | Content Planning Platform</title>
      </Helmet>
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mr-4"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workspace
            </Link>
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            AI Assistant Manager
          </h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <CustomGptManager />
        </div>
      </div>
    </>
  );
}
