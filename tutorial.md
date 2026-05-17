# Building a "Digital Twin" AI Portfolio: A Beginner's Tutorial

Welcome to this beginner-friendly guide! In this tutorial, we will walk through how we built a modern, "Tech Noir Minimalist" professional portfolio equipped with a highly advanced **Digital Twin AI Chatbot**. 

---

## 1. Summary of Technology Used

To build this project, we relied on a stack of modern, industry-standard web technologies:

- **Next.js (App Router)**: The core framework. Next.js is built on top of React. It handles routing (moving between pages), server-side rendering, and API creation. We used the modern "App Router" (`src/app` directory).
- **React**: A JavaScript library for building user interfaces using reusable components.
- **Vanilla CSS**: Instead of using heavy CSS frameworks, we wrote pure CSS (`globals.css`) utilizing modern features like CSS Variables (`--bg-color`) and keyframe animations to achieve our precise architectural design.
- **Vercel AI SDK (`ai`)**: A powerful library that makes it incredibly easy to stream text from AI models directly into a React user interface.
- **OpenAI (`@ai-sdk/openai`)**: The artificial intelligence provider. We used their `gpt-4o-mini` model to power the brain of the Digital Twin.

---

## 2. High-Level Walkthrough

Here is a step-by-step summary of what we accomplished:

1. **Scaffolded the App**: We started by creating a blank Next.js project using `npx create-next-app`. 
2. **Designed the Theme**: We completely erased the default Next.js styles and wrote a bespoke "Tech Noir Minimalist" design system. This involved setting up stark white backgrounds, pure black text, massive negative space, and a striking safety-orange accent color.
3. **Structured the Content**: We took a professional resume and translated it into a semantic React page (`page.tsx`). We broke it down into sections: Hero, About, Experience, and Selected Work.
4. **Generated AI Art**: To elevate the design, we generated abstract, high-contrast monochrome architectural imagery and saved them into the `public/` directory.
5. **Built the API**: We created a secure server endpoint (`api/chat/route.ts`) where our website can securely communicate with OpenAI using our private API key.
6. **Designed the Chat UI**: Finally, we built `ChatWidget.tsx`—a floating, glassmorphic button and chat window that interacts with the API, allowing users to converse with the "Digital Twin."

---

## 3. Detailed Code Review

Let's look at a few of the most important pieces of code we wrote and understand how they work.

### A. The AI Brain: `route.ts`
Located in `src/app/api/chat/route.ts`, this is the backend server code. This code never runs in the user's browser, which keeps our OpenAI API key a secret.

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// 1. We export a POST function to handle incoming HTTP requests
export async function POST(req: Request) {
  // 2. We extract the chat history (messages) sent from the frontend
  const { messages } = await req.json();

  // 3. We call the OpenAI model
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    // 4. The System Prompt: This is the "brain" and "personality" of the AI.
    system: `You are the digital twin of Gian Carlo Yabut... 
    DO NOT end your responses with a question. Just state the facts and stop.`
  });

  // 5. We stream the response back to the browser chunk-by-chunk
  return result.toDataStreamResponse();
}
```
**Why this matters:** By using `streamText`, the user doesn't have to wait 10 seconds for the AI to finish thinking. The text appears on the screen letter-by-letter, exactly like ChatGPT.

### B. The Chat UI: `ChatWidget.tsx`
This React component handles the visual window and the typing interactions.

```tsx
"use client"; // This tells Next.js this code runs in the browser
import { useChat } from "ai/react";

export default function ChatWidget() {
  // 1. The useChat hook automatically handles the complex logic of sending 
  //    messages to our API and managing the streaming text state.
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div>
      {/* 2. We loop through the messages array to display the chat history */}
      {messages.map((m) => (
        <div key={m.id}>
          {m.role === "user" ? "User" : "System"}: {m.content}
        </div>
      ))}

      {/* 3. The input form connects directly to the useChat hook */}
      <form onSubmit={handleSubmit}>
        <input 
          value={input} 
          onChange={handleInputChange} 
          placeholder="Message Digital Twin..." 
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```
**Why this matters:** The `useChat` hook acts as magic glue. It tracks what the user is typing (`input`), sends it to the API when `handleSubmit` is called, and instantly updates the `messages` array as the AI responds.

### C. The CSS Design System
In `globals.css`, we defined our strict color palette using variables. 

```css
:root {
  --bg-color: #fafafa;
  --text-primary: #0a0a0a;
  --accent-orange: #FF3300;
}

/* Glassmorphism effect used in the chat window */
.chat-window {
  backgroundColor: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px); 
}
```
**Why this matters:** `backdrop-filter: blur()` blurs whatever is behind the chat window, giving it that premium, frosted-glass "futuristic" look.

---

## 4. Five Suggestions for Future Improvements (Self-Review)

While the code is highly professional, web development is an ongoing process of iteration. Here are 5 ways an advanced developer could improve this codebase:

1. **API Rate Limiting**: Currently, anyone can spam the Chatbot, which costs money via the OpenAI API. Implementing a rate limiter (e.g., using Redis or Vercel KV) would restrict users to ~20 messages per hour.
2. **Markdown Parsing in Chat**: The AI currently responds with plain text. If the AI wants to use **bolding** or bullet points, it won't format properly. Adding a library like `react-markdown` would allow the chat widget to render rich text.
3. **Mobile Responsiveness for the Chat Widget**: While the main website is responsive, the chat widget is a fixed 400px wide. On very small mobile screens, the chat widget should automatically resize to `100vw` (full width) to prevent horizontal scrolling.
4. **Externalize Content (CMS integration)**: The system prompt inside the API route is currently hardcoded. Moving the resume and skills data to an external Markdown file or a Headless CMS (like Sanity) would make it much easier to update without touching the code.
5. **Accessibility (a11y) Upgrades**: The chat widget currently lacks ARIA labels for screen readers. Furthermore, when the chat modal opens, we should implement "Focus Trapping" so that keyboard users navigating via the `Tab` key don't accidentally navigate the background website while the chat is open.
