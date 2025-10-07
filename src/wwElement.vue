<template>
    <div ref="chatRoot" class="ww-chat-ai" :class="{ 'ww-chat-ai--disabled': isDisabled }" :style="containerStyles">
        <!-- Messages Area -->
        <div ref="messagesContainer" class="ww-chat-ai__messages" :style="messagesContainerStyles">
            <MessageList
                :messages="messages"
                :current-user-id="'user'"
                :user-label="userLabel"
                :assistant-label="assistantLabel"
                :is-streaming="isStreaming"
                :streaming-text="streamingText"
                :enable-markdown="enableMarkdown"
                :message-bg-color="messageBgColor"
                :message-text-color="messageTextColor"
                :message-font-size="messageFontSize"
                :message-font-weight="messageFontWeight"
                :message-font-family="messageFontFamily"
                :message-border="messageBorder"
                :message-radius="messageRadius"
                :own-message-bg-color="ownMessageBgColor"
                :own-message-text-color="ownMessageTextColor"
                :own-message-font-size="ownMessageFontSize"
                :own-message-font-weight="ownMessageFontWeight"
                :own-message-font-family="ownMessageFontFamily"
                :own-message-border="ownMessageBorder"
                :own-message-radius="ownMessageRadius"
                :empty-message-text="emptyMessageText"
                :empty-message-color="emptyMessageColor"
                :date-separator-text-color="dateSeparatorTextColor"
                :date-separator-line-color="dateSeparatorLineColor"
                :date-separator-bg-color="dateSeparatorBgColor"
                :date-separator-border-radius="dateSeparatorBorderRadius"
                @attachment-click="handleAttachmentClick"
                @message-right-click="handleMessageRightClick"
            />
        </div>

        <!-- Input Area -->
        <InputArea
            v-model="newMessage"
            :is-disabled="isDisabled"
            :allow-attachments="allowAttachments"
            :pending-attachments="pendingAttachments"
            :input-bg-color="inputBgColor"
            :input-text-color="inputTextColor"
            :input-font-size="inputFontSize"
            :input-font-weight="inputFontWeight"
            :input-font-family="inputFontFamily"
            :input-placeholder-color="inputPlaceholderColor"
            :input-area-border="inputAreaBorder"
            :textarea-border="textareaBorder"
            :textarea-border-hover="textareaBorderHover"
            :textarea-border-focus="textareaBorderFocus"
            :input-height="inputHeight"
            :input-border-radius="inputBorderRadius"
            :placeholder="inputPlaceholder"
            :action-align="actionAlign"
            :send-icon="sendIcon"
            :send-icon-color="sendIconColor"
            :send-icon-size="sendIconSize"
            :attachment-icon="attachmentIcon"
            :attachment-icon-color="attachmentIconColor"
            :attachment-icon-size="attachmentIconSize"
            :remove-icon="removeIcon"
            :remove-icon-color="removeIconColor"
            :remove-icon-size="removeIconSize"
            :send-button-bg-color="sendButtonBgColor"
            :send-button-hover-bg-color="sendButtonHoverBgColor"
            :send-button-border="sendButtonBorder"
            :send-button-border-radius="sendButtonBorderRadius"
            :send-button-size="sendButtonSize"
            :send-button-box-shadow="sendButtonBoxShadow"
            :attachment-button-bg-color="attachmentButtonBgColor"
            :attachment-button-hover-bg-color="attachmentButtonHoverBgColor"
            :attachment-button-border="attachmentButtonBorder"
            :attachment-button-border-radius="attachmentButtonBorderRadius"
            :attachment-button-size="attachmentButtonSize"
            :attachment-button-box-shadow="attachmentButtonBoxShadow"
            @send="sendMessage"
            @attachment="handleAttachment"
            @remove-attachment="handleRemoveAttachment"
            @pending-attachment-click="handlePendingAttachmentClick"
        />
    </div>
</template>

<script>
import { ref, computed, watch, nextTick, provide, onMounted } from 'vue';
import MessageList from './components/MessageList.vue';
import InputArea from './components/InputArea.vue';

import {
    enUS,
    enGB,
    enCA,
    enAU,
    enNZ,
    enIE,
    enIN,
    enZA,
    fr,
    frCA,
    frCH,
    de,
    deAT,
    es,
    it,
    itCH,
    pt,
    ptBR,
    ru,
    ja,
    jaHira,
    zhCN as zh,
    zhHK,
    zhTW,
    ko,
    ar,
    arDZ,
    arEG,
    arMA,
    arSA,
    arTN,
    hi,
    bn,
    nl,
    nlBE,
    sv,
    nb,
    nn,
    da,
    fi,
    el,
    tr,
    cs,
    pl,
    ro,
    hu,
    vi,
    th,
    id,
    ms,
    uk,
} from 'date-fns/locale';

export default {
    name: 'ChatAI',
    components: {
        MessageList,
        InputArea,
    },
    props: {
        content: {
            type: Object,
            required: true,
        },
        /* wwEditor:start */
        wwEditorState: {
            type: Object,
            required: true,
        },
        /* wwEditor:end */
        uid: {
            type: String,
            required: true,
        },
        wwElementState: {
            type: Object,
            required: true,
        },
    },
    emits: ['trigger-event'],
    setup(props, { emit }) {
        const chatRoot = ref(null);
        const messagesContainer = ref(null);
        const newMessage = ref('');
        const isScrolling = ref(false);
        const pendingAttachments = ref([]);

        const debounce = (func, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(null, args), delay);
            };
        };

        const { value: chatState, setValue: setChatState } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'chatState',
            type: 'object',
            defaultValue: {
                messages: [],
                utils: { messageCount: 0, isDisabled: false },
            },
        });

        const { resolveMappingFormula } = wwLib.wwFormula.useFormula();

        const resolveMapping = (message, mappingFormula, defaultProp) => {
            if (!message || typeof message !== 'object') return '';
            if (!mappingFormula) return message[defaultProp];
            return resolveMappingFormula(mappingFormula, message);
        };

        const isEditing = computed(() => {
            /* wwEditor:start */
            return props.wwEditorState.isEditing;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        });

        // Labels for user and assistant
        const userLabel = computed(() => props.content?.userLabel || 'You');
        const assistantLabel = computed(() => props.content?.assistantLabel || 'Assistant');
        const isStreaming = computed(() => props.content?.isStreaming || false);
        const streamingText = computed(() => props.content?.streamingText || '');
        const rawMessages = computed(() => {
            // Ensure we always have an array to work with
            const messagesContent = props.content?.messages;

            // Check if messages is a valid array
            if (Array.isArray(messagesContent)) {
                return messagesContent;
            }

            // Final fallback to empty array
            return [];
        });

        const messages = computed(() => {
            const mapAttachmentField = (obj, formula, fallbackKey) => {
                if (!obj || typeof obj !== 'object') return undefined;
                if (!formula) return obj[fallbackKey];
                return resolveMappingFormula(formula, obj);
            };

            return rawMessages.value.map((message, index) => {
                if (!message || typeof message !== 'object') {
                    return {
                        id: `msg-fallback-${index}`,
                        text: '',
                        role: 'assistant',
                        timestamp: new Date().toISOString(),
                        userName: assistantLabel.value,
                        attachments: [],
                    };
                }

                const messageId = resolveMapping(message, props.content?.mappingMessageId, 'id');
                const text = resolveMapping(message, props.content?.mappingMessageText, 'text') || '';
                const role = resolveMapping(message, props.content?.mappingRole, 'role') || 'assistant';
                const timestamp = resolveMapping(message, props.content?.mappingTimestamp, 'timestamp') || new Date().toISOString();

                // Map attachments with optional field mappings
                const rawAttachments = resolveMapping(message, props.content?.mappingAttachments, 'attachments');
                let attachments;
                if (Array.isArray(rawAttachments)) {
                    attachments = rawAttachments.map(att => {
                        if (!att || typeof att !== 'object') return att;
                        return {
                            id: mapAttachmentField(att, props.content?.mappingAttachmentId, 'id'),
                            name: mapAttachmentField(att, props.content?.mappingAttachmentName, 'name'),
                            url: mapAttachmentField(att, props.content?.mappingAttachmentUrl, 'url'),
                            type: mapAttachmentField(att, props.content?.mappingAttachmentType, 'type'),
                            size: mapAttachmentField(att, props.content?.mappingAttachmentSize, 'size'),
                            // Preserve local upload File if present
                            file: att.file,
                        };
                    });
                } else {
                    attachments = rawAttachments;
                }

                // Use mapped message ID if available, or create stable ID from timestamp + text
                const stableId = messageId || `msg-${timestamp}-${text.substring(0, 20)}`.replace(/[^a-zA-Z0-9-]/g, '-');

                return {
                    id: stableId,
                    text,
                    role: role === 'user' ? 'user' : 'assistant',
                    timestamp,
                    userName: role === 'user' ? userLabel.value : assistantLabel.value,
                    attachments,
                };
            });
        });

        const isDisabled = computed(() => props.content?.disabled || false);
        const allowAttachments = computed(() => props.content?.allowAttachments || false);
        const enableMarkdown = computed(() => props.content?.enableMarkdown || false);
        const inputPlaceholder = computed(() => props.content?.inputPlaceholder || 'Message...');

        // Style properties
        const containerStyles = computed(() => ({
            fontFamily: props.content?.fontFamily || 'inherit',
        }));

        const messagesAreaPadding = computed(() => props.content?.messagesAreaPadding || '16px');

        const messagesContainerStyles = computed(() => ({
            backgroundColor: props.content?.messagesAreaBgColor || '#ffffff',
            padding: messagesAreaPadding.value,
        }));

        // Message styles
        const messageBgColor = computed(() => props.content?.messageBgColor || 'transparent');
        const messageTextColor = computed(() => props.content?.messageTextColor || '#334155');
        const messageFontSize = computed(() => props.content?.messageFontSize || '0.875rem');
        const messageFontWeight = computed(() => props.content?.messageFontWeight || '400');
        const messageFontFamily = computed(() => props.content?.messageFontFamily || 'inherit');
        const messageBorder = computed(() => props.content?.messageBorder || 'none');
        const messageRadius = computed(() => props.content?.messageRadius || '12px 12px 12px 12px');

        const ownMessageBgColor = computed(() => props.content?.ownMessageBgColor || '#f4f4f4');
        const ownMessageTextColor = computed(() => props.content?.ownMessageTextColor || '#1e1e1e');
        const ownMessageFontSize = computed(() => props.content?.ownMessageFontSize || '0.875rem');
        const ownMessageFontWeight = computed(() => props.content?.ownMessageFontWeight || '400');
        const ownMessageFontFamily = computed(() => props.content?.ownMessageFontFamily || 'inherit');
        const ownMessageBorder = computed(() => props.content?.ownMessageBorder || '1px solid #d0d0d0');
        const ownMessageRadius = computed(() => props.content?.ownMessageRadius || '18px 18px 18px 18px');

        // Input styles
        const inputBgColor = computed(() => props.content?.inputBgColor || '#ffffff');
        const inputTextColor = computed(() => props.content?.inputTextColor || '#334155');
        const inputFontSize = computed(() => props.content?.inputFontSize || '0.875rem');
        const inputFontWeight = computed(() => props.content?.inputFontWeight || '400');
        const inputFontFamily = computed(() => props.content?.inputFontFamily || 'inherit');
        const inputPlaceholderColor = computed(() => props.content?.inputPlaceholderColor || '#94a3b8');
        const inputAreaBorder = computed(() => props.content?.inputAreaBorder || '1px solid #e2e8f0');
        const textareaBorder = computed(() => props.content?.textareaBorder || '1px solid #e2e8f0');
        const textareaBorderHover = computed(() => props.content?.textareaBorderHover || '1px solid #cbd5e1');
        const textareaBorderFocus = computed(() => props.content?.textareaBorderFocus || '1px solid #3b82f6');
        const inputHeight = computed(() => props.content?.inputHeight || '38px');
        const inputBorderRadius = computed(() => props.content?.inputBorderRadius || '8px');

        // Empty message styles
        const emptyMessageText = computed(() => props.content?.emptyMessageText || 'No messages yet');
        const emptyMessageColor = computed(() => props.content?.emptyMessageColor || '#64748b');

        // Date separator styles
        const dateSeparatorTextColor = computed(() => props.content?.dateSeparatorTextColor || '#64748b');
        const dateSeparatorLineColor = computed(() => props.content?.dateSeparatorLineColor || '#e2e8f0');
        const dateSeparatorBgColor = computed(() => props.content?.dateSeparatorBgColor || '#ffffff');
        const dateSeparatorBorderRadius = computed(() => props.content?.dateSeparatorBorderRadius || '8px');

        // Messages attachments thumbnail sizing (in messages area)
        const messagesAttachmentThumbMaxWidth = computed(() => props.content?.messagesAttachmentThumbMaxWidth || '250px');
        const messagesAttachmentThumbMaxHeight = computed(() => props.content?.messagesAttachmentThumbMaxHeight || '200px');
        const messagesAttachmentThumbBorderRadius = computed(
            () => props.content?.messagesAttachmentThumbBorderRadius || '6px'
        );

        // Track if we should scroll on next streamingText update
        let scrollOnNextStream = false;
        let lastMessageCount = 0;

        watch(
            messages,
            (newMessages) => {
                // Only scroll if the number of messages changed (message added/removed)
                // Not when message content changes
                if (newMessages.length !== lastMessageCount) {
                    lastMessageCount = newMessages.length;
                    if (!isScrolling.value) scrollToBottom();
                }
            }
        );

        // Scroll when streaming starts
        watch(
            isStreaming,
            (newVal, oldVal) => {
                if (newVal && !oldVal) {
                    // Streaming just started
                    scrollOnNextStream = true;
                } else if (!newVal && oldVal) {
                    // Streaming just stopped - wait a bit for final message to be added
                    setTimeout(() => {
                        scrollToBottom();
                    }, 50);
                }
            }
        );

        // Scroll when streamingText changes during streaming
        watch(
            streamingText,
            (newVal, oldVal) => {
                // First time streaming text appears
                if (scrollOnNextStream && newVal) {
                    scrollOnNextStream = false;
                    nextTick(() => {
                        if (!isScrolling.value) scrollToBottom();
                    });
                }
                // Continue scrolling as streaming text grows (only if streaming is active)
                else if (isStreaming.value && newVal && newVal.length > (oldVal?.length || 0)) {
                    nextTick(() => {
                        if (!isScrolling.value) scrollToBottom();
                    });
                }
            }
        );

        // Removed user settings watcher and debounced updater; participants now drive user info

        const scrollToBottom = async (smooth = null) => {
            await nextTick();
            if (messagesContainer.value) {
                // Use the autoScrollBehavior setting if smooth parameter is not explicitly provided
                const behavior =
                    smooth !== null ? (smooth ? 'smooth' : 'auto') : props.content?.autoScrollBehavior || 'auto';

                messagesContainer.value.scrollTo({
                    top: messagesContainer.value.scrollHeight,
                    behavior: behavior,
                });
            }
        };

        const sendMessage = () => {
            if (isEditing.value || isDisabled.value) return;
            if (!newMessage.value.trim() && pendingAttachments.value.length === 0) return;

            const message = {
                id: `msg-${wwLib.wwUtils.getUid()}`,
                text: newMessage.value.trim(),
                role: 'user',
                timestamp: new Date().toISOString(),
                attachments: pendingAttachments.value.map(att => ({
                    id: att.id,
                    name: att.name,
                    type: att.type,
                    size: att.size,
                    url: att.url,
                })),
            };

            newMessage.value = '';
            pendingAttachments.value = [];

            emit('trigger-event', {
                name: 'messageSent',
                event: { message },
            });
        };


        const addMessage = message => {
            if (isEditing.value) return;

            const newMessageRaw = {
                id: message.id || `msg-${wwLib.wwUtils.getUid()}`,
                text: message.text || '',
                role: message.role || 'assistant',
                timestamp: message.timestamp || new Date().toISOString(),
                ...message,
            };

            const updatedMessages = [...(chatState.value?.messages || []), newMessageRaw];
            setChatState({
                ...chatState.value,
                messages: updatedMessages,
            });

            scrollToBottom();

            return newMessageRaw;
        };

        const handleAttachment = files => {
            if (isEditing.value || isDisabled.value) return;

            const attachmentFiles = Array.from(files).map(file => ({
                id: `file-${wwLib.wwUtils.getUid()}`,
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL(file),
                file,
            }));

            pendingAttachments.value = [...pendingAttachments.value, ...attachmentFiles];
        };

        const handleRemoveAttachment = index => {
            if (isEditing.value || isDisabled.value) return;

            // Release the object URL to avoid memory leaks
            if (pendingAttachments.value[index]?.url) {
                URL.revokeObjectURL(pendingAttachments.value[index].url);
            }

            pendingAttachments.value.splice(index, 1);
        };

        const handleAttachmentClick = attachment => {
            if (isEditing.value) return;

            emit('trigger-event', {
                name: 'attachmentClick',
                event: { attachment },
            });
        };

        const handlePendingAttachmentClick = ({ attachment, index }) => {
            const file = attachment && attachment.file ? attachment.file : attachment;
            emit('trigger-event', {
                name: 'pendingAttachmentClick',
                event: { attachment: file, index },
            });
        };

        const handleMessageRightClick = ({ message, position }) => {
            if (isEditing.value) return;

            emit('trigger-event', {
                name: 'messageRightClick',
                event: { message, position },
            });
        };

        // Emit messageReceived for new external messages (not initial history, not own messages)
        let _messagesWatcherInitialized = false;
        const _seenMessageIds = new Set();
        watch(
            () => messages.value,
            newMessages => {
                if (isEditing.value) return;

                if (!_messagesWatcherInitialized) {
                    newMessages.forEach(m => {
                        if (m && m.id) _seenMessageIds.add(m.id);
                    });
                    _messagesWatcherInitialized = true;
                    return;
                }

                for (const m of newMessages) {
                    const id = m?.id;
                    if (!id) continue;
                    if (_seenMessageIds.has(id)) continue;
                    _seenMessageIds.add(id);
                    if (m.role === 'assistant') {
                        emit('trigger-event', {
                            name: 'messageReceived',
                            event: { message: m },
                        });
                    }
                }
            },
            { deep: false }
        );

        // Date/time locale configuration
        const locale = computed(() => {
            if (!props.content?.locale) return enUS;

            const locales = {
                // English variants
                enUS,
                enGB,
                enCA,
                enAU,
                enNZ,
                enIE,
                enIN,
                enZA,
                // French variants
                fr,
                frCA,
                frCH,
                // German variants
                de,
                deAT,
                // Spanish
                es,
                // Italian variants
                it,
                itCH,
                // Portuguese variants
                pt,
                ptBR,
                // Russian
                ru,
                // East Asian languages
                ja,
                jaHira,
                zh,
                zhHK,
                zhTW,
                ko,
                // Arabic variants
                ar,
                arDZ,
                arEG,
                arMA,
                arSA,
                arTN,
                // Indian subcontinent languages
                hi,
                bn,
                // Other European
                nl,
                nlBE,
                sv,
                nb,
                nn,
                da,
                fi,
                el,
                tr,
                cs,
                pl,
                ro,
                hu,
                // Southeast Asian
                vi,
                th,
                id,
                ms,
                // Other
                uk,
            };

            return locales[props.content.locale] || enUS;
        });

        const dateTimeOptions = computed(() => ({
            locale: locale.value,
            timeFormat: props.content?.timeFormat,
            todayText: props.content?.todayText,
            yesterdayText: props.content?.yesterdayText,
            justNowText: props.content?.justNowText,
        }));

        provide('dateTimeOptions', dateTimeOptions);
        provide('chatRootEl', chatRoot);

        // Local context functionality
        const currentLocalContext = ref({});

        const registerChatLocalContext = ({ data, markdown }) => {
            wwLib.wwElement.useRegisterElementLocalContext('chat', data, {}, markdown);
            currentLocalContext.value = { data, markdown };
        };

        // Chat local context data for AI chat
        const chatData = computed(() => ({
            messages: messages.value.map((message, index) => ({
                ...message,
                isOwn: message.role === 'user',
                isFirst: index === 0 || messages.value[index - 1].role !== message.role,
                isLast: index === messages.value.length - 1 || messages.value[index + 1].role !== message.role,
            })),
            utils: {
                messageCount: messages.value.length,
                isDisabled: isDisabled.value,
            },
        }));

        const chatMarkdown = `### Chat AI local information

        #### messages
        Array of all messages in the AI conversation. Each message contains:
        - \`id\`: Unique message identifier
        - \`text\`: Message content
        - \`role\`: Message role ('user' or 'assistant')
        - \`userName\`: Display name (based on role and labels)
        - \`timestamp\`: Message timestamp (ISO string)
        - \`isOwn\`: Boolean indicating if message is from user
        - \`isFirst\`: Boolean indicating if this is first message in a group from this role
        - \`isLast\`: Boolean indicating if this is last message in a group from this role

        #### utils
        Component state information:
        - \`messageCount\`: Total number of messages
        - \`isDisabled\`: Boolean indicating if chat is disabled`;

        // Sync chatState with local context data
        watch(
            chatData,
            newChatData => {
                setChatState({
                    ...newChatData,
                });
            },
            { deep: true, immediate: true }
        );

        registerChatLocalContext({
            data: chatData,
            markdown: chatMarkdown,
        });

        provide('isEditing', isEditing);
        provide('_wwChat:localContext', currentLocalContext);

        onMounted(() => {
            // Initialize message count tracker
            lastMessageCount = messages.value.length;
            // Ensure we show latest messages on mount
            scrollToBottom();
        });

        return {
            chatRoot,
            messagesContainer,
            newMessage,
            messages,
            isDisabled,
            inputPlaceholder,
            enableMarkdown,
            userLabel,
            assistantLabel,
            isStreaming,
            streamingText,

            containerStyles,
            messagesContainerStyles,
            messageBgColor,
            messageTextColor,
            messageFontSize,
            messageFontWeight,
            messageFontFamily,
            messageBorder,
            messageRadius,
            messagesAreaPadding,
            ownMessageBgColor,
            ownMessageTextColor,
            ownMessageFontSize,
            ownMessageFontWeight,
            ownMessageFontFamily,
            ownMessageBorder,
            ownMessageRadius,
            inputBgColor,
            inputTextColor,
            inputFontSize,
            inputFontWeight,
            inputFontFamily,
            inputPlaceholderColor,
            inputAreaBorder,
            textareaBorder,
            textareaBorderHover,
            textareaBorderFocus,
            inputHeight,
            inputBorderRadius,

            emptyMessageText,
            emptyMessageColor,

            dateSeparatorTextColor,
            dateSeparatorLineColor,
            dateSeparatorBgColor,
            dateSeparatorBorderRadius,

            // Icons
            sendIcon: computed(() => props.content?.sendIcon || 'send'),
            sendIconColor: computed(() => props.content?.sendIconColor || '#334155'),
            sendIconSize: computed(() => props.content?.sendIconSize || '20px'),
            attachmentIcon: computed(() => props.content?.attachmentIcon || 'paperclip'),
            attachmentIconColor: computed(() => props.content?.attachmentIconColor || '#334155'),
            attachmentIconSize: computed(() => props.content?.attachmentIconSize || '20px'),
            removeIcon: computed(() => props.content?.removeIcon || 'x'),
            removeIconColor: computed(() => props.content?.removeIconColor || '#334155'),
            removeIconSize: computed(() => props.content?.removeIconSize || '16px'),

            // Input action alignment and button styles
            actionAlign: computed(() => props.content?.inputActionAlign || 'end'),
            sendButtonBgColor: computed(() => props.content?.sendButtonBgColor || 'linear-gradient(135deg, #3b82f6, #2563eb)'),
            sendButtonHoverBgColor: computed(() => props.content?.sendButtonHoverBgColor || 'linear-gradient(135deg, #2563eb, #1d4ed8)'),
            sendButtonBorder: computed(() => props.content?.sendButtonBorder || 'none'),
            sendButtonBorderRadius: computed(() => props.content?.sendButtonBorderRadius || '12px'),
            sendButtonSize: computed(() => props.content?.sendButtonSize || '42px'),
            sendButtonBoxShadow: computed(() => props.content?.sendButtonBoxShadow || '0 2px 4px rgba(59, 130, 246, 0.3)'),
            attachmentButtonBgColor: computed(() => props.content?.attachmentButtonBgColor || '#f8fafc'),
            attachmentButtonHoverBgColor: computed(() => props.content?.attachmentButtonHoverBgColor || '#f1f5f9'),
            attachmentButtonBorder: computed(() => props.content?.attachmentButtonBorder || '1px solid #e2e8f0'),
            attachmentButtonBorderRadius: computed(() => props.content?.attachmentButtonBorderRadius || '12px'),
            attachmentButtonSize: computed(() => props.content?.attachmentButtonSize || '42px'),
            attachmentButtonBoxShadow: computed(() => props.content?.attachmentButtonBoxShadow || '0 1px 2px rgba(0, 0, 0, 0.06)'),

            // Methods
            scrollToBottom,
            sendMessage,
            addMessage,
            handleAttachment,
            handleRemoveAttachment,
            handlePendingAttachmentClick,
            handleAttachmentClick,
            handleMessageRightClick,
            currentLocalContext,
            pendingAttachments,
            allowAttachments,

            // Exposed for CSS variables
            messagesAttachmentThumbMaxWidth,
            messagesAttachmentThumbMaxHeight,
            messagesAttachmentThumbBorderRadius,
        };
    },
    methods: {
        actionScrollToBottom(smooth = false) {
            this.scrollToBottom(smooth);
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-chat-ai {
    --ww-chat-font-family: v-bind('containerStyles.fontFamily');
    --ww-chat-messages-bg: v-bind('messagesContainerStyles.backgroundColor');
    --ww-chat-message-bg: v-bind('messageBgColor');
    --ww-chat-message-text: v-bind('messageTextColor');
    --ww-chat-message-font-size: v-bind('messageFontSize');
    --ww-chat-message-font-weight: v-bind('messageFontWeight');
    --ww-chat-message-font-family: v-bind('messageFontFamily');
    --ww-chat-message-border: v-bind('messageBorder');
    --ww-chat-own-message-bg: v-bind('ownMessageBgColor');
    --ww-chat-own-message-text: v-bind('ownMessageTextColor');
    --ww-chat-own-message-font-size: v-bind('ownMessageFontSize');
    --ww-chat-own-message-font-weight: v-bind('ownMessageFontWeight');
    --ww-chat-own-message-font-family: v-bind('ownMessageFontFamily');
    --ww-chat-own-message-border: v-bind('ownMessageBorder');
    --ww-chat-empty-message-text: v-bind('emptyMessageText');
    --ww-chat-empty-message-color: v-bind('emptyMessageColor');

    --ww-chat-date-separator-text-color: v-bind('dateSeparatorTextColor');
    --ww-chat-date-separator-line-color: v-bind('dateSeparatorLineColor');
    --ww-chat-date-separator-bg-color: v-bind('dateSeparatorBgColor');
    --ww-chat-date-separator-border-radius: v-bind('dateSeparatorBorderRadius');

    /* Attachment thumbnails in messages area */
    --ww-chat-attachment-thumb-max-width: v-bind('messagesAttachmentThumbMaxWidth');
    --ww-chat-attachment-thumb-max-height: v-bind('messagesAttachmentThumbMaxHeight');
    --ww-chat-attachment-thumb-radius: v-bind('messagesAttachmentThumbBorderRadius');

    --ww-chat-input-bg: v-bind('inputBgColor');
    --ww-chat-input-text: v-bind('inputTextColor');
    --ww-chat-input-font-size: v-bind('inputFontSize');
    --ww-chat-input-font-weight: v-bind('inputFontWeight');
    --ww-chat-input-font-family: v-bind('inputFontFamily');
    --ww-chat-input-placeholder: v-bind('inputPlaceholderColor');
    --ww-chat-input-area-border: v-bind('inputAreaBorder');
    --ww-chat-textarea-border: v-bind('textareaBorder');
    --ww-chat-textarea-border-hover: v-bind('textareaBorderHover');
    --ww-chat-textarea-border-focus: v-bind('textareaBorderFocus');
    --ww-chat-input-height: v-bind('inputHeight');
    --ww-chat-input-border-radius: v-bind('inputBorderRadius');
    --ww-chat-messages-padding: v-bind('messagesAreaPadding');

    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: var(--ww-chat-font-family);

    &--disabled {
        opacity: 0.7;
        pointer-events: none;
    }

    &__messages {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: var(--ww-chat-messages-padding);
        background-color: var(--ww-chat-messages-bg);
        position: relative;
        z-index: 1;
    }

    .ww-chat-input-area {
        flex-shrink: 0;
        z-index: 2;
    }
}
</style>
