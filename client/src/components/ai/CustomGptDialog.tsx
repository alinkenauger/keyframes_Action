import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CustomGptAssistant, 
  CustomGptExample, 
  DEFAULT_SYSTEM_PROMPTS, 
  INITIAL_EXAMPLES, 
  INITIAL_RULES, 
  useCustomGptAssistants 
} from '@/lib/custom-gpt';
import { FRAME_CATEGORIES, CONTENT_SUBCATEGORIES } from '@/lib/frameLibrary';
import { nanoid } from 'nanoid';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Trash, PlusCircle, Save, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomGptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultUnitType?: string;
  assistantId?: string; // If provided, we're editing an existing assistant
}

export default function CustomGptDialog({ 
  open, 
  onOpenChange, 
  defaultUnitType,
  assistantId 
}: CustomGptDialogProps) {
  const { toast } = useToast();
  const { 
    assistants, 
    addAssistant, 
    updateAssistant, 
    deleteAssistant, 
    getAssistant,
    initializeDefaultAssistants 
  } = useCustomGptAssistants();

  // Initialize default assistants if none exist
  useEffect(() => {
    initializeDefaultAssistants();
  }, []);

  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CustomGptAssistant>>({
    name: '',
    description: '',
    unitType: defaultUnitType || FRAME_CATEGORIES.HOOK,
    subType: '',
    systemPrompt: '',
    examples: [],
    rules: [],
  });

  // Load assistant data if we're editing
  useEffect(() => {
    if (assistantId) {
      const assistant = getAssistant(assistantId);
      if (assistant) {
        setFormData(assistant);
        setIsEditing(true);
      }
    } else {
      // New assistant, prefill with defaults for the selected unit type
      setIsEditing(false);
      setFormData({
        name: '',
        description: '',
        unitType: defaultUnitType || FRAME_CATEGORIES.HOOK,
        subType: '',
        systemPrompt: DEFAULT_SYSTEM_PROMPTS[defaultUnitType || FRAME_CATEGORIES.HOOK] || '',
        examples: [],
        rules: [],
      });
    }
  }, [assistantId, defaultUnitType, open]);

  // Update system prompt when unit type changes
  useEffect(() => {
    if (!isEditing && formData.unitType) {
      setFormData(prev => ({
        ...prev,
        systemPrompt: DEFAULT_SYSTEM_PROMPTS[formData.unitType as keyof typeof DEFAULT_SYSTEM_PROMPTS] || prev.systemPrompt,
      }));
    }
  }, [formData.unitType, isEditing]);

  const handleChange = (field: keyof CustomGptAssistant, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add a new example
  const addExample = () => {
    const newExample: CustomGptExample = {
      id: nanoid(),
      input: '',
      output: ''
    };

    setFormData(prev => ({
      ...prev,
      examples: [...(prev.examples || []), newExample]
    }));
  };

  // Update an example
  const updateExample = (id: string, field: keyof CustomGptExample, value: string) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples?.map(example => 
        example.id === id ? { ...example, [field]: value } : example
      )
    }));
  };

  // Delete an example
  const deleteExample = (id: string) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples?.filter(example => example.id !== id)
    }));
  };

  // Add a new rule
  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...(prev.rules || []), '']
    }));
  };

  // Update a rule
  const updateRule = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules?.map((rule, i) => i === index ? value : rule)
    }));
  };

  // Delete a rule
  const deleteRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules?.filter((_, i) => i !== index)
    }));
  };

  // Load defaults for the current unit type
  const loadDefaults = () => {
    // Fix: Ensure we have a valid unitType value before using it as an index
    // TypeScript fix: Cast unitType to a valid key of the DEFAULT_SYSTEM_PROMPTS type
    const unitType = formData.unitType || FRAME_CATEGORIES.HOOK;
    const unitTypeKey = unitType as keyof typeof DEFAULT_SYSTEM_PROMPTS;

    setFormData(prev => ({
      ...prev,
      systemPrompt: DEFAULT_SYSTEM_PROMPTS[unitTypeKey] || prev.systemPrompt,
      examples: [...(INITIAL_EXAMPLES[unitTypeKey] || [])],
      rules: [...(INITIAL_RULES[unitTypeKey] || [])]
    }));

    toast({
      title: "Defaults Loaded",
      description: `Default settings for ${unitType} have been loaded.`,
    });
  };

  // Save the assistant
  const handleSave = () => {
    if (!formData.name || !formData.unitType || !formData.systemPrompt) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && assistantId) {
        updateAssistant(assistantId, formData as Omit<CustomGptAssistant, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: "Assistant Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        addAssistant(formData as Omit<CustomGptAssistant, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: "Assistant Created",
          description: `${formData.name} has been created successfully.`,
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the assistant. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete the assistant
  const handleDelete = () => {
    if (isEditing && assistantId) {
      deleteAssistant(assistantId);
      toast({
        title: "Assistant Deleted",
        description: `${formData.name} has been deleted.`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Edit Assistant: ${formData.name}` : 'Create Custom GPT Assistant'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modify your AI assistant's settings, examples, and rules to improve its performance."
              : "Design a specialized AI assistant to help with creating specific units for your content."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="details" className="mt-0 p-1">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Assistant Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g., Expert Hook Writer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unitType">Unit Type *</Label>
                    <Select 
                      value={formData.unitType} 
                      onValueChange={(value) => handleChange('unitType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(FRAME_CATEGORIES).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.unitType === FRAME_CATEGORIES.CONTENT && (
                  <div className="space-y-2">
                    <Label htmlFor="subType">Content Subtype (Optional)</Label>
                    <Select 
                      value={formData.subType || ''} 
                      onValueChange={(value) => handleChange('subType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content subtype" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CONTENT_SUBCATEGORIES).map((subcat) => (
                          <SelectItem key={subcat} value={subcat}>
                            {subcat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="What this AI assistant specializes in..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="systemPrompt">System Prompt *</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={loadDefaults}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Load Defaults
                    </Button>
                  </div>
                  <Textarea
                    id="systemPrompt"
                    value={formData.systemPrompt}
                    onChange={(e) => handleChange('systemPrompt', e.target.value)}
                    placeholder="Instructions for the AI assistant..."
                    rows={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    This sets the personality and capabilities of your assistant. Be specific about tone, style, and expertise.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="mt-0 p-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Example Inputs & Outputs</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={addExample}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Example
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Examples help train your assistant by showing it input-output pairs. Add scenarios and the ideal responses.
                </p>

                {formData.examples?.length === 0 && (
                  <div className="text-center p-8 border rounded-md bg-muted">
                    <p>No examples added yet. Add examples to improve your assistant's performance.</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={loadDefaults}
                      className="mt-4"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Load Default Examples
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  {formData.examples?.map((example) => (
                    <Card key={example.id} className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => deleteExample(example.id)}
                      >
                        <Trash className="h-4 w-4 text-muted-foreground" />
                      </Button>

                      <CardHeader>
                        <CardTitle className="text-base">Example Scenario</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Input (Request/Context)</Label>
                          <Textarea 
                            value={example.input}
                            onChange={(e) => updateExample(example.id, 'input', e.target.value)}
                            placeholder="What the user might ask or the scenario..."
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Output (Ideal Response)</Label>
                          <Textarea 
                            value={example.output}
                            onChange={(e) => updateExample(example.id, 'output', e.target.value)}
                            placeholder="How the assistant should respond..."
                            rows={6}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rules" className="mt-0 p-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Rules & Guidelines</h3>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={loadDefaults}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Load Default Rules
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={addRule}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Rules help constrain your assistant's behavior and ensure consistent, high-quality outputs.
                </p>

                {formData.rules?.length === 0 && (
                  <div className="text-center p-8 border rounded-md bg-muted">
                    <p>No rules added yet. Rules help guide your assistant's outputs.</p>
                  </div>
                )}

                <div className="space-y-2">
                  {formData.rules?.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={rule}
                        onChange={(e) => updateRule(index, e.target.value)}
                        placeholder="e.g., Always use concrete examples"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRule(index)}
                      >
                        <Trash className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="pt-4">
          {isEditing && (
            <Button variant="destructive" onClick={handleDelete} className="mr-auto">
              Delete Assistant
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update' : 'Create'} Assistant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}