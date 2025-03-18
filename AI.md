---
name: ww-chat
description: A comprehensive chat interface component with customizable styling, user details, and support for messages and attachments.
keywords:
    - chat
    - messaging
    - conversation
    - communication
    - interface
---

#### Chat Component

Container Properties:

-   `backgroundColor`: `string` - Background color of the chat container. Default: `#f5f7fb`
-   `containerBorder`: `string` - Border of the chat container. Default: `1px solid #e2e8f0`
-   `containerBorderRadius`: `string` - Border radius of the chat container. Default: `8px`
-   `containerShadow`: `string` - Box shadow of the chat container. Default: `0 2px 8px rgba(0, 0, 0, 0.05)`
-   `fontFamily`: `string` - Font family used throughout the chat. Default: `inherit`

Header Style Properties:

-   `headerBgColor`: `string` - Background color of the chat header. Default: `#ffffff`
-   `headerTextColor`: `string` - Text color in the chat header. Default: `#1e293b`
-   `headerBorder`: `string` - Border of the chat header. Default: `1px solid #e2e8f0`
-   `headerBoxShadow`: `string` - Box shadow of the chat header. Default: `0 1px 2px rgba(0, 0, 0, 0.05)`
-   `headerPadding`: `string` - Padding of the chat header. Default: `12px 16px`
-   `headerNameFontSize`: `string` - Font size of the user name in header. Default: `1rem`
-   `headerNameFontWeight`: `string` - Font weight of the user name in header. Default: `600`
-   `headerLocationFontSize`: `string` - Font size of the location text in header. Default: `0.875rem`
-   `headerLocationOpacity`: `number` - Opacity of the location text in header. Default: `0.7`
-   `headerCloseButtonColor`: `string` - Color of the close button (leave empty to inherit). Default: ``
-   `headerCloseButtonBgHover`: `string` - Background color of the close button on hover. Default: `rgba(0, 0, 0, 0.05)`
-   `displayHeader`: `boolean` - Whether to display the chat header. Default: `true`

Messages Area Properties:

-   `messagesAreaBgColor`: `string` - Background color of the messages area. Default: `#ffffff`
-   `messagesAreaPadding`: `string` - Padding inside the messages area. Default: `16px`
-   `messagesAreaHeight`: `string` - Height of the messages area. Use 'auto' to fill available space. Default: `auto`
-   `emptyMessageText`: `string` - Text to display when there are no messages. Default: `No messages yet`
-   `emptyMessageColor`: `string` - Color of the empty message text. Default: `#64748b`

Date Separator Properties:

-   `dateSeparatorTextColor`: `string` - Text color of the date separator. Default: `#64748b`
-   `dateSeparatorLineColor`: `string` - Color of the date separator divider line. Default: `#e2e8f0`
-   `dateSeparatorBgColor`: `string` - Background color behind the date text. Default: `#ffffff`
-   `dateSeparatorBorderRadius`: `string` - Border radius of the date separator. Default: `4px`

Message Style Properties:

-   `messageBgColor`: `string` - Background color of messages from others. Default: `#f1f5f9`
-   `messageTextColor`: `string` - Text color of messages from others. Default: `#334155`
-   `messageBorder`: `string` - Border of messages from others. Default: `1px solid #e2e8f0`
-   `ownMessageBgColor`: `string` - Background color of your own messages. Default: `#dbeafe`
-   `ownMessageTextColor`: `string` - Text color of your own messages. Default: `#1e40af`
-   `ownMessageBorder`: `string` - Border of your own messages. Default: `1px solid #bfdbfe`

Input Area Properties:

-   `inputBgColor`: `string` - Background color of the message input. Default: `#ffffff`
-   `inputTextColor`: `string` - Text color of the message input. Default: `#334155`
-   `inputPlaceholderColor`: `string` - Placeholder text color in the message input. Default: `#94a3b8`
-   `inputBorder`: `string` - Border of the message input. Default: `1px solid #e2e8f0`
-   `inputMaxHeight`: `string` - Maximum height of the input area before scrolling. Default: `120px`
-   `inputMinHeight`: `string` - Minimum height of the input area. Default: `40px`
-   `inputBorderRadius`: `string` - Border radius of the input field. Default: `8px`
-   `inputPlaceholder`: `string` - Placeholder text for the message input. Default: `Type a message...`
-   `disabled`: `boolean` - Whether the chat component is disabled. Default: `false`
-   `allowAttachments`: `boolean` - Whether to allow file attachments. Default: `false`

Icon Properties:

-   `sendIcon`: `string` - Icon for the send button. Default: `send`
-   `sendIconColor`: `string` - Color of the send button icon. Default: `#334155`
-   `sendIconSize`: `string` - Size of the send button icon. Default: `20px`
-   `attachmentIcon`: `string` - Icon for the attachment button. Default: `paperclip`
-   `attachmentIconColor`: `string` - Color of the attachment button icon. Default: `#334155`
-   `attachmentIconSize`: `string` - Size of the attachment button icon. Default: `20px`

User Properties:

-   `userName`: `string` - Name to display for the current user. Default: `User`
-   `userAvatar`: `string` - URL of the user avatar image (initials will be used if empty). Default: ``
-   `userLocation`: `string` - Location to display under the user name (optional). Default: ``
-   `userStatus`: `string` - Current status of the user. Options: `online`, `offline`, `away`, `busy`. Default: `online`
-   `currentUserId`: `string` - Unique identifier for the current user (used to identify your messages). Default: `current-user`

Chat Data:

-   `chatHistory`: `array` - Array of message objects for the chat history. Each message contains:
    -   `id`: `string` - Unique identifier for the message
    -   `text`: `string` - Message text content
    -   `senderId`: `string` - ID of the message sender
    -   `userName`: `string` - Display name of the message sender
    -   `timestamp`: `string` - ISO timestamp of when the message was sent
    -   `attachments`: `array` (optional) - Array of attachment objects

Message Data Mapping:

-   `mappingMessageId`: `Formula` - Formula to extract message ID from your data. Default: `context.mapping?.['id']`
-   `mappingMessageText`: `Formula` - Formula to extract message text from your data. Default: `context.mapping?.['text']`
-   `mappingSenderId`: `Formula` - Formula to extract sender ID from your data. Default: `context.mapping?.['senderId']`
-   `mappingUserName`: `Formula` - Formula to extract user name from your data. Default: `context.mapping?.['userName']`
-   `mappingTimestamp`: `Formula` - Formula to extract timestamp from your data. Default: `context.mapping?.['timestamp']`
-   `mappingAttachments`: `Formula` - Formula to extract attachments from your data. Default: `context.mapping?.['attachments']`

Events:

-   `messageSent`: {message: messageObject} - Triggered when a new message is sent
-   `attachmentClick`: {attachment: attachmentObject} - Triggered when an attachment is clicked
-   `close`: {} - Triggered when the close button in the header is clicked

Actions:

-   `scrollToBottom`: Scrolls the message area to the bottom. Args: `smooth` (boolean, optional) - Whether to use smooth scrolling animation. Default: `false`
-   `clearMessages`: Clears all messages from the chat history
-   `addMessage`: Adds a new message to the chat. Args: message (object with text, senderId, and userName properties)

Variables:

-   `chatHistory`: array - The full conversation history as an array of message objects

Special Features:

-   User status indicator (online, offline, away, busy)
-   Message grouping by sender
-   Date separators with "Today", "Yesterday", or date labels, fully customizable
-   Empty message state with customizable text and styling
-   File attachments with image preview support
-   Auto-scrolling to latest messages
-   Responsive input that expands as user types
-   Shift+Enter support for multiline messages
-   Customizable styling for all elements
-   Formula-based data mapping for flexible message structure

Important Implementation Notes:

-   The chat component is designed for real-time messaging but doesn't include built-in socket connections
-   For large chat histories, consider pagination or virtual scrolling
-   The component uses reactive Vue 3 styling with v-bind for dynamic property updates
-   All styling properties are bindable for dynamic theming
-   Responsive design adapts to container size but may need additional styling for small screens

Example Basic Implementation:

```json
{
    "tag": "ww-chat",
    "content": {
        "userName": "John Doe",
        "userStatus": "online",
        "currentUserId": "john-doe",
        "displayHeader": true,
        "allowAttachments": true,
        "chatHistory": [
            {
                "id": "msg-1",
                "text": "Hello there! Welcome to our support chat.",
                "senderId": "support-agent",
                "userName": "Support Agent",
                "timestamp": "2023-06-01T11:15:00.000Z"
            }
        ]
    }
}
```

Example Styled Implementation:

```json
{
    "tag": "ww-chat",
    "content": {
        "userName": "John Doe",
        "userAvatar": "https://example.com/avatars/john.jpg",
        "userStatus": "online",
        "currentUserId": "john-doe",
        "backgroundColor": "#f0f4f8",
        "containerBorder": "1px solid #d0d7de",
        "containerBorderRadius": "12px",
        "messageBgColor": "#ffffff",
        "messageTextColor": "#24292f",
        "messageBorder": "1px solid #d0d7de",
        "ownMessageBgColor": "#ddf4ff",
        "ownMessageTextColor": "#0969da",
        "ownMessageBorder": "1px solid #54aeff",
        "emptyMessageText": "No conversations yet. Start chatting!",
        "emptyMessageColor": "#6e7781",
        "dateSeparatorTextColor": "#57606a",
        "dateSeparatorLineColor": "#d0d7de",
        "dateSeparatorBgColor": "#f0f4f8",
        "dateSeparatorBorderRadius": "12px",
        "inputBgColor": "#ffffff",
        "inputTextColor": "#24292f",
        "inputBorder": "1px solid #d0d7de"
    }
}
```

Troubleshooting:

-   **Messages showing incorrect sender:** Check that `currentUserId` matches the `senderId` in your messages
-   **Attachments not working:** Ensure `allowAttachments` is set to `true` and file URLs are accessible
-   **Chat not scrolling to bottom:** Call `scrollToBottom` action after programmatically adding messages
-   **User avatar not displaying:** Verify the avatar URL is valid (initials will be shown as fallback)
