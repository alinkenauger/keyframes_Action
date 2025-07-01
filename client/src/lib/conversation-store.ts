import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Conversation, Message, AgentType } from '@/types/agent';
import { apiClient } from './api-client';

interface ConversationStore {
  conversations: Record<string, Conversation>;
  messages: Record<string, Message[]>;
  
  // Conversation management
  createConversation: (id: string, agentType: AgentType, context?: any) => void;
  getConversation: (id: string) => Conversation | undefined;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  
  // Message management
  addMessage: (conversationId: string, message: Omit<Message, 'id'>) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  clearMessages: (conversationId: string) => void;
  
  // API interaction
  sendMessage: (conversationId: string, content: string) => Promise<Message>;
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      conversations: {},
      messages: {},
      
      createConversation: (id, agentType, context) => {
        set((state) => ({
          conversations: {
            ...state.conversations,
            [id]: {
              id,
              agentType,
              context,
              createdAt: new Date(),
              updatedAt: new Date(),
              metadata: {}
            }
          },
          messages: {
            ...state.messages,
            [id]: []
          }
        }));
      },
      
      getConversation: (id) => {
        return get().conversations[id];
      },
      
      updateConversation: (id, updates) => {
        set((state) => ({
          conversations: {
            ...state.conversations,
            [id]: {
              ...state.conversations[id],
              ...updates,
              updatedAt: new Date()
            }
          }
        }));
      },
      
      deleteConversation: (id) => {
        set((state) => {
          const { [id]: _, ...conversations } = state.conversations;
          const { [id]: __, ...messages } = state.messages;
          return { conversations, messages };
        });
      },
      
      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: nanoid()
        };
        
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: [...(state.messages[conversationId] || []), newMessage]
          }
        }));
      },
      
      updateMessage: (conversationId, messageId, updates) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: state.messages[conversationId].map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            )
          }
        }));
      },
      
      deleteMessage: (conversationId, messageId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: state.messages[conversationId].filter(
              (msg) => msg.id !== messageId
            )
          }
        }));
      },
      
      clearMessages: (conversationId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: []
          }
        }));
      },
      
      sendMessage: async (conversationId, content) => {
        const conversation = get().conversations[conversationId];
        if (!conversation) {
          throw new Error('Conversation not found');
        }
        
        try {
          const response = await apiClient.post('/agent/conversation', {
            conversationId,
            message: content,
            agentType: conversation.agentType,
            context: conversation.context,
            history: get().messages[conversationId] || []
          });
          
          if (response.error) {
            throw new Error(response.error);
          }
          
          const data = response.data;
          
          return {
            id: nanoid(),
            role: 'agent',
            content: data.content,
            metadata: data.metadata,
            timestamp: new Date()
          };
        } catch (error) {
          console.error('Error sending message:', error);
          throw error;
        }
      }
    }),
    {
      name: 'conversation-store',
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages
      })
    }
  )
);