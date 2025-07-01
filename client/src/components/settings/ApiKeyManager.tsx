import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Check, X, Loader2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: number;
  provider: string;
  isActive: boolean;
  lastUsed: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NewApiKey {
  provider: string;
  apiKey: string;
}

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<number | null>(null);
  const [newKey, setNewKey] = useState<NewApiKey>({
    provider: 'openai',
    apiKey: ''
  });
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await apiClient.get('/user/api-keys');
      if (response.data?.apiKeys) {
        setApiKeys(response.data.apiKeys);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: 'Error',
        description: 'Failed to load API keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return `${key.substring(0, 4)}••••${key.substring(key.length - 4)}`;
  };

  const validateApiKey = async () => {
    if (!newKey.apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }

    setValidating(true);
    setValidationResult(null);

    try {
      const response = await apiClient.post('/user/api-keys/validate', {
        provider: newKey.provider,
        apiKey: newKey.apiKey
      });

      setValidationResult({
        valid: response.data.valid,
        message: response.data.message
      });

      if (response.data.valid) {
        toast({
          title: 'Valid API Key',
          description: 'Your API key has been validated successfully',
        });
      } else {
        toast({
          title: 'Invalid API Key',
          description: response.data.message || 'The API key is not valid',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to validate API key',
        variant: 'destructive',
      });
    } finally {
      setValidating(false);
    }
  };

  const saveApiKey = async () => {
    if (!newKey.apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const response = await apiClient.post('/user/api-keys', {
        provider: newKey.provider,
        apiKey: newKey.apiKey
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message || 'API key saved successfully',
        });
        
        // Reset form
        setNewKey({ provider: 'openai', apiKey: '' });
        setShowNewForm(false);
        setValidationResult(null);
        
        // Refresh list
        fetchApiKeys();
      }
    } catch (error: any) {
      console.error('Error saving API key:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to save API key',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleApiKey = async (id: number) => {
    try {
      const response = await apiClient.patch(`/user/api-keys/${id}/toggle`);
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
        });
        fetchApiKeys();
      }
    } catch (error) {
      console.error('Error toggling API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to update API key status',
        variant: 'destructive',
      });
    }
  };

  const deleteApiKey = async () => {
    if (!keyToDelete) return;

    setDeleting(keyToDelete);

    try {
      const response = await apiClient.delete(`/user/api-keys/${keyToDelete}`);
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'API key deleted successfully',
        });
        fetchApiKeys();
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
      setDeleteDialogOpen(false);
      setKeyToDelete(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never used';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai':
        return '🤖';
      case 'anthropic':
        return '🧠';
      default:
        return '🔑';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>
            Manage your API keys for AI services. Your keys are encrypted and stored securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing API Keys */}
          {apiKeys.length > 0 && (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getProviderIcon(apiKey.provider)}</span>
                      <span className="font-medium capitalize">{apiKey.provider}</span>
                      {apiKey.isActive ? (
                        <Badge variant="default" className="text-xs">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last used: {formatDate(apiKey.lastUsed)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={apiKey.isActive}
                      onCheckedChange={() => toggleApiKey(apiKey.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setKeyToDelete(apiKey.id);
                        setDeleteDialogOpen(true);
                      }}
                      disabled={deleting === apiKey.id}
                    >
                      {deleting === apiKey.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Key Form */}
          {showNewForm ? (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select
                  value={newKey.provider}
                  onValueChange={(value) => setNewKey({ ...newKey, provider: value })}
                >
                  <SelectTrigger id="provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic" disabled>
                      Anthropic (Coming Soon)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showKey ? 'text' : 'password'}
                    value={newKey.apiKey}
                    onChange={(e) => {
                      setNewKey({ ...newKey, apiKey: e.target.value });
                      setValidationResult(null);
                    }}
                    placeholder="sk-..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {validationResult && (
                <div className={`flex items-center gap-2 text-sm ${
                  validationResult.valid ? 'text-green-600' : 'text-destructive'
                }`}>
                  {validationResult.valid ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span>{validationResult.message}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={validateApiKey}
                  disabled={validating || !newKey.apiKey}
                >
                  {validating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Validate'
                  )}
                </Button>
                <Button
                  onClick={saveApiKey}
                  disabled={saving || !newKey.apiKey || !validationResult?.valid}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save API Key'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowNewForm(false);
                    setNewKey({ provider: 'openai', apiKey: '' });
                    setValidationResult(null);
                    setShowKey(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowNewForm(true)}
              className="w-full"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add API Key
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteApiKey}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}