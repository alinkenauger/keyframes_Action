import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader,
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FRAME_CATEGORIES } from '@/lib/frameLibrary';
import { CustomGptAssistant, useCustomGptAssistants } from '@/lib/custom-gpt';
import { Edit, PlusCircle, Brain, Settings, Award } from 'lucide-react';
import CustomGptDialog from './CustomGptDialog';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function CustomGptManager() {
  const { assistants, initializeDefaultAssistants, getAssistantsByUnitType } = useCustomGptAssistants();
  const [activeCategory, setActiveCategory] = useState<string>(FRAME_CATEGORIES.HOOK);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<string | null>(null);

  // Initialize default assistants if none exist
  useEffect(() => {
    initializeDefaultAssistants();
  }, []);

  // Open dialog to edit an assistant
  const handleEditAssistant = (id: string) => {
    setEditingAssistant(id);
    setShowCreateDialog(true);
  };

  // Create a new assistant
  const handleCreateAssistant = () => {
    setEditingAssistant(null);
    setShowCreateDialog(true);
  };

  // Filter assistants by the active category
  const filteredAssistants = getAssistantsByUnitType(activeCategory);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold flex items-center">
          <Brain className="h-6 w-6 mr-2" />
          Custom GPT Assistants
        </h2>
        <Button
          onClick={handleCreateAssistant}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Assistant
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">
        Create specialized AI assistants to help with different parts of your video content.
        Each assistant can be trained with examples, rules, and specific instructions.
      </p>

      <Tabs
        defaultValue={FRAME_CATEGORIES.HOOK}
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mb-4">
          {Object.values(FRAME_CATEGORIES).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category} Assistants
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {filteredAssistants.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6 border rounded-lg bg-muted">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No {activeCategory} Assistants</h3>
                <p className="text-muted-foreground max-w-md mb-4">
                  Create custom GPT assistants specialized for {activeCategory.toLowerCase()} content to enhance your video creation workflow.
                </p>
                <Button onClick={handleCreateAssistant}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create {activeCategory} Assistant
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {filteredAssistants.map((assistant) => (
                  <Card key={assistant.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-primary" />
                          {assistant.name}
                        </CardTitle>
                        <Badge variant="secondary" className="font-normal">
                          {assistant.unitType}
                          {assistant.subType && ` / ${assistant.subType}`}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {assistant.description || "A custom AI assistant for video content"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">System Prompt</p>
                          <p className="text-sm line-clamp-3">{assistant.systemPrompt}</p>
                        </div>
                        
                        <div className="flex space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <span className="font-medium mr-1">{assistant.examples?.length || 0}</span> examples
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">{assistant.rules?.length || 0}</span> rules
                          </div>
                          <div className="flex-1 text-right">
                            Updated {formatDate(assistant.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => handleEditAssistant(assistant.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Configure Assistant
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </Tabs>

      <CustomGptDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        defaultUnitType={activeCategory}
        assistantId={editingAssistant || undefined}
      />
    </div>
  );
}
