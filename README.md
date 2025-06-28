# Get More Views - AI Content Structure Platform

An advanced AI-powered content planning platform that revolutionizes video creation workflows through intelligent, flexible skeleton structuring and dynamic content management.

## Features

- 🧩 **Frame-Based Content Planning**: Organize your video content into modular frames for easy planning and reorganization
- 🤖 **AI-Powered Generation**: Leverage OpenAI's advanced capabilities to generate high-quality content suggestions
- 🧠 **Custom AI Assistants**: Create and manage specialized AI assistants optimized for different content types
- 🔄 **Drag & Drop Interface**: Intuitive content organization with a flexible drag and drop interface
- 📱 **Responsive Design**: Full functionality on both desktop and mobile devices
- 🎬 **Complete Video Structure**: Organize content in specialized units - Hook, Intro, Content, Rehook, and Outro

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand and React Query
- **Drag & Drop**: DnD-Kit
- **AI Integration**: OpenAI API with Agent 2.0 capabilities
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `/client`: Frontend React application
  - `/src/components`: UI components
  - `/src/hooks`: Custom React hooks
  - `/src/lib`: Utility functions and services
  - `/src/pages`: Application pages
  - `/src/types`: TypeScript type definitions
- `/server`: Backend Express application
- `/db`: Database schema and connection

## License

MIT