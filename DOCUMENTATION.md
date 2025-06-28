# Get More Views - Technical Documentation

## Project Overview

This application is an AI-powered content structuring platform designed to help video creators plan and organize their content using a structured "skeleton" approach with customizable frames.

## System Architecture

The application follows a client-server architecture:

1. **Frontend**: React with TypeScript, running on Vite
2. **Backend**: Express.js server for API endpoints
3. **Database**: PostgreSQL with Drizzle ORM

## Key Components

### Frontend

The frontend is organized into the following key components:

#### Core Components

- **Workspace**: Main editing environment where users build their content skeletons
- **SkeletonUnit**: Container for frames belonging to a specific unit type (Hook, Intro, etc.)
- **Frame**: Individual content component representing a specific content technique

#### State Management

We use Zustand for state management with the following key stores:

- **WorkspaceStore**: Manages skeleton data, frames, and user interactions
- **CustomGptStore**: Manages custom AI assistants configuration

#### AI Integration

- **agent-service.ts**: Handles OpenAI Agent 2.0 API interactions
- **ai-service.ts**: Provides functions for content generation and adaptation
- **custom-gpt.ts**: Manages custom AI assistant definitions and templates

### Backend

The backend provides the following functionality:

- **Authentication**: User session management
- **Database Access**: CRUD operations for user data
- **API Proxying**: Secure handling of OpenAI API requests

## Data Models

### Skeleton

```typescript
interface Skeleton {
  id: string;
  name: string;
  frames: Frame[];
  tone?: string;
  filter?: string;
  units?: string[]; // Ordered list of unit types
}
```

### Frame

```typescript
interface Frame {
  id: string;
  name?: string;       // Frame type name
  type: string;        // Frame type identifier
  content: string;     // User-edited content
  tone?: string;       // Content tone (casual, formal, etc.)
  filter?: string;     // Content style filter
  unitType?: string;   // Which unit this frame belongs to
  script?: string;     // AI-generated script content
}
```

### CustomGptAssistant

```typescript
interface CustomGptAssistant {
  id: string;
  name: string;
  description: string;
  unitType: string;     // Which unit type this assistant is for
  subType?: string;     // Optional subtype specification
  systemPrompt: string; // System instructions for the AI
  examples: CustomGptExample[];
  rules: string[];      // Guidelines for the assistant
  createdAt: string;
  updatedAt: string;
}
```

## Key Features

### Drag and Drop Content Organization

The application uses DnD-kit to provide a flexible drag and drop interface for:
- Adding frames to units
- Reordering frames within units
- Reordering units within a skeleton

### AI Content Generation

Content generation is handled through:
1. **Standard API**: Basic OpenAI integration
2. **Agent 2.0**: Enhanced capabilities with assistants API
3. **Custom Assistants**: User-defined specialized AI assistants

### Responsive Design

The application provides optimized experiences for:
- Desktop: Full-featured workspace with horizontal unit layout
- Mobile: Simplified interface with accordion-based unit navigation

## Development Guidelines

### Adding New Frame Types

1. Add the frame definition to `frameLibrary.ts`
2. Define constraints in `UNIT_CONSTRAINTS` in `ai-service.ts`
3. Create appropriate prompts in `FRAME_TYPE_PROMPTS`

### Extending AI Capabilities

1. Update the relevant functions in `agent-service.ts` or `ai-service.ts`
2. Add new tool definitions if needed
3. Update the system prompts in `custom-gpt.ts`

## Deployment

The application is designed to be deployed on Replit, but can be adapted for other hosting platforms.

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for content generation
- `DATABASE_URL`: PostgreSQL connection string (if using external database)

## Future Enhancements

- Content export to various formats
- Team collaboration features
- Integration with video editing tools
- Analytics on content performance