# API Migration Plan - Ensuring 100% Functionality

## Overview
This plan ensures all AI functionality continues to work perfectly after moving OpenAI API calls to the backend.

## Current Functions Using OpenAI API

### 1. ai-service.ts
- `adaptFrameContent()` - Adapts content based on tone/filter
- `generateFrameContent()` - Generates new content
- Various helper functions

### 2. script-service.ts
- `generateVideoScript()` - Creates full video scripts

### 3. agent-service.ts
- `generateContentWithAgent()` - AI agent operations
- `adaptContentWithAgent()` - Agent-based adaptations

## Migration Strategy

### Phase 1: Backend Setup ✅
1. Created `/server/routes/ai.ts` with endpoints:
   - POST `/api/ai/adapt-content`
   - POST `/api/ai/generate-script`
   - POST `/api/ai/agent`

### Phase 2: Client Updates (Current)
We'll update each service file carefully to maintain functionality.

### Phase 3: Testing
Test every AI feature to ensure it works exactly as before.

## Detailed Implementation

### Step 1: Update ai-service.ts

```typescript
// Before: Direct OpenAI call
const response = await openai.chat.completions.create({...});

// After: Backend API call
const response = await callAIAPI('adapt-content', {
  content,
  tone,
  filter,
  frameType,
  unitType
});
```

### Step 2: Add Backend Endpoints for Missing Functions

Some functions may need new backend endpoints:
- `generate-content` - For frame content generation
- `custom-gpt` - For custom GPT interactions

### Step 3: Error Handling

Add robust error handling to maintain UX:
```typescript
try {
  const response = await callAIAPI(...);
  return response.adaptedContent;
} catch (error) {
  console.error('AI Service Error:', error);
  // Fallback to original content or show user-friendly error
  throw new Error('Unable to process content. Please try again.');
}
```

### Step 4: Environment Variables

Remove from client:
- `VITE_OPENAI_API_KEY`

Keep on server only:
- `OPENAI_API_KEY`

## Testing Checklist

- [ ] Frame content adaptation (tone/filter)
- [ ] New frame content generation
- [ ] Video script generation
- [ ] AI agent operations
- [ ] Custom GPT features
- [ ] Error handling (API down, rate limits)
- [ ] Loading states remain smooth
- [ ] No API keys exposed in browser

## Rollback Plan

If issues arise:
1. Keep old code commented but available
2. Can temporarily revert while fixing issues
3. Use feature flags to switch between old/new implementation

## Implementation Order

1. Update `adaptFrameContent()` first (most used)
2. Test thoroughly
3. Update remaining functions one by one
4. Remove old OpenAI client code
5. Clean up environment variables