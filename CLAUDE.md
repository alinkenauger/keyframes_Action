# Claude Code Working Rules

## Workflow Process

### 1. Problem Analysis
First think through the problem, read the codebase for relevant files, and write a plan to todo.md.

### 2. Create Todo List
The plan should have a list of todo items that you can check off as you complete them.

### 3. Plan Verification
Before you begin working, check in with me and I will verify the plan.

### 4. Execute Tasks
Then, begin working on the todo items, marking them as complete as you go.

### 5. High-Level Updates
Please every step of the way just give me a high level explanation of what changes you made.

### 6. Simplicity First
Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.

### 7. Review & Summary
Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

## Key Principles

- **Small, incremental changes**: Break down complex tasks into simple steps
- **Minimal code impact**: Each change should affect the smallest possible code surface
- **Clear communication**: Provide concise explanations at each step
- **Verification checkpoints**: Always confirm the plan before implementation
- **Documentation**: Keep todo.md updated with progress and reviews
- **Use Sub-Agents When Beneficial**: If Claude determines that using sub-agents would be beneficial or necessary for a task, spin up as many sub-agents as needed to move the task along quickly and at the highest quality possible. This is especially useful for:
  - Large-scale searches across the codebase
  - Parallel implementation of independent features
  - Comprehensive testing and validation
  - Multi-file refactoring operations
  - Security audits and vulnerability scanning