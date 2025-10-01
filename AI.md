---
name: ww-chat-ai
description: ChatGPT-style AI chat interface with role-based messaging (user/assistant), streaming support, and simplified configuration.
keywords: [chat, ai, assistant, chatgpt, openai, streaming, conversation]
---

#### ww-chat-ai

***Purpose:***
AI-focused chat UI with ChatGPT-style design: transparent assistant messages, user message bubbles, role-based system (user/assistant), and real-time streaming support for OpenAI-style responses.

***Properties:***

**Chat Settings:**
- userLabel: string – Label for user messages. Example: 'You'
- assistantLabel: string – Label for AI assistant messages. Example: 'Assistant'
- disabled: boolean – Disable input/actions. Example: false
- autoScrollBehavior: 'auto'|'smooth' – Scroll mode for new messages. Example: 'auto'

**Chat Data:**
- messages: array – Conversation data with role-based messages. Example: [{ text: 'Hello', role: 'user', timestamp: '2025-01-15T10:30:00Z' }]
- mappingMessageText: Formula – Extract message text. Default: context.mapping?.['text']
- mappingRole: Formula – Extract message role ('user' or 'assistant'). Default: context.mapping?.['role']
- mappingTimestamp: Formula – Extract timestamp. Default: context.mapping?.['timestamp']

**Streaming (OpenAI):**
- isStreaming: boolean – Indicates if AI is currently streaming a response. Example: false
- streamingText: string – Current streaming text from AI (bindable to OpenAI stream). Example: 'The answer is...'

**Style - Messages Area:**
- fontFamily: string – Global font family. Example: 'Inter, sans-serif'
- messagesAreaBgColor: string – Messages area background. Example: '#ffffff'
- messagesAreaPadding: string – Messages area padding. Example: '16px'
- emptyMessageText: string – Text when no messages. Example: 'No messages yet'
- emptyMessageColor: string – Empty state color. Example: '#64748b'

**Style - Assistant Messages (ChatGPT-style):**
- messageBgColor: string – Assistant message background. Example: 'transparent' (default: no bubble)
- messageTextColor: string – Assistant message text. Example: '#334155'
- messageBorder: string – Assistant message border. Example: 'none' (default: no border)
- messageRadius: string – Assistant border radius. Example: '0px'
- messageFontSize: string – Assistant font size. Example: '0.875rem'
- messageFontWeight: string – Assistant font weight. Example: '400'
- messageFontFamily: string – Assistant font family. Example: 'inherit'

**Style - User Messages (Bubble):**
- ownMessageBgColor: string – User message background. Example: '#f4f4f4'
- ownMessageTextColor: string – User message text. Example: '#1e1e1e'
- ownMessageBorder: string – User message border. Example: '1px solid #d0d0d0'
- ownMessageRadius: string – User border radius. Example: '18px'
- ownMessageFontSize: string – User font size. Example: '0.875rem'
- ownMessageFontWeight: string – User font weight. Example: '400'
- ownMessageFontFamily: string – User font family. Example: 'inherit'

**Style - Input Area:**
- inputBgColor: string – Input area container bg. Example: '#ffffff'
- inputAreaBorder: string – Input area top border. Example: '1px solid #e2e8f0'
- textareaBorder: string – Textarea border. Example: '1px solid #e2e8f0'
- textareaBorderHover: string – Textarea hover border. Example: '1px solid #cbd5e1'
- textareaBorderFocus: string – Textarea focus border. Example: '1px solid #3b82f6'
- inputTextColor: string – Textarea text color. Example: '#334155'
- inputFontSize: string – Textarea font size. Example: '0.875rem'
- inputFontWeight: string – Textarea font weight. Example: '400'
- inputFontFamily: string – Textarea font family. Example: 'inherit'
- inputPlaceholderColor: string – Placeholder color. Example: '#94a3b8'
- inputHeight: string – Textarea height. Example: '38px'
- inputBorderRadius: string – Textarea radius. Example: '8px'
- inputPlaceholder: string – Placeholder text. Example: 'Message...'
- inputActionAlign: 'start'|'end' – Vertical alignment of send button. Example: 'end'

**Style - Send Button:**
- sendIcon: string – Send icon name. Example: 'send'
- sendIconColor: string – Send icon color. Example: '#334155'
- sendIconSize: string – Send icon size. Example: '20px'
- sendButtonBgColor: string – Send button bg/gradient. Example: 'linear-gradient(135deg, #3b82f6, #2563eb)'
- sendButtonHoverBgColor: string – Send button hover bg. Example: 'linear-gradient(135deg, #2563eb, #1d4ed8)'
- sendButtonBorder: string – Send button border. Example: 'none'
- sendButtonBorderRadius: string – Send button radius. Example: '12px'
- sendButtonSize: string – Send button size. Example: '42px'
- sendButtonBoxShadow: string – Send button shadow. Example: '0 2px 4px rgba(59,130,246,.3)'

***Events:***
- messageSent: Triggered when the user sends a message. Payload: { message: { text, role: 'user', timestamp } }

***Exposed Element Actions:***
- scrollToBottom: (smooth?: boolean) Scroll to the latest message; uses `autoScrollBehavior` when arg omitted.

***Notes:***
- **Role-based system**: Messages use `role` property with values 'user' or 'assistant' (not participants)
- **ChatGPT-style by default**: Assistant messages have transparent background and no border; user messages have bubble style
- **Streaming support**: Bind `isStreaming` and `streamingText` to show real-time AI responses from OpenAI or similar APIs
- **Simplified configuration**: No header, no participants, no attachments, no date separators
- **All styles configurable**: Despite ChatGPT defaults, you can fully customize appearance via properties
- Enter sends message; Shift+Enter inserts newline
- Component includes built-in input area; do NOT add custom message input

***OpenAI Integration Example:***
```javascript
// Bind to workflow that streams from OpenAI
isStreaming: workflows['openai-stream'].isRunning
streamingText: variables['openai-response-text']

// On messageSent event:
// 1. Add user message to messages array
// 2. Trigger OpenAI streaming workflow
// 3. Bind streamingText to accumulating response
// 4. When stream completes, add assistant message to array
```

***Example Message Data Structure:***
```javascript
[
  { text: "What is the weather?", role: "user", timestamp: "2025-01-15T10:30:00Z" },
  { text: "The weather is sunny today.", role: "assistant", timestamp: "2025-01-15T10:30:05Z" }
]
```
