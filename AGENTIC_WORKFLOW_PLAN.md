# Agentic Workflow Implementation Plan

## Overview
Transform the Keyframes system from a form-based content generation tool to an intelligent, conversational partner that guides users through content creation with specialized agents for each aspect of video production.

## Core Components

### 1. Main Content Creation Agent (Partner Agent)
**Purpose**: Primary AI partner that learns about the channel, content goals, and guides the overall workflow

**Key Features**:
- **Channel Onboarding**: Learn and store information about:
  - Channel/business details
  - Content type preferences
  - Example channels/videos for inspiration
  - Target audience persona
  - Channel goals and value proposition
  - Trending topics and focus areas
- **Personality**: Friendly, entertaining, knowledgeable partner
- **Memory**: Persistent storage of user preferences and context
- **Workflow Orchestration**: Guides user through the entire content creation process

**Implementation**:
```typescript
interface PartnerAgent {
  id: string;
  userId: string;
  channelProfile: ChannelProfile;
  conversationHistory: Message[];
  workflowState: WorkflowState;
  personality: PersonalityTraits;
}

interface ChannelProfile {
  name: string;
  niche: string;
  contentTypes: string[];
  targetAudience: AudiencePersona;
  inspirations: Inspiration[];
  goals: string[];
  focusAreas: string[];
}
```

### 2. Unit-Specific Expert GPTs
**Purpose**: Specialized agents for each unit type with deep expertise

**Planned Agents**:
- **Hook/Rehook & Intro Expert**: Masters of attention-grabbing openings
- **How-To Content Expert**: Instructional and educational content specialist
- **Entertainment Expert**: Engagement and storytelling specialist
- **Journey Expert**: Content flow and narrative progression
- **CTA Expert**: Conversion and action-driving specialist

**Features**:
- Unit-specific knowledge and constraints
- Access to main agent's channel context
- Ability to ensure smooth transitions between frames
- Prompt optimization for their specific domain

### 3. Chat Interface System
**Purpose**: Replace forms with conversational UI for natural interaction

**Components**:
- **ChatWindow**: Main conversation display
- **MessageBubble**: Individual message rendering
- **InputArea**: User input with suggestions
- **AgentTypingIndicator**: Show when agent is thinking
- **ActionCards**: Display agent actions (frame updates, suggestions)

**Layout**:
```
+------------------------+
| Agent Name & Status    |
+------------------------+
| Message History        |
| - Agent messages       |
| - User messages        |
| - Action cards         |
|                        |
| [Typing indicator...]  |
+------------------------+
| Input area            |
| [Send] [Suggestions]  |
+------------------------+
```

### 4. Workflow Integration

#### Phase 1: Channel Setup & Learning
1. Partner agent introduces itself
2. Conversational onboarding to learn about channel
3. Analysis of example content/channels
4. Build channel profile and preferences

#### Phase 2: Content Planning
1. User creates/selects skeleton structure
2. Partner agent explains the workflow
3. User drops frames into units
4. Agent suggests optimal frame types based on content goals

#### Phase 3: Frame Content Generation
1. Click frame to open chat interface
2. Unit-specific expert agent takes over
3. Contextual questions based on:
   - Frame type and position
   - Previous frame content
   - Overall video goal
   - Selected tone/filter
4. Agent generates content with:
   - Detailed breakdown
   - Script premise
   - Scene ideas
   - Transition planning

#### Phase 4: Prompt Aggregation
1. As frames complete, agent builds master prompt
2. Each frame contributes optimized prompt segment
3. Agent tracks content flow and consistency

#### Phase 5: Script Generation
1. Partner agent reviews all frame content
2. Identifies gaps or opportunities
3. Passes aggregated prompts to Script Writer GPT
4. Generates complete, formatted script

#### Phase 6: Post-Production Support
1. Editable script interface
2. B-roll list generation
3. Editor style guide creation
4. Teleprompter-ready markdown export

## Technical Architecture

### Frontend Components
```
/components/agent/
  ├── PartnerAgent.tsx          # Main agent interface
  ├── ChatInterface.tsx         # Conversation UI
  ├── AgentSelector.tsx         # Choose unit expert
  ├── ChannelProfileEditor.tsx  # Channel setup UI
  └── ScriptEditor.tsx          # Final script editing

/lib/
  ├── agent-orchestrator.ts     # Workflow management
  ├── conversation-store.ts     # Chat history storage
  ├── prompt-aggregator.ts      # Prompt building logic
  └── agent-personalities.ts    # Agent configurations
```

### Backend Endpoints
```
POST /api/agent/conversation     # Handle chat messages
POST /api/agent/channel-profile  # Store channel info
GET  /api/agent/workflow-state   # Current workflow status
POST /api/agent/generate-script  # Final script generation
POST /api/agent/frame-content    # Frame-specific generation
```

### Data Models
```typescript
interface Conversation {
  id: string;
  userId: string;
  agentId: string;
  messages: Message[];
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata?: {
    frameId?: string;
    unitType?: string;
    actionType?: string;
    suggestions?: string[];
  };
  timestamp: Date;
}

interface WorkflowState {
  currentPhase: 'setup' | 'planning' | 'content' | 'review' | 'final';
  currentUnit: string;
  currentFrame: string;
  completedFrames: string[];
  aggregatedPrompts: PromptSegment[];
}
```

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Create chat interface components
- [ ] Implement conversation storage
- [ ] Build partner agent personality
- [ ] Set up workflow state management

### Phase 2: Agent System (Week 3-4)
- [ ] Implement channel profile learning
- [ ] Create unit-specific expert agents
- [ ] Build agent switching logic
- [ ] Implement context passing between agents

### Phase 3: Content Generation (Week 5-6)
- [ ] Frame-level chat interactions
- [ ] Prompt aggregation system
- [ ] Script generation pipeline
- [ ] Content review and gap analysis

### Phase 4: Polish & Enhancement (Week 7-8)
- [ ] Script editor interface
- [ ] Export formats (B-roll, markdown)
- [ ] Agent personality refinement
- [ ] Performance optimization

## User Experience Flow

1. **First Visit**: Partner agent welcomes user, starts channel profile setup
2. **Skeleton Creation**: Agent suggests structure based on content type
3. **Frame Dropping**: Visual cues show which expert will handle each unit
4. **Content Creation**: Click frame → Chat opens → Expert guides creation
5. **Progress Tracking**: Visual indicators show completion status
6. **Script Review**: Partner agent presents final script with edit options
7. **Export Options**: Multiple format choices for production needs

## Success Metrics
- Time to complete script: Target 50% reduction
- User engagement: >10 messages per session
- Content quality: User satisfaction >4.5/5
- Completion rate: >80% of started projects

## Future Enhancements
- Voice interaction capability
- Multi-language support
- Team collaboration features
- Integration with video editing tools
- Performance analytics dashboard