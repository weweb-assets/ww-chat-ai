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

#### ww-chat

1. **Component Purpose:** The ww-chat component provides a complete, customizable chat interface with support for conversations between users, file attachments, and various styling options. It's designed to be used in messaging applications, customer support interfaces, and any scenario requiring real-time text communication.

2. **Properties:**

    ## Style Properties

    ### Container

    - backgroundColor: `string` - Background color of the chat container. Default: `#f5f7fb`
    - containerBorder: `string` - Border of the chat container. Default: `1px solid #e2e8f0`
    - containerBorderRadius: `string` - Border radius of the chat container. Default: `8px`
    - containerShadow: `string` - Box shadow of the chat container. Default: `0 2px 8px rgba(0, 0, 0, 0.05)`
    - fontFamily: `string` - Font family used throughout the chat. Default: `inherit`

    ### Header

    - headerBgColor: `string` - Background color of the chat header. Default: `#ffffff`
    - headerTextColor: `string` - Text color in the chat header. Default: `#1e293b`

    ### Messages Area

    - messagesAreaBgColor: `string` - Background color of the messages area. Default: `#ffffff`

    ### Messages

    - messageBgColor: `string` - Background color of messages from others. Default: `#f1f5f9`
    - messageTextColor: `string` - Text color of messages from others. Default: `#334155`
    - messageBorder: `string` - Border of messages from others. Default: `1px solid #e2e8f0`
    - ownMessageBgColor: `string` - Background color of your own messages. Default: `#dbeafe`
    - ownMessageTextColor: `string` - Text color of your own messages. Default: `#1e40af`
    - ownMessageBorder: `string` - Border of your own messages. Default: `1px solid #bfdbfe`

    ### Input Area

    - inputBgColor: `string` - Background color of the message input. Default: `#ffffff`
    - inputTextColor: `string` - Text color of the message input. Default: `#334155`
    - inputPlaceholderColor: `string` - Placeholder text color in the message input. Default: `#94a3b8`
    - inputBorder: `string` - Border of the message input. Default: `1px solid #e2e8f0`

    ## Settings Properties

    ### User Settings

    - userName: `string` - Name to display for the current user. Default: `User`
    - userAvatar: `string` - URL of the user avatar image (initials will be used if empty). Default: ``
    - userLocation: `string` - Location to display under the user name (optional). Default: ``
    - userStatus: `string` - Current status of the user. Options: `online`, `offline`, `away`, `busy`. Default: `online`
    - currentUserId: `string` - Unique identifier for the current user (used to identify your messages). Default: `current-user`

    ### Chat Settings

    - displayHeader: `boolean` - Whether to display the chat header. Default: `true`
    - allowAttachments: `boolean` - Whether to allow file attachments. Default: `false`
    - inputPlaceholder: `string` - Placeholder text for the message input. Default: `Type a message...`
    - disabled: `boolean` - Whether the chat component is disabled. Default: `false`

    ### Chat Data

    - chatHistory: `array` - Array of message objects for the chat history. Each message should follow the format:
        ```json
        {
            "id": "msg-1",
            "text": "Hello there!",
            "senderId": "user-1",
            "userName": "John Doe",
            "timestamp": "2023-06-01T11:15:00.000Z",
            "attachments": [
                {
                    "id": "file-1",
                    "name": "document.pdf",
                    "type": "application/pdf",
                    "size": 1024000,
                    "url": "https://example.com/document.pdf"
                }
            ]
        }
        ```
        The `attachments` field is optional.

3. **Settings:**

    The ww-chat component allows configuration of user identity, conversation history, and general behavior through the settings properties detailed above.

4. **Children Components:**

    The ww-chat component is a self-contained system with no children components that need to be added separately. It consists of internal subcomponents including:

    - Chat header with user information
    - Message list with support for text and attachments
    - Input area with attachment support

5. **Special Features:**

    - **User Status Indicator**: Visual indication of user status (online, offline, away, busy)
    - **Message Grouping**: Messages from the same sender are visually grouped
    - **Date Separators**: Messages are separated by date with "Today", "Yesterday", or specific date labels
    - **File Attachments**: Support for sending and displaying file attachments, with special preview for images
    - **Auto-scrolling**: Automatically scrolls to the bottom when new messages arrive
    - **Responsive Input**: Input area expands as user types and supports shift+enter for line breaks

6. **Context:**

    The component provides a `chatHistory` variable that contains the full conversation history. Each message in the history includes:

    - Message ID
    - Message text
    - Sender ID and name
    - Timestamp
    - Attachments (if any)

7. **Events:**

    - messageSent: Triggered when a new message is sent. Payload: { message: { id, text, senderId, userName, timestamp, attachments } }
    - attachmentClick: Triggered when an attachment is clicked. Payload: { attachment: { id, name, type, size, url } }
    - close: Triggered when the close button in the header is clicked. Payload: {}

8. **Actions:**

    - scrollToBottom: Scrolls the message area to the bottom
    - clearMessages: Clears all messages from the chat history
    - addMessage: Adds a new message to the chat. Arguments: message object with text, senderId, and userName properties (timestamp will be added automatically)

9. **Variables:**

    - chatHistory: Array of message objects representing the full conversation history

10. **Examples:**

    ### Basic Chat Implementation

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

    ### Styled Chat Implementation

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
            "inputBgColor": "#ffffff",
            "inputTextColor": "#24292f",
            "inputBorder": "1px solid #d0d7de"
        }
    }
    ```

11. **Common Issues:**

    **Issue: Messages not showing the correct sender**

    - Ensure the `currentUserId` property is set correctly and matches the `senderId` field in your own messages.
    - Check that each message in `chatHistory` has the correct `senderId` and `userName` fields.

    **Issue: Attachments not working**

    - Verify that `allowAttachments` is set to `true`.
    - Ensure file URLs are accessible from your application.
    - For image previews, confirm the attachment has a valid image MIME type (image/jpeg, image/png, etc.).

    **Issue: Chat doesn't scroll to bottom with new messages**

    - The component should automatically scroll to the bottom when new messages are added.
    - If using the `addMessage` action programmatically, you may need to call `scrollToBottom` action afterward.

    **Issue: User avatar not showing**

    - Check that the `userAvatar` URL is valid and accessible.
    - If no avatar URL is provided, the component will display the user's initials.

12. **Notes:**

    - The chat component is designed for real-time messaging interfaces but does not include built-in socket or API connection logic. You'll need to implement these separately and update the `chatHistory` accordingly.
    - For production applications, consider implementing additional features like typing indicators, read receipts, or message editing functionality.
    - The component uses responsive design principles but may require additional styling for optimal appearance on very small screens.
    - When supporting large chat histories, consider implementing pagination or virtual scrolling to maintain performance.
