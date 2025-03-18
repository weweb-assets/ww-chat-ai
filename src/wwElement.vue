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

        const messagesContainerStyles = computed(() => ({
            backgroundColor: props.content?.messagesAreaBgColor || '#ffffff',
        }));

        // Header styles
        const headerBgColor = computed(() => props.content?.headerBgColor || '#ffffff');
        const headerTextColor = computed(() => props.content?.headerTextColor || '#1e293b');

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
        const scrollToBottom = async () => {
            await nextTick();
            if (messagesContainer.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
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

        // Add a message programmatically
        const addMessage = message => {
            if (isEditing.value) return;

            // Ensure required fields
            // We'll add the new message directly to the chat history array
            // This way it will naturally flow through our mapping system
            const newMessageRaw = {
                // Set default values for standard fields that may be used by default mappings
                id: message.id || `msg-${wwLib.wwUtils.getUid()}`,
                text: message.text || '',
                senderId: message.senderId || '',
                userName: message.userName || '',
                timestamp: message.timestamp || new Date().toISOString(),
                attachments: message.attachments,
                // If there are any additional fields in the message object, they'll be preserved
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
        };
    },
    methods: {
        // Action Methods
        actionScrollToBottom() {
            this.scrollToBottom();
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

    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background-color: var(--ww-chat-bg-color);
    border: var(--ww-chat-border);
    border-radius: var(--ww-chat-border-radius);
    box-shadow: var(--ww-chat-shadow);
    font-family: var(--ww-chat-font-family);

    &--disabled {
        opacity: 0.7;
        pointer-events: none;
    }

    &__messages {
        flex: 1;
        overflow-y: auto;
        scroll-behavior: smooth;
        padding: 16px;
        background-color: var(--ww-chat-messages-bg);
    }
}
</style>
