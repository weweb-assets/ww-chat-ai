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
            [
                'messagesAreaTitle',
                'messagesAreaBgColor',
                'messagesAreaPadding',
                'emptyMessageText',
                'emptyMessageColor',
            ],
            [
                'messageTitle',
                'messageBgColor',
                'messageTextColor',
                'messageFontSize',
                'messageFontWeight',
                'messageFontFamily',
                'messageBorder',
                'messageRadius',
                'ownMessageTitle',
                'ownMessageBgColor',
                'ownMessageTextColor',
                'ownMessageFontSize',
                'ownMessageFontWeight',
                'ownMessageFontFamily',
                'ownMessageBorder',
                'ownMessageRadius',
            ],
            [
                'inputAreaTitle',
                'inputBgColor',
                'inputAreaBorder',
                'textAreaTitle',
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
            ['sendTitle', 'sendIcon', 'sendIconColor', 'sendIconSize'],
            [
                'sendButtonTitle',
                'sendButtonBgColor',
                'sendButtonHoverBgColor',
                'sendButtonBorder',
                'sendButtonBorderRadius',
                'sendButtonSize',
                'sendButtonBoxShadow',
            ],
        ],
        customSettingsPropertiesOrder: [
            [
                'chatSettingsTitle',
                'userLabel',
                'assistantLabel',
                'disabled',
                'enableMarkdown',
                'allowAttachments',
                'autoScrollBehavior',
            ],
            [
                'chatDataTitle',
                'messages',
                'mappingMessageId',
                'mappingMessageText',
                'mappingRole',
                'mappingTimestamp',
                'mappingAttachments',
                'attachmentsDataTitle',
                'mappingAttachmentId',
                'mappingAttachmentName',
                'mappingAttachmentUrl',
                'mappingAttachmentType',
                'mappingAttachmentSize',
            ],
            ['streamingTitle', 'isStreaming', 'streamingText'],
        ],
    },
    triggerEvents: [
        {
            name: 'messageSent',
            label: { en: 'On message sent' },
            event: {
                message: {
                    id: 'msg-1',
                    text: 'Hello there!',
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
                    text: 'New assistant message received',
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
                    text: 'Message content',
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
            responsive: true,
            defaultValue: 'inherit',
        },

        // Messages area styles
        messagesAreaTitle: {
            type: 'Title',
            label: { en: 'Messages Area' },
            section: 'style',
        },
        messagesAreaBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '#ffffff',
        },
        messagesAreaPadding: {
            label: { en: 'Padding' },
            type: 'Spacing',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '16px',
        },
        emptyMessageText: {
            label: { en: 'Empty Message Text' },
            type: 'Text',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: 'No messages yet',
        },
        emptyMessageColor: {
            label: { en: 'Empty Message Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '#64748b',
        },

        // Message styles (AI/Assistant messages - no bubble by default)
        messageTitle: {
            type: 'Title',
            label: { en: 'Assistant Messages' },
            section: 'style',
        },
        messageBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: 'transparent',
        },
        messageTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '#334155',
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
            responsive: true,
            defaultValue: '0.875rem',
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
            responsive: true,
            defaultValue: '400',
        },
        messageFontFamily: {
            label: { en: 'Font Family' },
            type: 'FontFamily',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: 'inherit',
        },
        messageBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: 'none',
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
            responsive: true,
            defaultValue: '12px 12px 12px 12px',
        },

        // User message styles (with bubble)
        ownMessageTitle: {
            type: 'Title',
            label: { en: 'User Messages' },
            section: 'style',
        },
        ownMessageBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '#f4f4f4',
        },
        ownMessageTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '#1e1e1e',
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
            responsive: true,
            defaultValue: '0.875rem',
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
            responsive: true,
            defaultValue: '400',
        },
        ownMessageFontFamily: {
            label: { en: 'Font Family' },
            type: 'FontFamily',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: 'inherit',
        },
        ownMessageBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '1px solid #d0d0d0',
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
            responsive: true,
            defaultValue: '18px 18px 18px 18px',
        },

        // Input styles
        inputAreaTitle: {
            type: 'Title',
            label: { en: 'Input Area' },
            section: 'style',
        },
        inputBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '#ffffff',
        },
        inputAreaBorder: {
            label: { en: 'Area Border Top' },
            type: 'Border',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '1px solid #e2e8f0',
        },
        textAreaTitle: {
            type: 'Title',
            label: { en: 'Text Area' },
            section: 'style',
        },
        textareaBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '1px solid #e2e8f0',
        },
        textareaBorderHover: {
            label: { en: 'Border (Hover)' },
            type: 'Border',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '1px solid #cbd5e1',
        },
        textareaBorderFocus: {
            label: { en: 'Border (Focus)' },
            type: 'Border',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '1px solid #3b82f6',
        },
        inputTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '#334155',
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
            responsive: true,
            defaultValue: '0.875rem',
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
            responsive: true,
            defaultValue: '400',
        },
        inputFontFamily: {
            label: { en: 'Font Family' },
            type: 'FontFamily',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: 'inherit',
        },
        inputPlaceholderColor: {
            label: { en: 'Placeholder Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '#94a3b8',
        },
        inputHeight: {
            label: { en: 'Height' },
            type: 'Length',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '38px',
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
            responsive: true,
            defaultValue: '8px',
        },
        inputPlaceholder: {
            label: { en: 'Placeholder' },
            type: 'Text',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: 'Message...',
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
            responsive: true,
            defaultValue: 'end',
        },

        // Send icon
        sendTitle: {
            type: 'Title',
            label: { en: 'Send Icon' },
            section: 'style',
        },
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
            responsive: true,
            defaultValue: '#334155',
        },
        sendIconSize: {
            label: { en: 'Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '20px',
        },

        // Send button styles
        sendButtonTitle: {
            type: 'Title',
            label: { en: 'Send Button' },
            section: 'style',
        },
        sendButtonBgColor: {
            label: { en: 'Background' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        },
        sendButtonHoverBgColor: {
            label: { en: 'Background (Hover)' },
            type: 'Color',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        },
        sendButtonBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: 'none',
        },
        sendButtonBorderRadius: {
            label: { en: 'Border Radius' },
            type: 'Length',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '12px',
        },
        sendButtonSize: {
            label: { en: 'Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '42px',
        },
        sendButtonBoxShadow: {
            label: { en: 'Shadow' },
            type: 'Shadows',
            section: 'style',
            bindable: true,
            responsive: true,
            defaultValue: '0 2px 4px rgba(59, 130, 246, 0.3)',
        },

        // ======== SETTINGS ========

        chatSettingsTitle: {
            type: 'Title',
            label: { en: 'Chat Settings' },
            section: 'settings',
        },
        userLabel: {
            label: { en: 'User Label' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'You',
        },
        assistantLabel: {
            label: { en: 'Assistant Label' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'Assistant',
        },
        disabled: {
            label: { en: 'Disabled' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false,
        },
        enableMarkdown: {
            label: { en: 'Enable Markdown' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false,
        },
        allowAttachments: {
            label: { en: 'Allow Attachments' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false,
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
        },

        // Chat data
        chatDataTitle: {
            type: 'Title',
            label: { en: 'Chat Data' },
            section: 'settings',
        },
        messages: {
            label: { en: 'Messages' },
            type: 'Info',
            section: 'settings',
            bindable: true,
            bindingValidation: {
                type: 'array',
                tooltip: 'Array of message objects: [{ text: string, role: "user"|"assistant", timestamp?: string }]',
            },
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
                    'Mapping to the unique message ID in your Messages data.\n\nExample mapping: context.mapping?.["id"]\nExample value: "msg-1"',
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
                code: "context.mapping?.['text']",
            },
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: {
                type: 'formula',
                tooltip: 'Formula to extract the message text from each message object',
            },
            propertyHelp: {
                tooltip:
                    'Mapping to the text content in your Messages data.\n\nExample mapping: context.mapping?.["text"]\nExample value: "Hello, how can I help?"',
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
                    'Mapping to the role in your Messages data.\n\nExample mapping: context.mapping?.["role"]\nExample values: "user" or "assistant"',
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
                    'Mapping to the timestamp in your Messages data.\n\nExample mapping: context.mapping?.["timestamp"]\nExample value: "2025-10-02T10:30:00Z"',
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
                    'Mapping to the attachments in your Messages data.\n\nExample mapping: context.mapping?.["attachments"]\nExample value: [{ id: "file-1", name: "image.png", type: "image/png", size: 204800, url: "https://example.com/file.png" }]',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => !boundProps.messages,
        },

        // Attachments Data
        attachmentsDataTitle: {
            type: 'Title',
            label: { en: 'Attachments Data' },
            section: 'settings',
            hidden: (content, _, boundProps) => {
                const hasMessages = !!boundProps?.messages;
                const hasAttachmentsMapping = !!content?.mappingAttachments?.code;
                return !(hasMessages && hasAttachmentsMapping);
            },
        },
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
                    'Mapping to the unique ID in your Attachments data.\n\nExample mapping: context.mapping?.["id"]\nExample value: "file-1"',
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
                    'Mapping to the display name in your Attachments data.\n\nExample mapping: context.mapping?.["name"]\nExample value: "report.pdf"',
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
                    'Mapping to the file URL in your Attachments data.\n\nExample mapping: context.mapping?.["url"]\nExample value: "https://example.com/file.pdf"',
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
                    'Mapping to the MIME type in your Attachments data.\n\nExample mapping: context.mapping?.["type"]\nExample value: "image/png"',
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
                    'Mapping to the size in your Attachments data.\n\nExample mapping: context.mapping?.["size"]\nExample value: 204800',
            },
            /* wwEditor:end */
            hidden: (content, _, boundProps) => {
                const hasMessages = !!boundProps?.messages;
                const hasAttachmentsMapping = !!content?.mappingAttachments?.code;
                return !(hasMessages && hasAttachmentsMapping);
            },
        },

        // Streaming
        streamingTitle: {
            type: 'Title',
            label: { en: 'Streaming' },
            section: 'settings',
        },
        isStreaming: {
            label: { en: 'Is Streaming' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false,
        },
        streamingText: {
            label: { en: 'Streaming Text' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: '',
            hidden: content => !content.isStreaming,
        },
    },
};
