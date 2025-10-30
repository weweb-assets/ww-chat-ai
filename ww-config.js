// Helper functions for attachment mapping
const __evalCode = (code, type, ctx) => {
    try {
        if (typeof code !== 'string') return undefined;
        const body = type === 'js' ? code : `return (${code});`;
        // eslint-disable-next-line no-new-func
        const fn = new Function('context', body);
        return fn(ctx);
    } catch {
        return undefined;
    }
};

const __pickTemplateMessageByMapping = (messages, mapping) => {
    if (mapping?.code && Array.isArray(messages) && messages.length) {
        for (const msg of messages) {
            const res = __evalCode(mapping.code, mapping.type || 'f', { mapping: msg });
            if (Array.isArray(res) && res.length) return msg;
        }
    }
    const fallback = messages.find(m => Array.isArray(m?.attachments) && m.attachments.length);
    return fallback || (messages.length ? messages[0] : null);
};

const __pickFirstAttachmentByMapping = (messages, mapping) => {
    if (mapping?.code && Array.isArray(messages) && messages.length) {
        for (const msg of messages) {
            const arr = __evalCode(mapping.code, mapping.type || 'f', { mapping: msg });
            if (Array.isArray(arr) && arr.length) return arr[0];
        }
    }
    const withAtt = messages.find(m => Array.isArray(m?.attachments) && m.attachments.length);
    return withAtt ? withAtt.attachments[0] : null;
};

export default {
    inherit: {
        type: 'ww-layout',
    },
    options: {
        displayAllowedValues: ['flex', 'grid', 'inline-flex', 'inline-grid'],
    },
    editor: {
        label: { en: 'Chat AI' },
        icon: 'chat',
        customStylePropertiesOrder: [
            'fontFamily',
            {
                label: "Messages area",
                isCollapsible: true,
                properties: [
                    'messagesAreaBgColor',
                    'messagesAreaPadding',
                    'emptyMessageText',
                    'emptyMessageColor',
                ],
            },
            {
                label: "Assistant messages",
                isCollapsible: true,
                properties: [
                    'messageShowTimestamp',
                    'messageBgColor',
                    'messageTextColor',
                    'messageFontSize',
                    'messageFontWeight',
                    'messageFontFamily',
                    'messageBorder',
                    'messageRadius',
                ],
            },
            {
                label: "User messages",
                isCollapsible: true,
                properties: [
                    'ownMessageShowTimestamp',
                    'ownMessageBgColor',
                    'ownMessageTextColor',
                    'ownMessageFontSize',
                    'ownMessageFontWeight',
                    'ownMessageFontFamily',
                    'ownMessageBorder',
                    'ownMessageRadius',
                ],
            },
            {
                label: "Input area",
                isCollapsible: true,
                properties: [
                    'inputBgColor',
                    'inputAreaBorder',
                ],
            },
            {
                label: "Text area",
                isCollapsible: true,
                properties: [
                    'textareaBorder',
                    'textareaBorderHover',
                    'textareaBorderFocus',
                    'inputTextColor',
                    'inputFontSize',
                    'inputFontWeight',
                    'inputFontFamily',
                    'inputPlaceholderColor',
                    'inputHeight',
                    'inputBorderRadius',
                    'inputPlaceholder',
                    'inputActionAlign',
                ],
            },
            {
                label: "Send icon",
                isCollapsible: true,
                properties: [
                    'sendIcon',
                    'sendIconColor',
                    'sendIconSize',
                ],
            },
            {
                label: "Attachment icon",
                isCollapsible: true,
                properties: [
                    'attachmentIcon',
                    'attachmentIconColor',
                    'attachmentIconSize',
                ],
            },
            {
                label: "Remove attachment icon",
                isCollapsible: true,
                properties: [
                    'removeIcon',
                    'removeIconColor',
                    'removeIconSize',
                ],
            },
            {
                label: "Image preview",
                isCollapsible: true,
                properties: [
                    'messagesAttachmentThumbMaxWidth',
                    'messagesAttachmentThumbMaxHeight',
                    'messagesAttachmentThumbMinWidth',
                    'messagesAttachmentThumbMinHeight',
                    'messagesAttachmentThumbBorderRadius',
                ],
            },
            {
                label: "Send button",
                isCollapsible: true,
                properties: [
                    'sendButtonBgColor',
                    'sendButtonHoverBgColor',
                    'sendButtonBorder',
                    'sendButtonBorderRadius',
                    'sendButtonSize',
                    'sendButtonBoxShadow',
                ],
            },
            {
                label: "Attachment button",
                isCollapsible: true,
                properties: [
                    'attachmentButtonBgColor',
                    'attachmentButtonHoverBgColor',
                    'attachmentButtonBorder',
                    'attachmentButtonBorderRadius',
                    'attachmentButtonSize',
                    'attachmentButtonBoxShadow',
                ],
            },            
        ],
        customSettingsPropertiesOrder: [
            {
                label: "Chat settings",
                isCollapsible: true,
                properties: [
                    'userLabel',
                    'assistantLabel',
                    'disabled',
                    'enableMarkdown',
                    'allowAttachments',
                    'autoScrollBehavior',
                ],
            }, 
            {
                label: "Chat data",
                isCollapsible: true,
                properties: [
                    'messages',
                    'mappingMessageId',
                    'mappingMessageText',
                    'mappingRole',
                    'mappingTimestamp',
                    'mappingAttachments',
                ],
            }, 
             {
                label: "Attachments data",
                isCollapsible: true,
                properties: [
                    'mappingAttachmentId',
                    'mappingAttachmentName',
                    'mappingAttachmentUrl',
                    'mappingAttachmentType',
                    'mappingAttachmentSize',
                ],
            },
            {
                label: "Streaming",
                isCollapsible: true,
                properties: ['isStreaming', 'streamingText'],

            }, 
        ],
    },
    triggerEvents: [
        {
            name: 'messageSent',
            label: { en: 'On message sent' },
            event: {
                message: {
                    id: 'msg-1',
                    content: 'Hello there!',
                    role: 'user',
                    timestamp: new Date().toISOString(),
                    attachments: [
                        {
                            id: 'file-1',
                            name: 'demo.txt',
                            type: 'text/plain',
                            size: 12,
                            url: 'blob:https://example.com/...',
                        },
                    ],
                },
            },
        },
        {
            name: 'messageReceived',
            label: { en: 'On message received' },
            event: {
                message: {
                    id: 'msg-2',
                    content: 'New assistant message received',
                    role: 'assistant',
                    timestamp: new Date().toISOString(),
                    attachments: [
                        {
                            id: 'file-1',
                            name: 'result.pdf',
                            type: 'application/pdf',
                            size: 102400,
                            url: 'https://example.com/result.pdf',
                        },
                    ],
                },
            },
        },
        {
            name: 'messageRightClick',
            label: { en: 'On message right click' },
            event: {
                message: {
                    id: 'msg-1',
                    content: 'Message content',
                    role: 'user',
                    timestamp: new Date().toISOString(),
                },
                position: {
                    elementX: 50, // relative to chat element
                    elementY: 20,
                    viewportX: 320, // relative to page top-left
                    viewportY: 480,
                },
            },
        },
        {
            name: 'attachmentClick',
            label: { en: 'On attachment click' },
            event: {
                attachment: {
                    id: 'file-1',
                    name: 'document.pdf',
                    type: 'application/pdf',
                    size: 1024000,
                    url: 'https://example.com/document.pdf',
                },
            },
        },
        {
            name: 'pendingAttachmentClick',
            label: { en: 'On pending attachment click' },
            event: {
                attachment: {
                    name: 'image.png',
                    type: 'image/png',
                    size: 204800,
                },
                index: 0,
            },
        },
    ],
    actions: [
        {
            action: 'scrollToBottom',
            label: { en: 'Scroll to bottom' },
            args: [
                {
                    name: 'smooth',
                    type: 'boolean',
                    label: { en: 'Smooth scroll' },
                },
            ],
        },
    ],
    properties: {
        // ======== APPEARANCE ========

        // Container styles
        fontFamily: {
            label: { en: 'Font Family' },
            type: 'FontFamily',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'inherit',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Font family used across the chat UI.\n\nExample: `Inter, sans-serif`',
            },
            /* wwEditor:end */
        },

        // Messages area styles
        messagesAreaBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '#ffffff',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Conversation pane background.\n\nExample: `#ffffff`',
            },
            /* wwEditor:end */
        },
        messagesAreaPadding: {
            label: { en: 'Padding' },
            type: 'Spacing',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '16px',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Inner spacing around messages.\n\nExample: `16px`, `20px 16px`',
            },
            /* wwEditor:end */
        },
        emptyMessageText: {
            label: { en: 'Empty Message Text' },
            type: 'Text',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'No messages yet',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Text when no messages are present.\n\nExample: `No messages yet`',
            },
            /* wwEditor:end */
        },
        emptyMessageColor: {
            label: { en: 'Empty Message Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '#64748b',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Color for the empty-state text.\n\nExample: `#64748b`',
            },
            /* wwEditor:end */
        },

        // Message styles (AI/Assistant messages - no bubble by default)
        messageShowTimestamp: {
            label: { en: 'Show Timestamp' },
            type: 'OnOff',
            section: 'style',
            bindable: true,
            defaultValue: true,
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Show a timestamp beside assistant messages.\n\nPossible values: **`true`**, **`false`**',
            },
            /* wwEditor:end */
        },
        messageBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'transparent',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Assistant message background (ChatGPT-style is transparent by default).\n\nExample: `transparent`, `#f1f5f9`',
            },
            /* wwEditor:end */
        },
        messageTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '#334155',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Text color of assistant messages.\n\nExample: `#334155`',
            },
            /* wwEditor:end */
        },
        messageFontSize: {
            label: { en: 'Font Size' },
            type: 'Length',
            section: 'style',
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: 8, max: 100 },
                    { value: 'em', label: 'em', min: 0.5, max: 5, digits: 3, step: 0.1 },
                    { value: 'rem', label: 'rem', min: 0.5, max: 5, digits: 3, step: 0.1 },
                ],
            },
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '0.875rem',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Font size of assistant messages.\n\nExample: `0.875rem`, `16px`',
            },
            /* wwEditor:end */
        },
        messageFontWeight: {
            label: { en: 'Font Weight' },
            type: 'TextSelect',
            section: 'style',
            options: {
                options: [
                    { value: '100', label: '100 (Thin)' },
                    { value: '200', label: '200 (Extra Light)' },
                    { value: '300', label: '300 (Light)' },
                    { value: '400', label: '400 (Normal)' },
                    { value: '500', label: '500 (Medium)' },
                    { value: '600', label: '600 (Semi Bold)' },
                    { value: '700', label: '700 (Bold)' },
                    { value: '800', label: '800 (Extra Bold)' },
                    { value: '900', label: '900 (Black)' },
                ],
            },
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '400',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Font weight of assistant messages.\n\nPossible values: **`100`**, **`200`**, **`300`**, **`400`**, **`500`**, **`600`**, **`700`**, **`800`**, **`900`**',
            },
            /* wwEditor:end */
        },
        messageFontFamily: {
            label: { en: 'Font Family' },
            type: 'FontFamily',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'inherit',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Font family for assistant messages.\n\nExample: `inherit`, `Inter, sans-serif`, `Georgia, serif`',
            },
            /* wwEditor:end */
        },
        messageBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'none',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Border for assistant messages.\n\nExample: `none`, `1px solid #e2e8f0`',
            },
            /* wwEditor:end */
        },
        messageRadius: {
            label: { en: 'Border Radius' },
            type: 'Spacing',
            options: {
                isCorner: true,
                unitChoices: [
                    { value: 'px', label: 'px', min: 0, max: 50, default: true },
                    { value: '%', label: '%', min: 0, max: 100, digits: 2, step: 1 },
                ],
            },
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '12px 12px 12px 12px',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Corner roundness of assistant messages.\n\nExample: `12px 12px 12px 12px`, `12px`',
            },
            /* wwEditor:end */
        },

        // User message styles (with bubble)
        ownMessageShowTimestamp: {
            label: { en: 'Show Timestamp' },
            type: 'OnOff',
            section: 'style',
            bindable: true,
            defaultValue: true,
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Show a timestamp beside user messages.\n\nPossible values: **`true`**, **`false`**',
            },
            /* wwEditor:end */
        },
        ownMessageBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '#f4f4f4',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Bubble background for user messages.\n\nExample: `#f4f4f4`',
            },
            /* wwEditor:end */
        },
        ownMessageTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '#1e1e1e',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Text color of user messages.\n\nExample: `#1e1e1e`',
            },
            /* wwEditor:end */
        },
        ownMessageFontSize: {
            label: { en: 'Font Size' },
            type: 'Length',
            section: 'style',
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: 8, max: 100 },
                    { value: 'em', label: 'em', min: 0.5, max: 5, digits: 3, step: 0.1 },
                    { value: 'rem', label: 'rem', min: 0.5, max: 5, digits: 3, step: 0.1 },
                ],
            },
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '0.875rem',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Font size of user messages.\n\nExample: `0.875rem`, `16px`',
            },
            /* wwEditor:end */
        },
        ownMessageFontWeight: {
            label: { en: 'Font Weight' },
            type: 'TextSelect',
            section: 'style',
            options: {
                options: [
                    { value: '100', label: '100 (Thin)' },
                    { value: '200', label: '200 (Extra Light)' },
                    { value: '300', label: '300 (Light)' },
                    { value: '400', label: '400 (Normal)' },
                    { value: '500', label: '500 (Medium)' },
                    { value: '600', label: '600 (Semi Bold)' },
                    { value: '700', label: '700 (Bold)' },
                    { value: '800', label: '800 (Extra Bold)' },
                    { value: '900', label: '900 (Black)' },
                ],
            },
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '400',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Font weight of user messages.\n\nPossible values: **`100`**, **`200`**, **`300`**, **`400`**, **`500`**, **`600`**, **`700`**, **`800`**, **`900`**',
            },
            /* wwEditor:end */
        },
        ownMessageFontFamily: {
            label: { en: 'Font Family' },
            type: 'FontFamily',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'inherit',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Font family for user messages.\n\nExample: `inherit`, `Inter, sans-serif`, `Georgia, serif`',
            },
            /* wwEditor:end */
        },
        ownMessageBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '1px solid #d0d0d0',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Border of user message bubble.\n\nExample: `1px solid #d0d0d0`',
            },
            /* wwEditor:end */
        },
        ownMessageRadius: {
            label: { en: 'Border Radius' },
            type: 'Spacing',
            options: {
                isCorner: true,
                unitChoices: [
                    { value: 'px', label: 'px', min: 0, max: 50, default: true },
                    { value: '%', label: '%', min: 0, max: 100, digits: 2, step: 1 },
                ],
            },
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '18px 18px 18px 18px',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Border radius of user message bubble.\n\nExample: `18px 18px 18px 18px`, `12px`',
            },
            /* wwEditor:end */
        },

        // Input styles
        inputBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '#ffffff',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Background color of input area.\n\nExample: `#ffffff`',
            },
            /* wwEditor:end */
        },
        inputAreaBorder: {
            label: { en: 'Area Border Top' },
            type: 'Border',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '1px solid #e2e8f0',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Top border separating messages from input.\n\nExample: `1px solid #e2e8f0`',
            },
            /* wwEditor:end */
        },
        textareaBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '1px solid #e2e8f0',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Border of text input.\n\nExample: `1px solid #e2e8f0`',
            },
            /* wwEditor:end */
        },
        textareaBorderHover: {
            label: { en: 'Border (Hover)' },
            type: 'Border',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '1px solid #cbd5e1',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Border of text input on hover.\n\nExample: `1px solid #cbd5e1`',
            },
            /* wwEditor:end */
        },
        textareaBorderFocus: {
            label: { en: 'Border (Focus)' },
            type: 'Border',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '1px solid #3b82f6',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Border of text input on focus.\n\nExample: `1px solid #3b82f6`',
            },
            /* wwEditor:end */
        },
        inputTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '#334155',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Text color of text input.\n\nExample: `#334155`',
            },
            /* wwEditor:end */
        },
        inputFontSize: {
            label: { en: 'Font Size' },
            type: 'Length',
            section: 'style',
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: 8, max: 100 },
                    { value: 'em', label: 'em', min: 0.5, max: 5, digits: 3, step: 0.1 },
                    { value: 'rem', label: 'rem', min: 0.5, max: 5, digits: 3, step: 0.1 },
                ],
            },
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '0.875rem',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Font size of text input.\n\nExample: `0.875rem`, `1rem`',
            },
            /* wwEditor:end */
        },
        inputFontWeight: {
            label: { en: 'Font Weight' },
            type: 'TextSelect',
            section: 'style',
            options: {
                options: [
                    { value: '100', label: '100 (Thin)' },
                    { value: '200', label: '200 (Extra Light)' },
                    { value: '300', label: '300 (Light)' },
                    { value: '400', label: '400 (Normal)' },
                    { value: '500', label: '500 (Medium)' },
                    { value: '600', label: '600 (Semi Bold)' },
                    { value: '700', label: '700 (Bold)' },
                    { value: '800', label: '800 (Extra Bold)' },
                    { value: '900', label: '900 (Black)' },
                ],
            },
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '400',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Font weight of text input.\n\nPossible values: **`100`**, **`200`**, **`300`**, **`400`**, **`500`**, **`600`**, **`700`**, **`800`**, **`900`**',
            },
            /* wwEditor:end */
        },
        inputFontFamily: {
            label: { en: 'Font Family' },
            type: 'FontFamily',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'inherit',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Font family of text input.\n\nExample: `inherit`, `monospace`',
            },
            /* wwEditor:end */
        },
        inputPlaceholderColor: {
            label: { en: 'Placeholder Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '#94a3b8',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Color of placeholder text in text input.\n\nExample: `#94a3b8`',
            },
            /* wwEditor:end */
        },
        inputHeight: {
            label: { en: 'Height' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '38px',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Height of text input.\n\nExample: `38px`',
            },
            /* wwEditor:end */
        },
        inputBorderRadius: {
            label: { en: 'Border Radius' },
            type: 'Spacing',
            options: {
                isCorner: true,
                unitChoices: [
                    { value: 'px', label: 'px', min: 0, max: 50, default: true },
                    { value: '%', label: '%', min: 0, max: 100, digits: 2, step: 1 },
                ],
            },
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '8px',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Border radius of text input.\n\nExample: `8px`, `20px`',
            },
            /* wwEditor:end */
        },
        inputPlaceholder: {
            label: { en: 'Placeholder' },
            type: 'Text',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'Message...',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Placeholder text shown in text input when empty.\n\nExample: `Message...`, `Ask me anything...`',
            },
            /* wwEditor:end */
        },
        inputActionAlign: {
            label: { en: 'Action Alignment' },
            type: 'TextSelect',
            section: 'style',
            options: {
                options: [
                    { value: 'start', label: 'Start' },
                    { value: 'end', label: 'End' },
                ],
            },
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'end',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Vertical alignment of action buttons beside the text input.\n\nPossible values: **`start`**, **`end`**',
            },
            /* wwEditor:end */
        },

        // Send icon
        sendIcon: {
            label: { en: 'Icon' },
            type: 'SystemIcon',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: 'send',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Icon for the send button',
            },
            propertyHelp: {
                tooltip: 'Icon used for the send button.\n\nExample: `lucide/send`, `lucide/chevron-right`',
            },
            /* wwEditor:end */
        },
        sendIconColor: {
            label: { en: 'Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '#334155',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Send button icon color.\n\nExample: `#334155`',
            },
            /* wwEditor:end */
        },
        sendIconSize: {
            label: { en: 'Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '20px',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Send button icon size.\n\nExample: `20px`',
            },
            /* wwEditor:end */
        },
        attachmentIcon: {
            label: { en: 'Icon' },
            type: 'SystemIcon',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: 'paperclip',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Icon for the attachment button',
            },
            propertyHelp: {
                tooltip: 'Icon for adding attachments button.\n\nExample: `lucide/paperclip`, `lucide/plus`',
            },
            /* wwEditor:end */
        },
        attachmentIconColor: {
            label: { en: 'Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '#334155',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Color of the attachment button icon',
            },
            propertyHelp: {
                tooltip: 'Attachment button icon color.\n\nExample: `#334155`',
            },
            /* wwEditor:end */
        },
        attachmentIconSize: {
            label: { en: 'Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '20px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Size of the attachment button icon',
            },
            propertyHelp: {
                tooltip: 'Attachment button icon size.\n\nExample: `20px`',
            },
            /* wwEditor:end */
        },
        removeIcon: {
            label: { en: 'Icon' },
            type: 'SystemIcon',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: 'x',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Icon for the remove attachment button',
            },
            propertyHelp: {
                tooltip: 'Icon used for remove attachment button.\n\nExample: `lucide/x`, `lucide/trash`',
            },
            /* wwEditor:end */
        },
        removeIconColor: {
            label: { en: 'Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '#334155',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Color of the remove attachment button icon',
            },
            propertyHelp: {
                tooltip: 'Remove button icon color.\n\nExample: `#334155`',
            },
            /* wwEditor:end */
        },
        removeIconSize: {
            label: { en: 'Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '16px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Size of the remove attachment button icon',
            },
            propertyHelp: {
                tooltip: 'Remove button icon size.\n\nExample: `16px`',
            },
            /* wwEditor:end */
        },

        // Image preview (thumbnails inside messages)
        messagesAttachmentThumbMaxWidth: {
            label: { en: 'Attachment Max Width' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '250px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Maximum width of image attachment thumbnails in the messages area',
            },
            propertyHelp: {
                tooltip: 'Max width of attached images in messages.\n\nExample: `250px`',
            },
            /* wwEditor:end */
        },
        messagesAttachmentThumbMaxHeight: {
            label: { en: 'Attachment Max Height' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '200px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Maximum height of image attachment thumbnails in the messages area',
            },
            propertyHelp: {
                tooltip: 'Max height of attached images in messages.\n\nExample: `200px`',
            },
            /* wwEditor:end */
        },
        messagesAttachmentThumbMinWidth: {
            label: { en: 'Attachment Min Width' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '80px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Minimum width of image attachment thumbnails (fallback for SVGs without intrinsic dimensions)',
            },
            propertyHelp: {
                tooltip: 'Min width of attached images in messages.\n\nExample: `80px`',
            },
            /* wwEditor:end */
        },
        messagesAttachmentThumbMinHeight: {
            label: { en: 'Attachment Min Height' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '80px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Minimum height of image attachment thumbnails (fallback for SVGs without intrinsic dimensions)',
            },
            propertyHelp: {
                tooltip: 'Min height of attached images in messages.\n\nExample: `80px`',
            },
            /* wwEditor:end */
        },
        messagesAttachmentThumbBorderRadius: {
            label: { en: 'Attachment Border Radius' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '6px',
            /* wwEditor:start */
            bindingValidation: { type: 'string', tooltip: 'Border radius of image attachment thumbnails' },
            propertyHelp: {
                tooltip: 'Border radius of attached images in messages.\n\nExample: `6px`',
            },
            /* wwEditor:end */
        },

        // Send button styles
        sendButtonBgColor: {
            label: { en: 'Background' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Background (color or gradient) of send button.\n\nExample: `#2563eb`, `linear-gradient(135deg,#3b82f6,#2563eb)`',
            },
            /* wwEditor:end */
        },
        sendButtonHoverBgColor: {
            label: { en: 'Background (Hover)' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Background of send button on hover.\n\nExample: `linear-gradient(135deg,#2563eb,#1d4ed8)`, `#1d4ed8`',
            },
            /* wwEditor:end */
        },
        sendButtonBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: 'none',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Border of send button.\n\nExample: `none`, `1px solid #e2e8f0`',
            },
            /* wwEditor:end */
        },
        sendButtonBorderRadius: {
            label: { en: 'Border Radius' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '12px',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Border radius of send button.\n\nExample: `12px`, `100%`',
            },
            /* wwEditor:end */
        },
        sendButtonSize: {
            label: { en: 'Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '42px',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Width & height of send button.\n\nExample: `42px`',
            },
            /* wwEditor:end */
        },
        sendButtonBoxShadow: {
            label: { en: 'Shadow' },
            type: 'Shadows',
            section: 'style',
            bindable: true,
            classes: true,
            responsive: true,
            defaultValue: '0 2px 4px rgba(59, 130, 246, 0.3)',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Shadow of send button.\n\nExample: `0 2px 4px rgba(59,130,246,.3)`',
            },
            /* wwEditor:end */
        },

        // Attachment button styles
        attachmentButtonBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '#f8fafc',
            /* wwEditor:start */
            bindingValidation: { type: 'string', tooltip: 'Background for the attachment button' },
            propertyHelp: {
                tooltip: 'Background color of attachment button.\n\nExample: `#f8fafc`',
            },
            /* wwEditor:end */
        },
        attachmentButtonHoverBgColor: {
            label: { en: 'Hover Background' },
            type: 'Color',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '#f1f5f9',
            /* wwEditor:start */
            bindingValidation: { type: 'string', tooltip: 'Hover background for the attachment button' },
            propertyHelp: {
                tooltip: 'Background color of attachment button on hover.\n\nExample: `#f1f5f9`',
            },
            /* wwEditor:end */
        },
        attachmentButtonBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '1px solid #e2e8f0',
            /* wwEditor:start */
            bindingValidation: { type: 'string', tooltip: 'Border for the attachment button' },
            propertyHelp: {
                tooltip: 'Border of attachment button.\n\nExample: `1px solid #e2e8f0`',
            },
            /* wwEditor:end */
        },
        attachmentButtonBorderRadius: {
            label: { en: 'Border Radius' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '12px',
            /* wwEditor:start */
            bindingValidation: { type: 'string', tooltip: 'Border radius of the attachment button' },
            propertyHelp: {
                tooltip: 'Border radius of attachment button.\n\nExample: `12px`, `8px`',
            },
            /* wwEditor:end */
        },
        attachmentButtonSize: {
            label: { en: 'Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '42px',
            /* wwEditor:start */
            bindingValidation: { type: 'string', tooltip: 'Square size of the attachment button' },
            propertyHelp: {
                tooltip: 'Width & height of attachment button.\n\nExample: `42px`',
            },
            /* wwEditor:end */
        },
        attachmentButtonBoxShadow: {
            label: { en: 'Shadow' },
            type: 'Shadows',
            section: 'style',
            bindable: true,
            classes: true,
            states: true,
            responsive: true,
            defaultValue: '0 1px 2px rgba(0, 0, 0, 0.06)',
            /* wwEditor:start */
            bindingValidation: { type: 'string', tooltip: 'Shadow applied to the attachment button' },
            propertyHelp: {
                tooltip: 'Background shadow of attachment button.\n\nExample: `0 1px 2px rgba(0,0,0,.06)`',
            },
            /* wwEditor:end */
        },

        // ======== SETTINGS ========
        userLabel: {
            label: { en: 'User Label' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'You',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Label for user messages.\n\nExample: `You`',
            },
            /* wwEditor:end */
        },
        assistantLabel: {
            label: { en: 'Assistant Label' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'Assistant',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Label for assistant messages.\n\nExample: `Assistant`',
            },
            /* wwEditor:end */
        },
        disabled: {
            label: { en: 'Disabled' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false,
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Disable the entire chat UI and sending.\n\nPossible values: **`true`**, **`false`**',
            },
            /* wwEditor:end */
        },
        enableMarkdown: {
            label: { en: 'Enable Markdown' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false,
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Render markdown (bold, code, links, lists). When off, newlines are kept.\n\nPossible values: **`true`**, **`false`**',
            },
            /* wwEditor:end */
        },
        allowAttachments: {
            label: { en: 'Allow Attachments' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false,
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Enable file attachments in the input area.\n\nPossible values: **`true`**, **`false`**',
            },
            /* wwEditor:end */
        },
        autoScrollBehavior: {
            label: { en: 'Auto Scroll Behavior' },
            type: 'TextSelect',
            section: 'settings',
            options: {
                options: [
                    { value: 'auto', label: 'Instant' },
                    { value: 'smooth', label: 'Smooth' },
                ],
            },
            bindable: true,
            defaultValue: 'auto',
            /* wwEditor:start */
            propertyHelp: {
                tooltip: 'Scroll behavior for new messages.\n\nPossible values: **`auto`**, **`smooth`**',
            },
            /* wwEditor:end */
        },

        // Chat data
        messages: {
            label: { en: 'Messages' },
            type: 'Info',
            section: 'settings',
            bindable: true,
            bindingValidation: {
                type: 'array',
                tooltip: 'Array of message objects: [{ text: string, role: "user"|"assistant", timestamp?: string }]',
            },
            /* wwEditor:start */
            propertyHelp: {
                tooltip:
                    'A list of role-based messages that represent the conversation.\n\nEach message typically includes **`content`**, **`role`** (**`user`** or **`assistant`**), and **`timestamp`**. Optionally can include **`attachments`**.\n\n**Example:**\n```json\n[\n  { "content": "Hello!", "role": "user", "timestamp": "2025-06-01T10:30:00Z" },\n  {\n    "content": "Hi there!",\n    "role": "assistant",\n    "timestamp": "2025-06-01T10:30:05Z",\n    "attachments": [\n      { "id": "img-1", "name": "chart.png", "url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", "type": "image/png", "size": 245600 }\n    ]\n  }\n]\n```',
            },
            /* wwEditor:end */
        },
        mappingMessageId: {
            label: { en: 'Message ID' },
            type: 'Formula',
            options: content => ({
                template: Array.isArray(content.messages) && content.messages.length ? content.messages[0] : null,
            }),
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['id']",
            },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: {
                type: 'formula',
                tooltip: 'Formula to extract the unique message ID from each message object',
            },
            propertyHelp: {
                tooltip:
                    'Mapping to the unique message ID in your **Messages** data.\n\n**Example mapping:** `context.mapping?.["id"]`\n\n**Example value:** `"msg-1"`',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => !boundProps.messages,
        },
        mappingMessageText: {
            label: { en: 'Message Text' },
            type: 'Formula',
            options: content => ({
                template: Array.isArray(content.messages) && content.messages.length ? content.messages[0] : null,
            }),
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['content']",
            },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: {
                type: 'formula',
                tooltip: 'Formula to extract the message text from each message object',
            },
            propertyHelp: {
                tooltip:
                    'Mapping to the text content in your **Messages** data.\n\n**Example mapping:** `context.mapping?.["content"]`\n\n**Example value:** `"Hello, how can I help?"`',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => !boundProps.messages,
        },
        mappingRole: {
            label: { en: 'Message Role' },
            type: 'Formula',
            options: content => ({
                template: Array.isArray(content.messages) && content.messages.length ? content.messages[0] : null,
            }),
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['role']",
            },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: {
                type: 'formula',
                tooltip: 'Formula to extract the role from each message object',
            },
            propertyHelp: {
                tooltip:
                    'Mapping to the role in your **Messages** data.\n\n**Example mapping:** `context.mapping?.["role"]`\n\n**Example values:** `"user"` or `"assistant"`',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => !boundProps.messages,
        },
        mappingTimestamp: {
            label: { en: 'Timestamp' },
            type: 'Formula',
            options: content => ({
                template: Array.isArray(content.messages) && content.messages.length ? content.messages[0] : null,
            }),
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['timestamp']",
            },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: {
                type: 'formula',
                tooltip: 'Formula to extract the timestamp from each message object',
            },
            propertyHelp: {
                tooltip:
                    'Mapping to the timestamp in your **Messages** data.\n\n**Example mapping:** `context.mapping?.["timestamp"]`\n\n**Example value:** `"2025-10-02T10:30:00Z"`',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => !boundProps.messages,
        },
        mappingAttachments: {
            label: { en: 'Attachments' },
            type: 'Formula',
            options: content => {
                const messages = Array.isArray(content.messages) ? content.messages : [];
                const mapping = content?.mappingAttachments;
                return { template: __pickTemplateMessageByMapping(messages, mapping) };
            },
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['attachments']",
            },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: {
                type: 'formula',
                tooltip: 'Formula to extract the attachments array from each message object',
            },
            propertyHelp: {
                tooltip:
                    'Mapping to the attachments in your **Messages** data.\n\n**Example mapping:** `context.mapping?.["attachments"]`\n\n**Example value:**\n```json\n[{ "id": "file-1", "name": "image.png", "type": "image/png", "size": 204800, "url": "https://example.com/file.png" }]\n```',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => !boundProps.messages,
        },

        // Attachments Data
        mappingAttachmentId: {
            label: { en: 'ID' },
            type: 'Formula',
            options: content => {
                const messages = Array.isArray(content.messages) ? content.messages : [];
                const mapping = content?.mappingAttachments;
                return { template: __pickFirstAttachmentByMapping(messages, mapping) };
            },
            defaultValue: { type: 'f', code: "context.mapping?.['id']" },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: { type: 'formula', tooltip: 'Formula that returns the attachment unique id' },
            propertyHelp: {
                tooltip:
                    'Mapping to the unique ID in your **Attachments** data.\n\n**Example mapping:** `context.mapping?.["id"]`\n\n**Example value:** `"file-1"`',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => {
                const hasMessages = !!boundProps?.messages;
                const hasAttachmentsMapping = !!content?.mappingAttachments?.code;
                return !(hasMessages && hasAttachmentsMapping);
            },
        },
        mappingAttachmentName: {
            label: { en: 'Name' },
            type: 'Formula',
            options: content => {
                const messages = Array.isArray(content.messages) ? content.messages : [];
                const mapping = content?.mappingAttachments;
                return { template: __pickFirstAttachmentByMapping(messages, mapping) };
            },
            defaultValue: { type: 'f', code: "context.mapping?.['name']" },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: { type: 'formula', tooltip: 'Formula that returns the attachment display name' },
            propertyHelp: {
                tooltip:
                    'Mapping to the display name in your **Attachments** data.\n\n**Example mapping:** `context.mapping?.["name"]`\n\n**Example value:** `"report.pdf"`',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => {
                const hasMessages = !!boundProps?.messages;
                const hasAttachmentsMapping = !!content?.mappingAttachments?.code;
                return !(hasMessages && hasAttachmentsMapping);
            },
        },
        mappingAttachmentUrl: {
            label: { en: 'URL' },
            type: 'Formula',
            options: content => {
                const messages = Array.isArray(content.messages) ? content.messages : [];
                const mapping = content?.mappingAttachments;
                return { template: __pickFirstAttachmentByMapping(messages, mapping) };
            },
            defaultValue: { type: 'f', code: "context.mapping?.['url'] ?? context.mapping?.['href']" },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: { type: 'formula', tooltip: 'Formula that returns the attachment URL' },
            propertyHelp: {
                tooltip:
                    'Mapping to the file URL in your **Attachments** data.\n\n**Example mapping:** `context.mapping?.["url"]`\n\n**Example value:** `"https://example.com/file.pdf"`',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => {
                const hasMessages = !!boundProps?.messages;
                const hasAttachmentsMapping = !!content?.mappingAttachments?.code;
                return !(hasMessages && hasAttachmentsMapping);
            },
        },
        mappingAttachmentType: {
            label: { en: 'MIME Type' },
            type: 'Formula',
            options: content => {
                const messages = Array.isArray(content.messages) ? content.messages : [];
                const mapping = content?.mappingAttachments;
                return { template: __pickFirstAttachmentByMapping(messages, mapping) };
            },
            defaultValue: { type: 'f', code: "context.mapping?.['type'] ?? context.mapping?.['mime']" },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: { type: 'formula', tooltip: 'Formula that returns the attachment MIME type' },
            propertyHelp: {
                tooltip:
                    'Mapping to the MIME type in your **Attachments** data.\n\n**Example mapping:** `context.mapping?.["type"]`\n\n**Example value:** `"image/png"`',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => {
                const hasMessages = !!boundProps?.messages;
                const hasAttachmentsMapping = !!content?.mappingAttachments?.code;
                return !(hasMessages && hasAttachmentsMapping);
            },
        },
        mappingAttachmentSize: {
            label: { en: 'Size (bytes)' },
            type: 'Formula',
            options: content => {
                const messages = Array.isArray(content.messages) ? content.messages : [];
                const mapping = content?.mappingAttachments;
                return { template: __pickFirstAttachmentByMapping(messages, mapping) };
            },
            defaultValue: { type: 'f', code: "context.mapping?.['size']" },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: { type: 'formula', tooltip: 'Formula that returns the attachment size in bytes' },
            propertyHelp: {
                tooltip:
                    'Mapping to the size in your **Attachments** data.\n\n**Example mapping:** `context.mapping?.["size"]`\n\n**Example value:** `204800`',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => {
                const hasMessages = !!boundProps?.messages;
                const hasAttachmentsMapping = !!content?.mappingAttachments?.code;
                return !(hasMessages && hasAttachmentsMapping);
            },
        },

        // Streaming
        isStreaming: {
            label: { en: 'Is Streaming' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false,
            /* wwEditor:start */
            propertyHelp: {
                tooltip:
                    'Controls visibility of the temporary assistant streaming bubble. Set **`true`** while generating.\n\nPossible values: **`true`**, **`false`**',
            },
            /* wwEditor:end */
        },
        streamingText: {
            label: { en: 'Streaming Text' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: '',
            hidden: content => !content.isStreaming,
            /* wwEditor:start */
            propertyHelp: {
                tooltip:
                    'Live content being streamed from your AI API while **Is Streaming** is **`true`**.\n\nExample: **`…`**, **`Typing…`**, **`The answer is…`**',
            },
            /* wwEditor:end */
        },
    },
};
