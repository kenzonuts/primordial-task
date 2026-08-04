# Primordial Task AI Workspace Specification

Version: 1.0  
Phase: 11  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), All previous Phase Specs (02-10)

---

## 1. Product Intent

The AI Workspace is the intelligent operating layer of Primordial Task. It is not a standalone chatbot but a pervasive, context-aware companion that understands the entirety of the user's workflow. It synthesizes data from projects, tasks, calendar, documentation, Git, databases, and analytics to provide proactive assistance, automate routine labor, and offer strategic insights.

---

## 2. Core Objectives

- **Understand**: Deep semantic comprehension of the entire workspace context.
- **Plan**: Assist in sprint planning, task breakdown, and roadmap generation.
- **Automate**: Execute repetitive actions across modules via natural language.
- **Predict**: Detect risks, deadline slippage, and team burnout before they occur.
- **Optimize**: Recommend better ways to organize work and allocate resources.
- **Summarize**: Distill complex activity feeds, long documents, and meeting transcripts.

---

## 3. Design Philosophy

- **Calm & Helpful**: The AI should be available when needed but invisible when not.
- **Context-Aware**: It knows what you are looking at, what you just did, and what you are likely to do next.
- **Explainable**: Recommendations must include the "Why" (e.g., "I suggest moving this deadline because Task A is blocked by Task B").
- **Reliable**: High accuracy, low hallucination, and clear boundaries of capability.
- **Privacy-First**: User data is isolated and never used for training external models without explicit consent.

---

## 4. Design Language

Follows **Phase 01 Design System**:
- **Theme**: Dark Mode.
- **Palette**: Monochrome (`gray.0` to `gray.950`).
- **Typography**: Inter (UI), JetBrains Mono (Technical/AI output).
- **Aesthetic**: Minimalist, premium spacing, soft shadows, and rounded components.
- **AI Signature**: A subtle, non-colorful shimmer or "pulsing" border state (`info.bg` or `state.hover`) to indicate AI activity.

---

## 5. User Flow

```text
Workspace Launch
  ↓
AI Contextual Initialization (Loading RAG embeddings)
  ↓
AI Workspace Home (Daily Summary & Recommendations)
  ↓
Context Switch (User navigates to a Project/Task)
  ↓
AI Context Panel Updates (Live context sensing)
  ↓
Natural Language Interaction (Command Center or Conversation)
  ↓
AI Action Execution (Module updates, document generation)
  ↓
Feedback Loop (User confirms/refines output)
```

**Transitions**:
- **Ambient to Active**: AI suggestions appear in the background; user clicking a suggestion expands the AI Context Panel.
- **Command to Execution**: Typing `/` or `Cmd+J` opens the Command Center; executing a command shows an "Optimistic UI" update in the target module.

---

## 6. Required Screens

### 6.1 AI Workspace Home

- **Purpose**: The starting point for the user's day, powered by intelligent synthesis.
- **Display**:
  - **Daily Summary**: A high-level brief of what happened since the last login.
  - **Today's Priorities**: AI-selected tasks based on deadlines, importance, and workload.
  - **Workspace Health**: Real-time KPI summary (from Phase 10).
  - **Project Risks**: Flagged items requiring immediate attention.
  - **Pending AI Actions**: "I've drafted 3 commit messages for your recent changes. Review?"
  - **Recent Conversations & AI Docs**: Quick access to persistent AI work.
- **Interactions**: Click cards to jump to modules; "Accept All" for routine AI suggestions.
- **Developer Notes**: Requires pre-computation of summaries on workspace load.

### 6.2 AI Context Panel

- **Purpose**: A persistent or toggleable side-drawer that shows the AI's current "understanding".
- **Display**:
  - **Active Context**: Current Workspace, Project, Task, and Document.
  - **Technical Context**: Active Git branch, DB table being viewed, or API endpoint.
  - **Suggested Context**: "Related tasks you might need" or "Documentation for this module".
- **Context Hierarchy**: Workspace > Project > Module > Current Item > Selected Text.
- **UX Reasoning**: Reduces the need for the user to "explain" what they are working on to the AI.

### 6.3 AI Command Center

- **Purpose**: A high-speed, command-line-like interface for executing actions.
- **Support**:
  - **Natural Language**: "Move all my blocked tasks to the next sprint."
  - **Slash Commands**: `/task`, `/note`, `/summary`, `/git`.
  - **Quick Actions**: Pinned commands like "Draft Release Notes".
- **Interactions**: `Cmd+J` (Global Toggle); `Tab` for autocomplete; `Enter` to execute.
- **Accessibility**: Full keyboard navigation; focus restoration.

### 6.4 AI Conversations

- **Purpose**: Deep, multi-turn dialogue for complex problem-solving.
- **Display**:
  - **History**: Searchable list of past threads.
  - **Context Memory**: Toggle which modules the AI should "remember" for this chat.
  - **Referenced Items**: Rich previews of tasks, docs, or code snippets mentioned.
- **Behavior**: Streaming responses; Markdown support; code blocks with "Apply to File" actions.
- **AI Engineering Notes**: Use persistent thread IDs mapped to Workspace/Project.

### 6.5 AI Prompt Library

- **Purpose**: A curated repository of high-value prompts to maximize AI utility.
- **Categories**: Task Management, Planning, Git/Code, SQL, API, Technical Writing.
- **Organization**: Searchable grid; "Favorite" prompts; "Shared" workspace-level prompts.
- **Interactions**: One-click "Run" or "Edit" for any prompt template.

---

## 7. AI Capabilities

- **Summarization**: Workspace, Project, Task, Meeting, and Documentation briefs.
- **Planning**: Auto-generate sprint backlogs and task breakdowns from high-level goals.
- **Technical**:
  - **Git**: Generate commit messages, PR descriptions, and code reviews.
  - **Database**: Generate SQL queries from natural language; explain schemas.
  - **API**: Generate documentation and request bodies.
- **Productivity**: Deadline prediction, risk detection, and bottleneck analysis.
- **Documentation**: Generate technical specs, ADRs, and release notes from task activity.

---

## 8. AI Automation

- **Daily/Weekly Pulse**: Automated summaries sent to Slack/Email or Home Dashboard.
- **Risk Sentinel**: Background monitor for deadline slippage and dependency loops.
- **Burnout Watch**: Detects excessive context switching or workload spikes.
- **Automation Rules**: "When a task is blocked for >24h, summarize the blocker and notify the Project Owner."

---

## 9. AI Memory

- **Conversation Memory**: Short-term context within a thread.
- **Project/Workspace Memory**: Long-term understanding of goals, terminology, and team patterns.
- **User Preference Memory**: Learning how the user prefers to write, organize, and prioritize.
- **Retention Rules**: Conversations pruned after 90 days unless pinned; Workspace memory is permanent.
- **Privacy**: No PII (Personally Identifiable Information) stored in vector indices.

---

## 10. AI Recommendation Engine

- **Logic**: Weighted scoring based on:
  - **Recency**: Last touched items.
  - **Urgency**: Deadlines and status.
  - **Relationship**: Tasks linked to the current project/document.
  - **Historical Velocity**: Previous completion patterns.
- **Outputs**: "Recommended next task", "Related documentation", "Missing dependencies".

---

## 11. Search Experience (Semantic Search)

- **Capabilities**: Finds information by meaning, not just keywords.
- **Scope**: Tasks, Projects, Notes, Calendar, Documentation, Git, Database, Snippets, and AI Conversations.
- **UX**: Search results grouped by module; AI-generated "Direct Answer" at the top.

---

## 12. Model Management

- **Providers**: OpenAI, Anthropic, Google (Gemini), Local (Llama/Ollama).
- **Selection**: Auto-routing based on task complexity (e.g., GPT-4o for code, Gemini for long-context summary).
- **Tracking**: Token usage, cost per workspace, and rate limit management.
- **Fallback**: Graceful downgrade to faster/cheaper models if primary fails.

---

## 13. Knowledge Sources (RAG Hierarchy)

1. **Current Active Item** (highest priority).
2. **Linked Dependencies** (referenced tasks/docs).
3. **Project Context** (all items in the active project).
4. **Workspace Context** (global docs, team activity).
5. **External Integrations** (Git history, DB Schema).

---

## 14. Security & Privacy

- **Isolation**: Vector embeddings are strictly partitioned by Workspace ID.
- **Prompt Protection**: Prevention of prompt injection and leakage of system instructions.
- **Sensitive Data**: Automatic detection and masking of API keys, secrets, and credentials before sending to LLMs.
- **Audit Trail**: Logging of all AI actions (who triggered what, when, and what was the cost).

---

## 15. Technical Requirements

### 15.1 Database Relationships
- **AIConversation**: `id`, `workspace_id`, `author_id`, `project_id`, `thread_id`, `metadata`.
- **AIInteraction**: `id`, `conversation_id`, `prompt`, `response`, `tokens`, `model_id`.
- **AIPrompt**: `id`, `workspace_id`, `category`, `template`, `is_favorite`.
- **VectorIndex**: References to `Tasks`, `Documents`, `Notes` for semantic retrieval.

### 15.2 API Requirements
- `POST /ai/chat/stream`: Server-Sent Events (SSE) for real-time response.
- `GET /ai/context`: Fetch current semantic context for the UI.
- `POST /ai/command`: Natural language to action execution.
- `GET /ai/usage`: Token and cost statistics.

### 15.3 State Management
- **Streaming State**: Manage chunks of incoming text and UI typing effect.
- **Context State**: Track the "Focus" item across all modules to update the AI's world-view.
- **Optimistic Updates**: Show "AI is thinking..." and "Action applied" states immediately.

---

## 16. Business Rules

- **Context Resolution**: The AI must always cite the source of its information (e.g., "According to [Task #123]...").
- **Action Confirmation**: Destructive actions (Delete Project, Archive Workspace) always require manual confirmation.
- **Permission Check**: AI cannot access or summarize content the user doesn't have permissions to see.

---

## 17. Engineering Notes

- **AI Engineering**: Use Vector DB (Pinecone/Weaviate) for RAG; implement hybrid search (keyword + semantic).
- **Prompt Engineering**: Use Few-Shot prompting for specialized modules (Git, SQL); maintain a versioned Prompt Registry.
- **Frontend**: Implement high-performance Markdown rendering; use "Skeleton" loaders for AI summaries.
- **Backend**: Implement robust rate-limiting and job queuing for background AI tasks (e.g., Daily Summary).
- **QA**: Evaluate AI responses for bias, hallucination, and relevance using an "Evals" framework (e.g., RAGAS).

---

## 18. Quality Bar

The AI Workspace is complete when it feels like a high-performing teammate who knows everything about the workspace, never sleeps, and makes every user 10x more productive through seamless, context-aware assistance.
