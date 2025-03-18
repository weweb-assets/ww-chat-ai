<template>
    <div class="ww-chat" :class="{ 'ww-chat--disabled': isDisabled }" :style="containerStyles">
        <!-- Chat Header -->
        <ChatHeader
            v-if="displayHeader"
            :user-name="userName"
            :user-avatar="userAvatar"
            :user-location="userLocation"
            :user-status="userStatus"
            :header-bg-color="headerBgColor"
            :text-color="headerTextColor"
            :header-border="headerBorder"
            :header-box-shadow="headerBoxShadow"
            :header-padding="headerPadding"
            :name-font-size="headerNameFontSize"
            :name-font-weight="headerNameFontWeight"
            :location-font-size="headerLocationFontSize"
            :location-opacity="headerLocationOpacity"
            :close-button-color="headerCloseButtonColor"
            :close-button-bg-hover="headerCloseButtonBgHover"
            @close="handleClose"
        />

        <!-- Messages Area -->
        <div ref="messagesContainer" class="ww-chat__messages" :style="messagesContainerStyles">
            <MessageList
                :messages="messages"
                :current-user-id="currentUserId"
                :message-bg-color="messageBgColor"
                :message-text-color="messageTextColor"
                :message-border="messageBorder"
                :own-message-bg-color="ownMessageBgColor"
                :own-message-text-color="ownMessageTextColor"
                :own-message-border="ownMessageBorder"
                :empty-message-text="emptyMessageText"
                :empty-message-color="emptyMessageColor"
                :date-separator-text-color="dateSeparatorTextColor"
                :date-separator-line-color="dateSeparatorLineColor"
                :date-separator-bg-color="dateSeparatorBgColor"
                :date-separator-border-radius="dateSeparatorBorderRadius"
                @attachment-click="handleAttachmentClick"
            />
        </div>

        <!-- Input Area -->
        <InputArea
            v-model="newMessage"
            :is-disabled="isDisabled"
            :allow-attachments="allowAttachments"
            :input-bg-color="inputBgColor"
            :input-text-color="inputTextColor"
            :input-placeholder-color="inputPlaceholderColor"
            :input-border="inputBorder"
            :input-max-height="inputMaxHeight"
            :input-min-height="inputMinHeight"
            :input-border-radius="inputBorderRadius"
            :placeholder="inputPlaceholder"
            :send-icon="sendIcon"
            :send-icon-color="sendIconColor"
            :send-icon-size="sendIconSize"
            :attachment-icon="attachmentIcon"
            :attachment-icon-color="attachmentIconColor"
            :attachment-icon-size="attachmentIconSize"
            @send="sendMessage"
            @attachment="handleAttachment"
        />
    </div>
</template>

<script>
import { ref, computed, watch, nextTick, provide, onMounted } from 'vue';
import ChatHeader from './components/ChatHeader.vue';
import MessageList from './components/MessageList.vue';
import InputArea from './components/InputArea.vue';

export default {
    name: 'Chat',
    components: {
        ChatHeader,
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
        // Internal state
        const messagesContainer = ref(null);
        const newMessage = ref('');
        const isScrolling = ref(false);
        const pendingAttachments = ref([]);

        // Component variables
        const { value: chatHistory, setValue: setChatHistory } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'chatHistory',
            type: 'array',
            defaultValue: [],
        });

        // Formula resolver for mapping fields
        const { resolveMappingFormula } = wwLib.wwFormula.useFormula();

        // Function to resolve mapping for each message
        const resolveMapping = (message, mappingFormula, defaultProp) => {
            if (!mappingFormula) return message[defaultProp];
            return resolveMappingFormula(mappingFormula, message);
        };

        // Editor state
        const isEditing = computed(() => {
            /* wwEditor:start */
            return props.wwEditorState.isEditing;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        });

        // Computed properties from content
        const currentUserId = computed(() => props.content?.currentUserId || 'current-user');
        const rawMessages = computed(() => props.content?.chatHistory || chatHistory.value || []);

        // Apply mappings to messages
        const messages = computed(() => {
            return rawMessages.value.map(message => {
                return {
                    id:
                        resolveMapping(message, props.content?.mappingMessageId, 'id') ||
                        `msg-${wwLib.wwUtils.getUid()}`,
                    text: resolveMapping(message, props.content?.mappingMessageText, 'text') || '',
                    senderId: resolveMapping(message, props.content?.mappingSenderId, 'senderId') || '',
                    userName: resolveMapping(message, props.content?.mappingUserName, 'userName') || '',
                    timestamp:
                        resolveMapping(message, props.content?.mappingTimestamp, 'timestamp') ||
                        new Date().toISOString(),
                    attachments: resolveMapping(message, props.content?.mappingAttachments, 'attachments'),
                    _originalData: message, // Keep the original data for reference
                };
            });
        });

        const isDisabled = computed(() => props.content?.disabled || false);
        const displayHeader = computed(() => props.content?.displayHeader !== false);
        const allowAttachments = computed(() => props.content?.allowAttachments || false);
        const inputPlaceholder = computed(() => props.content?.inputPlaceholder || 'Type a message...');

        // User properties
        const userName = computed(() => props.content?.userName || 'User');
        const userAvatar = computed(() => props.content?.userAvatar || '');
        const userLocation = computed(() => props.content?.userLocation || '');
        const userStatus = computed(() => props.content?.userStatus || 'online');

        // Style properties
        const containerStyles = computed(() => ({
            backgroundColor: props.content?.backgroundColor || '#f5f7fb',
            border: props.content?.containerBorder || '1px solid #e2e8f0',
            borderRadius: props.content?.containerBorderRadius || '8px',
            boxShadow: props.content?.containerShadow || '0 2px 8px rgba(0, 0, 0, 0.05)',
            fontFamily: props.content?.fontFamily || 'inherit',
        }));

        const messagesAreaPadding = computed(() => props.content?.messagesAreaPadding || '16px');
        const messagesAreaHeight = computed(() => props.content?.messagesAreaHeight || 'auto');

        const messagesContainerStyles = computed(() => ({
            backgroundColor: props.content?.messagesAreaBgColor || '#ffffff',
            padding: messagesAreaPadding.value,
            height: messagesAreaHeight.value,
            maxHeight: messagesAreaHeight.value !== 'auto' ? messagesAreaHeight.value : undefined,
        }));

        // Header styles
        const headerBgColor = computed(() => props.content?.headerBgColor || '#ffffff');
        const headerTextColor = computed(() => props.content?.headerTextColor || '#1e293b');
        const headerBorder = computed(() => props.content?.headerBorder || '1px solid #e2e8f0');
        const headerBoxShadow = computed(() => props.content?.headerBoxShadow || '0 2px 8px rgba(0, 0, 0, 0.05)');
        const headerPadding = computed(() => props.content?.headerPadding || '16px');
        const headerNameFontSize = computed(() => props.content?.headerNameFontSize || '18px');
        const headerNameFontWeight = computed(() => props.content?.headerNameFontWeight || '600');
        const headerLocationFontSize = computed(() => props.content?.headerLocationFontSize || '14px');
        const headerLocationOpacity = computed(() => props.content?.headerLocationOpacity || '0.7');
        const headerCloseButtonColor = computed(() => props.content?.headerCloseButtonColor || '#334155');
        const headerCloseButtonBgHover = computed(() => props.content?.headerCloseButtonBgHover || '#dbeafe');

        // Message styles
        const messageBgColor = computed(() => props.content?.messageBgColor || '#f1f5f9');
        const messageTextColor = computed(() => props.content?.messageTextColor || '#334155');
        const messageBorder = computed(() => props.content?.messageBorder || '1px solid #e2e8f0');

        const ownMessageBgColor = computed(() => props.content?.ownMessageBgColor || '#dbeafe');
        const ownMessageTextColor = computed(() => props.content?.ownMessageTextColor || '#1e40af');
        const ownMessageBorder = computed(() => props.content?.ownMessageBorder || '1px solid #bfdbfe');

        // Input styles
        const inputBgColor = computed(() => props.content?.inputBgColor || '#ffffff');
        const inputTextColor = computed(() => props.content?.inputTextColor || '#334155');
        const inputPlaceholderColor = computed(() => props.content?.inputPlaceholderColor || '#94a3b8');
        const inputBorder = computed(() => props.content?.inputBorder || '1px solid #e2e8f0');
        const inputMaxHeight = computed(() => props.content?.inputMaxHeight || '120px');
        const inputMinHeight = computed(() => props.content?.inputMinHeight || '40px');
        const inputBorderRadius = computed(() => props.content?.inputBorderRadius || '8px');

        // Empty message styles
        const emptyMessageText = computed(() => props.content?.emptyMessageText || 'No messages yet');
        const emptyMessageColor = computed(() => props.content?.emptyMessageColor || '#64748b');

        // Date separator styles
        const dateSeparatorTextColor = computed(() => props.content?.dateSeparatorTextColor || '#64748b');
        const dateSeparatorLineColor = computed(() => props.content?.dateSeparatorLineColor || '#e2e8f0');
        const dateSeparatorBgColor = computed(() => props.content?.dateSeparatorBgColor || '#ffffff');
        const dateSeparatorBorderRadius = computed(() => props.content?.dateSeparatorBorderRadius || '8px');

        // Provide context to child components
        provide('isEditing', isEditing);

        // Set CSS variables when the component is mounted
        onMounted(() => {
            scrollToBottom();
        });

        // Watch for changes in messages to auto-scroll
        watch(
            messages,
            () => {
                if (!isScrolling.value) {
                    scrollToBottom();
                }
            },
            { deep: true }
        );

        // Scroll to bottom of messages
        const scrollToBottom = async (smooth = false) => {
            await nextTick();
            if (messagesContainer.value) {
                if (smooth) {
                    // Use smooth scrolling behavior when requested
                    const lastElement = messagesContainer.value.lastElementChild;
                    if (lastElement) {
                        lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    } else {
                        // Fallback if no child elements exist
                        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
                    }
                } else {
                    // Use instant scrolling (original behavior)
                    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
                }
            }
        };

        // Handle sending a new message
        const sendMessage = () => {
            if (isEditing.value || isDisabled.value || !newMessage.value.trim()) return;

            const attachments = [...pendingAttachments.value];
            pendingAttachments.value = [];

            // Create a new message object with all the standard fields
            const message = {
                id: `msg-${wwLib.wwUtils.getUid()}`,
                text: newMessage.value.trim(),
                senderId: currentUserId.value,
                userName: userName.value,
                timestamp: new Date().toISOString(),
                attachments: attachments.length > 0 ? attachments : undefined,
            };

            // Update chat history
            const updatedHistory = [...chatHistory.value, message];
            setChatHistory(updatedHistory);

            // Clear input
            newMessage.value = '';

            // Emit event
            emit('trigger-event', {
                name: 'messageSent',
                event: { message },
            });

            // Scroll to bottom
            scrollToBottom();
        };

        // Handle attachment button click
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

        // Handle attachment click in messages
        const handleAttachmentClick = attachment => {
            if (isEditing.value) return;

            emit('trigger-event', {
                name: 'attachmentClick',
                event: { attachment },
            });
        };

        // Handle close button click in header
        const handleClose = () => {
            if (isEditing.value) return;

            emit('trigger-event', {
                name: 'close',
                event: {},
            });
        };

        const addMessage = message => {
            if (isEditing.value) return;

            const newMessageRaw = {
                id: message.id || `msg-${wwLib.wwUtils.getUid()}`,
                text: message.text || '',
                senderId: message.senderId || '',
                userName: message.userName || '',
                timestamp: message.timestamp || new Date().toISOString(),
                attachments: message.attachments,
                ...message,
            };

            // Update chat history
            const updatedHistory = [...chatHistory.value, newMessageRaw];
            setChatHistory(updatedHistory);

            // Scroll to bottom
            scrollToBottom();

            return newMessageRaw;
        };

        // Clear all messages
        const clearMessages = () => {
            if (isEditing.value) return;

            setChatHistory([]);
        };

        return {
            // Refs
            messagesContainer,
            newMessage,
            messages,
            pendingAttachments,

            // Computed
            currentUserId,
            isDisabled,
            displayHeader,
            allowAttachments,
            inputPlaceholder,
            userName,
            userAvatar,
            userLocation,
            userStatus,

            // Styles
            containerStyles,
            messagesContainerStyles,
            headerBgColor,
            headerTextColor,
            headerBorder,
            headerBoxShadow,
            headerPadding,
            headerNameFontSize,
            headerNameFontWeight,
            headerLocationFontSize,
            headerLocationOpacity,
            headerCloseButtonColor,
            headerCloseButtonBgHover,
            messageBgColor,
            messageTextColor,
            messageBorder,
            ownMessageBgColor,
            ownMessageTextColor,
            ownMessageBorder,
            inputBgColor,
            inputTextColor,
            inputPlaceholderColor,
            inputBorder,
            inputMaxHeight,
            inputMinHeight,
            inputBorderRadius,

            // Empty message styles
            emptyMessageText,
            emptyMessageColor,

            // Date separator styles
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

            // Methods
            scrollToBottom,
            sendMessage,
            handleAttachment,
            handleAttachmentClick,
            handleClose,
            addMessage,
            clearMessages,

            // New computed property
            messagesAreaPadding,
            messagesAreaHeight,
        };
    },
    methods: {
        // Action Methods
        actionScrollToBottom(smooth = false) {
            this.scrollToBottom(smooth);
        },
        actionClearMessages() {
            this.clearMessages();
        },
        actionAddMessage(message) {
            return this.addMessage(message);
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-chat {
    --ww-chat-bg-color: v-bind('containerStyles.backgroundColor');
    --ww-chat-border: v-bind('containerStyles.border');
    --ww-chat-border-radius: v-bind('containerStyles.borderRadius');
    --ww-chat-shadow: v-bind('containerStyles.boxShadow');
    --ww-chat-font-family: v-bind('containerStyles.fontFamily');

    --ww-chat-header-bg: v-bind('headerBgColor');
    --ww-chat-header-text: v-bind('headerTextColor');
    --ww-chat-header-border: v-bind('headerBorder');
    --ww-chat-header-shadow: v-bind('headerBoxShadow');
    --ww-chat-header-padding: v-bind('headerPadding');
    --ww-chat-header-name-font-size: v-bind('headerNameFontSize');
    --ww-chat-header-name-font-weight: v-bind('headerNameFontWeight');
    --ww-chat-header-location-font-size: v-bind('headerLocationFontSize');
    --ww-chat-header-location-opacity: v-bind('headerLocationOpacity');
    --ww-chat-header-close-button-color: v-bind('headerCloseButtonColor');
    --ww-chat-header-close-button-bg-hover: v-bind('headerCloseButtonBgHover');

    --ww-chat-messages-bg: v-bind('messagesContainerStyles.backgroundColor');

    --ww-chat-message-bg: v-bind('messageBgColor');
    --ww-chat-message-text: v-bind('messageTextColor');
    --ww-chat-message-border: v-bind('messageBorder');

    --ww-chat-own-message-bg: v-bind('ownMessageBgColor');
    --ww-chat-own-message-text: v-bind('ownMessageTextColor');
    --ww-chat-own-message-border: v-bind('ownMessageBorder');

    --ww-chat-empty-message-text: v-bind('emptyMessageText');
    --ww-chat-empty-message-color: v-bind('emptyMessageColor');

    --ww-chat-date-separator-text-color: v-bind('dateSeparatorTextColor');
    --ww-chat-date-separator-line-color: v-bind('dateSeparatorLineColor');
    --ww-chat-date-separator-bg-color: v-bind('dateSeparatorBgColor');
    --ww-chat-date-separator-border-radius: v-bind('dateSeparatorBorderRadius');

    --ww-chat-input-bg: v-bind('inputBgColor');
    --ww-chat-input-text: v-bind('inputTextColor');
    --ww-chat-input-placeholder: v-bind('inputPlaceholderColor');
    --ww-chat-input-border: v-bind('inputBorder');
    --ww-chat-input-max-height: v-bind('inputMaxHeight');
    --ww-chat-input-min-height: v-bind('inputMinHeight');
    --ww-chat-input-border-radius: v-bind('inputBorderRadius');

    /* Add new CSS variable for messages padding */
    --ww-chat-messages-padding: v-bind('messagesAreaPadding');

    /* Add new CSS variable for messages container height */
    --ww-chat-messages-height: v-bind('messagesAreaHeight');

    /* Main container layout */
    display: flex;
    flex-direction: column;
    height: 100%; /* Take full height of parent */
    min-height: 300px; /* Minimum height to ensure usability */
    overflow: hidden; /* Hide overflow to prevent scrollbar on the entire container */

    /* Container styling */
    background-color: var(--ww-chat-bg-color);
    border: var(--ww-chat-border);
    border-radius: var(--ww-chat-border-radius);
    box-shadow: var(--ww-chat-shadow);
    font-family: var(--ww-chat-font-family);

    &--disabled {
        opacity: 0.7;
        pointer-events: none;
    }

    /* Make sure ChatHeader component doesn't shrink */
    .ww-chat-header {
        flex-shrink: 0; /* Prevent header from shrinking */
        z-index: 2; /* Ensure header stays above scrolling content */
    }

    /* Messages area - scrollable and takes remaining space */
    &__messages {
        flex: v-bind(
            "messagesAreaHeight === 'auto' ? '1' : '0 0 auto'"
        ); /* Adjust flex behavior based on height setting */
        min-height: 100px; /* Minimum height to ensure it doesn't collapse */
        height: var(--ww-chat-messages-height);
        overflow-y: auto; /* Add vertical scrollbar when needed */
        scroll-behavior: smooth; /* Smooth scrolling behavior */
        padding: var(--ww-chat-messages-padding);
        background-color: var(--ww-chat-messages-bg);
        position: relative; /* For proper stacking context */
        z-index: 1;
    }

    /* Make sure InputArea component doesn't shrink */
    .ww-chat-input-area {
        flex-shrink: 0; /* Prevent input area from shrinking */
        z-index: 2; /* Ensure input stays above scrolling content */
    }
}
</style>
