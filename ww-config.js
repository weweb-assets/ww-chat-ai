export default {
    editor: {
        label: { en: 'Chat' },
        icon: 'chat',
        customStylePropertiesOrder: [
            // Container styles
            [
                'containerTitle',
                'backgroundColor',
                'containerBorder',
                'containerBorderRadius',
                'containerShadow',
                'fontFamily',
            ],
            // Header styles
            [
                'headerTitle',
                'headerBgColor',
                'headerTextColor',
                'headerBorder',
                'headerBoxShadow',
                'headerPadding',
                'headerNameFontSize',
                'headerNameFontWeight',
                'headerLocationFontSize',
                'headerLocationOpacity',
                'headerCloseButtonColor',
                'headerCloseButtonBgHover',
            ],
            // Messages area styles
            [
                'messagesAreaTitle',
                'messagesAreaBgColor',
                'messagesAreaPadding',
                'messagesAreaHeight',
                'emptyMessageText',
                'emptyMessageColor',
                'dateSeparatorTitle',
                'dateSeparatorTextColor',
                'dateSeparatorLineColor',
                'dateSeparatorBgColor',
                'dateSeparatorBorderRadius',
            ],
            // Message styles
            [
                'messageTitle',
                'messageBgColor',
                'messageTextColor',
                'messageBorder',
                'ownMessageTitle',
                'ownMessageBgColor',
                'ownMessageTextColor',
                'ownMessageBorder',
            ],
            // Input styles
            [
                'inputAreaTitle',
                'inputBgColor',
                'inputTextColor',
                'inputPlaceholderColor',
                'inputBorder',
                'inputMaxHeight',
                'inputMinHeight',
                'inputBorderRadius',
            ],
            // Icons
            [
                'iconsTitle',
                'sendIcon',
                'sendIconColor',
                'sendIconSize',
                'attachmentIcon',
                'attachmentIconColor',
                'attachmentIconSize',
            ],
        ],
        customSettingsPropertiesOrder: [
            // User settings
            ['userSettingsTitle', 'userName', 'userAvatar', 'userLocation', 'userStatus', 'currentUserId'],
            // Chat settings
            ['chatSettingsTitle', 'displayHeader', 'allowAttachments', 'inputPlaceholder', 'disabled'],
            // Chat data
            ['chatDataTitle', 'chatHistory'],
            // Message data mapping
            [
                'messageDataTitle',
                'mappingMessageId',
                'mappingMessageText',
                'mappingSenderId',
                'mappingUserName',
                'mappingTimestamp',
                'mappingAttachments',
            ],
        ],
    },
    properties: {
        // ======== APPEARANCE ========

        // Container styles
        containerTitle: {
            type: 'Title',
            label: { en: 'Container' },
            section: 'style',
        },
        backgroundColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#f5f7fb',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Background color of the chat container',
            },
            /* wwEditor:end */
        },
        containerBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            defaultValue: '1px solid #e2e8f0',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Border of the chat container',
            },
            /* wwEditor:end */
        },
        containerBorderRadius: {
            label: { en: 'Border Radius' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '8px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Border radius of the chat container',
            },
            /* wwEditor:end */
        },
        containerShadow: {
            label: { en: 'Shadow' },
            type: 'Shadows',
            section: 'style',
            bindable: true,
            defaultValue: '0 2px 8px rgba(0, 0, 0, 0.05)',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Box shadow of the chat container',
            },
            /* wwEditor:end */
        },
        fontFamily: {
            label: { en: 'Font Family' },
            type: 'FontFamily',
            section: 'style',
            bindable: true,
            defaultValue: 'inherit',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Font family used throughout the chat',
            },
            /* wwEditor:end */
        },

        // Header styles
        headerTitle: {
            type: 'Title',
            label: { en: 'Header' },
            section: 'style',
        },
        headerBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#ffffff',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Background color of the chat header',
            },
            /* wwEditor:end */
        },
        headerTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#1e293b',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Text color in the chat header',
            },
            /* wwEditor:end */
        },
        headerBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            defaultValue: '1px solid #e2e8f0',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Border of the chat header',
            },
            /* wwEditor:end */
        },
        headerBoxShadow: {
            label: { en: 'Shadow' },
            type: 'Shadows',
            section: 'style',
            bindable: true,
            defaultValue: '0 1px 2px rgba(0, 0, 0, 0.05)',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Box shadow of the chat header',
            },
            /* wwEditor:end */
        },
        headerPadding: {
            label: { en: 'Padding' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '12px 16px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Padding of the chat header',
            },
            /* wwEditor:end */
        },
        headerNameFontSize: {
            label: { en: 'Name Font Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '1rem',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Font size of the user name in header',
            },
            /* wwEditor:end */
        },
        headerNameFontWeight: {
            label: { en: 'Name Font Weight' },
            type: 'TextWeight',
            section: 'style',
            bindable: true,
            defaultValue: '600',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Font weight of the user name in header',
            },
            /* wwEditor:end */
        },
        headerLocationFontSize: {
            label: { en: 'Location Font Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '0.875rem',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Font size of the location text in header',
            },
            /* wwEditor:end */
        },
        headerLocationOpacity: {
            label: { en: 'Location Opacity' },
            type: 'Number',
            options: {
                min: 0,
                max: 1,
                step: 0.1,
            },
            section: 'style',
            bindable: true,
            defaultValue: 0.7,
            /* wwEditor:start */
            bindingValidation: {
                type: 'number',
                tooltip: 'Opacity of the location text in header',
            },
            /* wwEditor:end */
        },
        headerCloseButtonColor: {
            label: { en: 'Close Button Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Color of the close button (leave empty to inherit from header text color)',
            },
            /* wwEditor:end */
        },
        headerCloseButtonBgHover: {
            label: { en: 'Close Button Hover BG' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: 'rgba(0, 0, 0, 0.05)',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Background color of the close button on hover',
            },
            /* wwEditor:end */
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
            defaultValue: '#ffffff',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Background color of the messages area',
            },
            /* wwEditor:end */
        },
        messagesAreaPadding: {
            label: { en: 'Padding' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '16px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Padding of the messages area',
            },
            /* wwEditor:end */
        },
        messagesAreaHeight: {
            label: { en: 'Height' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: 'auto',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Specific height for the messages area (use "auto" to fill available space)',
            },
            /* wwEditor:end */
        },
        emptyMessageText: {
            label: { en: 'Empty Message Text' },
            type: 'Text',
            section: 'style',
            bindable: true,
            defaultValue: 'No messages yet',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Text to display when there are no messages',
            },
            /* wwEditor:end */
        },
        emptyMessageColor: {
            label: { en: 'Empty Message Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#64748b',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Color of the empty message text',
            },
            /* wwEditor:end */
        },
        dateSeparatorTitle: {
            type: 'Title',
            label: { en: 'Date Separator' },
            section: 'style',
        },
        dateSeparatorTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#64748b',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Text color of the date separator',
            },
            /* wwEditor:end */
        },
        dateSeparatorLineColor: {
            label: { en: 'Line Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#e2e8f0',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Color of the date separator divider line',
            },
            /* wwEditor:end */
        },
        dateSeparatorBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#ffffff',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Background color behind the date text',
            },
            /* wwEditor:end */
        },
        dateSeparatorBorderRadius: {
            label: { en: 'Border Radius' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '4px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Border radius of the date separator',
            },
            /* wwEditor:end */
        },

        // Message styles
        messageTitle: {
            type: 'Title',
            label: { en: "Others' Messages" },
            section: 'style',
        },
        messageBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#f1f5f9',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Background color of messages from others',
            },
            /* wwEditor:end */
        },
        messageTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#334155',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Text color of messages from others',
            },
            /* wwEditor:end */
        },
        messageBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            defaultValue: '1px solid #e2e8f0',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Border of messages from others',
            },
            /* wwEditor:end */
        },

        // Own message styles
        ownMessageTitle: {
            type: 'Title',
            label: { en: 'Your Messages' },
            section: 'style',
        },
        ownMessageBgColor: {
            label: { en: 'Background Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#dbeafe',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Background color of your own messages',
            },
            /* wwEditor:end */
        },
        ownMessageTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#1e40af',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Text color of your own messages',
            },
            /* wwEditor:end */
        },
        ownMessageBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            defaultValue: '1px solid #bfdbfe',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Border of your own messages',
            },
            /* wwEditor:end */
        },

        // Input area styles
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
            defaultValue: '#ffffff',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Background color of the message input',
            },
            /* wwEditor:end */
        },
        inputTextColor: {
            label: { en: 'Text Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#334155',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Text color of the message input',
            },
            /* wwEditor:end */
        },
        inputPlaceholderColor: {
            label: { en: 'Placeholder Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#94a3b8',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Placeholder text color in the message input',
            },
            /* wwEditor:end */
        },
        inputBorder: {
            label: { en: 'Border' },
            type: 'Border',
            section: 'style',
            bindable: true,
            defaultValue: '1px solid #e2e8f0',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Border of the message input',
            },
            /* wwEditor:end */
        },
        inputMaxHeight: {
            label: { en: 'Input Max Height' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '120px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Maximum height of the input area before scrolling',
            },
            /* wwEditor:end */
        },
        inputMinHeight: {
            label: { en: 'Input Min Height' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '38px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Minimum height of the input area',
            },
            /* wwEditor:end */
        },
        inputBorderRadius: {
            label: { en: 'Input Border Radius' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '20px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Border radius of the input field',
            },
            /* wwEditor:end */
        },

        // Icon properties
        iconsTitle: {
            type: 'Title',
            label: { en: 'Icons' },
            section: 'style',
        },
        sendIcon: {
            label: { en: 'Send Icon' },
            type: 'SystemIcon',
            section: 'style',
            bindable: true,
            defaultValue: 'send',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Icon for the send button',
            },
            /* wwEditor:end */
        },
        sendIconColor: {
            label: { en: 'Send Icon Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#334155',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Color of the send button icon',
            },
            /* wwEditor:end */
        },
        sendIconSize: {
            label: { en: 'Send Icon Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '20px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Size of the send button icon',
            },
            /* wwEditor:end */
        },
        attachmentIcon: {
            label: { en: 'Attachment Icon' },
            type: 'SystemIcon',
            section: 'style',
            bindable: true,
            defaultValue: 'paperclip',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Icon for the attachment button',
            },
            /* wwEditor:end */
        },
        attachmentIconColor: {
            label: { en: 'Attachment Icon Color' },
            type: 'Color',
            section: 'style',
            bindable: true,
            defaultValue: '#334155',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Color of the attachment button icon',
            },
            /* wwEditor:end */
        },
        attachmentIconSize: {
            label: { en: 'Attachment Icon Size' },
            type: 'Length',
            section: 'style',
            bindable: true,
            defaultValue: '20px',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Size of the attachment button icon',
            },
            /* wwEditor:end */
        },

        // ======== SETTINGS ========

        // User settings
        userSettingsTitle: {
            type: 'Title',
            label: { en: 'User Settings' },
            section: 'settings',
        },
        userName: {
            label: { en: 'User Name' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'User',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Name to display for the current user',
            },
            /* wwEditor:end */
        },
        userAvatar: {
            label: { en: 'User Avatar URL' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: '',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'URL of the user avatar image (initials will be used if empty)',
            },
            /* wwEditor:end */
        },
        userLocation: {
            label: { en: 'User Location' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: '',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Location to display under the user name (optional)',
            },
            /* wwEditor:end */
        },
        userStatus: {
            label: { en: 'User Status' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'online', label: { en: 'Online' } },
                    { value: 'offline', label: { en: 'Offline' } },
                    { value: 'away', label: { en: 'Away' } },
                    { value: 'busy', label: { en: 'Busy' } },
                ],
            },
            section: 'settings',
            bindable: true,
            defaultValue: 'online',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                enum: ['online', 'offline', 'away', 'busy'],
                tooltip: 'Current status of the user',
            },
            /* wwEditor:end */
        },
        currentUserId: {
            label: { en: 'Current User ID' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'current-user',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Unique identifier for the current user (used to identify your messages)',
            },
            /* wwEditor:end */
        },

        // Chat settings
        chatSettingsTitle: {
            type: 'Title',
            label: { en: 'Chat Settings' },
            section: 'settings',
        },
        displayHeader: {
            label: { en: 'Display Header' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'boolean',
                tooltip: 'Whether to display the chat header',
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
            bindingValidation: {
                type: 'boolean',
                tooltip: 'Whether to allow file attachments',
            },
            /* wwEditor:end */
        },
        inputPlaceholder: {
            label: { en: 'Input Placeholder' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'Type a message...',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'Placeholder text for the message input',
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
            bindingValidation: {
                type: 'boolean',
                tooltip: 'Whether the chat component is disabled',
            },
            /* wwEditor:end */
        },

        // Chat data
        chatDataTitle: {
            type: 'Title',
            label: { en: 'Chat Data' },
            section: 'settings',
        },
        chatHistory: {
            label: { en: 'Chat History' },
            type: 'Array',
            section: 'settings',
            bindable: true,
            defaultValue: [],
            options: {
                item: {
                    type: 'Object',
                    defaultValue: {
                        id: 'msg-1',
                        text: 'Hello there!',
                        senderId: 'user-1',
                        userName: 'John Doe',
                        timestamp: new Date().toISOString(),
                    },
                    options: {
                        item: {
                            id: {
                                label: { en: 'Message ID' },
                                type: 'Text',
                            },
                            text: {
                                label: { en: 'Message Text' },
                                type: 'Textarea',
                            },
                            senderId: {
                                label: { en: 'Sender ID' },
                                type: 'Text',
                            },
                            userName: {
                                label: { en: 'Sender Name' },
                                type: 'Text',
                            },
                            timestamp: {
                                label: { en: 'Timestamp' },
                                type: 'Text',
                            },
                            attachments: {
                                label: { en: 'Attachments' },
                                type: 'Array',
                                options: {
                                    item: {
                                        type: 'Object',
                                        options: {
                                            item: {
                                                id: {
                                                    label: { en: 'ID' },
                                                    type: 'Text',
                                                },
                                                name: {
                                                    label: { en: 'Name' },
                                                    type: 'Text',
                                                },
                                                type: {
                                                    label: { en: 'MIME Type' },
                                                    type: 'Text',
                                                },
                                                size: {
                                                    label: { en: 'Size (bytes)' },
                                                    type: 'Number',
                                                },
                                                url: {
                                                    label: { en: 'URL' },
                                                    type: 'Text',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            /* wwEditor:start */
            bindingValidation: {
                type: 'array',
                tooltip: 'Array of message objects for the chat history',
            },
            /* wwEditor:end */
        },
        messageDataTitle: {
            type: 'Title',
            label: { en: 'Message Data Mapping' },
            section: 'settings',
        },
        mappingMessageId: {
            label: { en: 'Message ID Mapping' },
            type: 'Formula',
            options: content => ({
                template:
                    Array.isArray(content.chatHistory) && content.chatHistory.length ? content.chatHistory[0] : null,
            }),
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['id']",
            },
            section: 'settings',
            /* wwEditor:start */
            propertyHelp: {
                tooltip:
                    'Formula to extract the message ID from your data structure. Will be executed for each message in the chat history.',
            },
            /* wwEditor:end */
        },
        mappingMessageText: {
            label: { en: 'Message Text Mapping' },
            type: 'Formula',
            options: content => ({
                template:
                    Array.isArray(content.chatHistory) && content.chatHistory.length ? content.chatHistory[0] : null,
            }),
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['text']",
            },
            section: 'settings',
            /* wwEditor:start */
            propertyHelp: {
                tooltip:
                    'Formula to extract the message text from your data structure. Will be executed for each message in the chat history.',
            },
            /* wwEditor:end */
        },
        mappingSenderId: {
            label: { en: 'Sender ID Mapping' },
            type: 'Formula',
            options: content => ({
                template:
                    Array.isArray(content.chatHistory) && content.chatHistory.length ? content.chatHistory[0] : null,
            }),
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['senderId']",
            },
            section: 'settings',
            /* wwEditor:start */
            propertyHelp: {
                tooltip:
                    'Formula to extract the sender ID from your data structure. Will be executed for each message in the chat history.',
            },
            /* wwEditor:end */
        },
        mappingUserName: {
            label: { en: 'User Name Mapping' },
            type: 'Formula',
            options: content => ({
                template:
                    Array.isArray(content.chatHistory) && content.chatHistory.length ? content.chatHistory[0] : null,
            }),
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['userName']",
            },
            section: 'settings',
            /* wwEditor:start */
            propertyHelp: {
                tooltip:
                    'Formula to extract the user name from your data structure. Will be executed for each message in the chat history.',
            },
            /* wwEditor:end */
        },
        mappingTimestamp: {
            label: { en: 'Timestamp Mapping' },
            type: 'Formula',
            options: content => ({
                template:
                    Array.isArray(content.chatHistory) && content.chatHistory.length ? content.chatHistory[0] : null,
            }),
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['timestamp']",
            },
            section: 'settings',
            /* wwEditor:start */
            propertyHelp: {
                tooltip:
                    'Formula to extract the timestamp from your data structure. Will be executed for each message in the chat history.',
            },
            /* wwEditor:end */
        },
        mappingAttachments: {
            label: { en: 'Attachments Mapping' },
            type: 'Formula',
            options: content => ({
                template:
                    Array.isArray(content.chatHistory) && content.chatHistory.length ? content.chatHistory[0] : null,
            }),
            defaultValue: {
                type: 'f',
                code: "context.mapping?.['attachments']",
            },
            section: 'settings',
            /* wwEditor:start */
            propertyHelp: {
                tooltip:
                    'Formula to extract the attachments from your data structure. Will be executed for each message in the chat history.',
            },
            /* wwEditor:end */
        },
    },
    triggerEvents: [
        {
            name: 'messageSent',
            label: { en: 'On message sent' },
            event: {
                message: {
                    id: 'msg-1',
                    text: 'Hello there!',
                    senderId: 'current-user',
                    userName: 'User',
                    timestamp: new Date().toISOString(),
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
            name: 'close',
            label: { en: 'On close' },
            event: {},
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
        {
            action: 'clearMessages',
            label: { en: 'Clear messages' },
        },
        {
            action: 'addMessage',
            label: { en: 'Add message' },
            args: [
                {
                    name: 'message',
                    type: 'object',
                    label: { en: 'Message' },
                    options: {
                        item: {
                            text: { type: 'string', label: { en: 'Text' } },
                            senderId: { type: 'string', label: { en: 'Sender ID' } },
                            userName: { type: 'string', label: { en: 'Sender Name' } },
                        },
                    },
                },
            ],
        },
    ],
};
