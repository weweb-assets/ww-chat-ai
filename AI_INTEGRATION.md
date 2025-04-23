# Integrating AI with ww-chat-ai

This guide explains how to connect the chat component with various AI providers.

## Basic Integration Steps

1. **Set up your AI provider** (OpenAI, Anthropic, etc.)
2. **Create a WeWeb action** to handle outgoing messages
3. **Add the AI response** back to the chat

## Implementation Example

Here's a simple example using WeWeb actions with OpenAI:

```javascript
// WeWeb action for handling user messages
// Triggered by the "messageSent" event from ww-chat-ai

// 1. Get the message text from the event
const messageText = wwEvent.message.text;

// 2. Call OpenAI API (you'll need to set up an API key in your WeWeb variables)
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${variables.openAIKey}`
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: messageText }
    ]
  })
});

const data = await response.json();
const aiResponseText = data.choices[0].message.content;

// 3. Add AI response to the chat
// Call the "addMessage" action on the ww-chat-ai component
wwElementActions['ww-chat-ai-element-id'].addMessage({
  text: aiResponseText,
  senderId: 'ai-assistant',
  userName: 'AI Assistant',
  timestamp: new Date().toISOString()
});
```

## Tips for Better AI Integration

1. **Add loading states:**
   - Set the chat's `disabled` property to `true` while waiting for the AI response
   - Reset to `false` when the response is received

2. **Handle errors gracefully:**
   - Add error handling in your API calls
   - Show error messages in the chat when AI requests fail

3. **Implement typing indicators:**
   - Add a temporary "AI is typing..." message while waiting for the response
   - Remove it when the actual response arrives

4. **Maintain conversation context:**
   - Keep track of previous messages to provide context to the AI
   - Use a WeWeb collection or variable to store conversation history

5. **Add streaming for better UX:**
   - Use streaming API endpoints when available
   - Update the message text as chunks are received

## Advanced Configurations

For specific AI provider integrations or more advanced features, please refer to the respective AI provider's documentation and our examples in the WeWeb community.

---

For more details on configuring the chat component itself, see the [AI.md](AI.md) file.
