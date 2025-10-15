<template>
    <div
        class="ww-message-item"
        :class="{
            'ww-message-item--own': isOwnMessage,
            'ww-message-item--assistant': isAssistantMessage,
            'ww-message-item--continued': sameSenderAsPrevious,
            'ww-message-item--continue-next': sameSenderAsNext,
        }"
    >
        <!-- Message content -->
        <div
            class="ww-message-item__content"
            :class="{
                'ww-message-item__content--own': isOwnMessage,
                'ww-message-item__content--assistant': isAssistantMessage
            }"
            :style="messageStyles"
            @contextmenu.prevent="handleRightClick"
        >
            <!-- Sender name if first in group -->
            <div
                v-if="!sameSenderAsPrevious && showSenderName"
                class="ww-message-item__sender"
                :class="{
                    'ww-message-item__sender--own': isOwnMessage,
                    'ww-message-item__sender--assistant': isAssistantMessage
                }"
            >
                {{ senderDisplayName }}
            </div>

            <!-- Message text -->
            <div
                v-if="enableMarkdown"
                class="ww-message-item__text ww-message-item__text--markdown"
                v-html="renderedMarkdown"
            ></div>
            <div
                v-else
                class="ww-message-item__text"
            >
                {{ message.content }}
            </div>

            <!-- Attachments if any -->
            <div v-if="formattedAttachments.length" class="ww-message-item__attachments">
                <div
                    v-for="(attachmentMeta, index) in formattedAttachments"
                    :key="attachmentMeta.attachment.id ?? index"
                    class="ww-message-item__attachment"
                    :class="{ 'ww-message-item__attachment--own': isOwnMessage }"
                    @click="handleAttachmentClick(attachmentMeta.attachment)"
                >
                    <!-- Image preview for image files -->
                    <div
                        v-if="attachmentMeta.isImage"
                        class="ww-message-item__attachment-preview"
                        :class="{ 'ww-message-item__attachment-preview--own': isOwnMessage }"
                    >
                        <img :src="attachmentMeta.attachment.url" :alt="attachmentMeta.attachment.name" />
                    </div>

                    <!-- File icon for non-image files -->
                    <div
                        v-else
                        class="ww-message-item__attachment-file"
                        :class="{ 'ww-message-item__attachment-file--own': isOwnMessage }"
                    >
                        <div class="ww-message-item__attachment-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                            </svg>
                        </div>
                        <div class="ww-message-item__attachment-info">
                            <div class="ww-message-item__attachment-name">{{ attachmentMeta.attachment.name }}</div>
                            <div v-if="attachmentMeta.formattedSize" class="ww-message-item__attachment-size">
                                {{ attachmentMeta.formattedSize }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Message timestamp -->
            <div v-if="showTimestamp" class="ww-message-item__time">
                {{ formatMessageTime(message.timestamp) }}
            </div>
        </div>
    </div>
</template>

<script>
import { computed, inject } from 'vue';
import { formatTime } from '../utils/dateTimeFormatter';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

// Initialize markdown-it with highlight.js
const md = new MarkdownIt({
    html: false, // Disable HTML tags for security
    linkify: true, // Auto-convert URLs to links
    breaks: true, // Convert \n to <br>
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
        }
        return ''; // use external default escaping
    }
});

export default {
    name: 'MessageItem',
    props: {
        message: {
            type: Object,
            required: true,
        },
        isOwnMessage: {
            type: Boolean,
            default: false,
        },
        enableMarkdown: {
            type: Boolean,
            default: false,
        },
        sameSenderAsPrevious: {
            type: Boolean,
            default: false,
        },
        sameSenderAsNext: {
            type: Boolean,
            default: false,
        },
        messageBgColor: {
            type: String,
            default: 'transparent',
        },
        messageTextColor: {
            type: String,
            default: '#334155',
        },
        messageFontSize: {
            type: String,
            default: '0.875rem',
        },
        messageFontWeight: {
            type: String,
            default: '400',
        },
        messageFontFamily: {
            type: String,
            default: 'inherit',
        },
        messageBorder: {
            type: String,
            default: 'none',
        },
        ownMessageBgColor: {
            type: String,
            default: '#f4f4f4',
        },
        ownMessageTextColor: {
            type: String,
            default: '#1e1e1e',
        },
        ownMessageFontSize: {
            type: String,
            default: '0.875rem',
        },
        ownMessageFontWeight: {
            type: String,
            default: '400',
        },
        ownMessageFontFamily: {
            type: String,
            default: 'inherit',
        },
        ownMessageBorder: {
            type: String,
            default: '1px solid #d0d0d0',
        },
        messageRadius: {
            type: String,
            default: '0px',
        },
        ownMessageRadius: {
            type: String,
            default: '18px',
        },
        userLabel: {
            type: String,
            default: '',
        },
        assistantLabel: {
            type: String,
            default: '',
        },
        enableMarkdown: {
            type: Boolean,
            default: false,
        },
        messageShowTimestamp: {
            type: Boolean,
            default: true,
        },
        ownMessageShowTimestamp: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['attachment-click', 'right-click'],
    setup(props, { emit }) {
        const isEditing = inject(
            'isEditing',
            computed(() => false)
        );
        const chatRootEl = inject('chatRootEl', null);

        const dateTimeOptions = inject(
            'dateTimeOptions',
            computed(() => ({}))
        );

        const isAssistantMessage = computed(() => {
            return props.message.role === 'assistant';
        });

        const senderDisplayName = computed(() => {
            if (props.isOwnMessage) {
                return props.userLabel;
            }
            return props.message.userName || props.assistantLabel;
        });

        const showSenderName = computed(() => {
            // Hide label if it's empty
            if (props.isOwnMessage) {
                return props.userLabel && props.userLabel.trim() !== '';
            }
            return props.assistantLabel && props.assistantLabel.trim() !== '';
        });

        const showTimestamp = computed(() => {
            // User messages show timestamp based on ownMessageShowTimestamp property
            if (props.isOwnMessage) return props.ownMessageShowTimestamp;
            // Assistant messages show timestamp based on messageShowTimestamp property
            return props.messageShowTimestamp;
        });

        const renderedMarkdown = computed(() => {
            if (!props.enableMarkdown || !props.message.content) {
                return '';
            }
            return md.render(props.message.content);
        });

        const messageStyles = computed(() => {
            if (props.isOwnMessage) {
                return {
                    backgroundColor: props.ownMessageBgColor,
                    color: props.ownMessageTextColor,
                    fontSize: props.ownMessageFontSize,
                    fontWeight: props.ownMessageFontWeight,
                    fontFamily: props.ownMessageFontFamily ?? 'inherit',
                    border: props.ownMessageBorder,
                    '--message-radius': props.ownMessageRadius,
                };
            } else {
                return {
                    backgroundColor: props.messageBgColor,
                    color: props.messageTextColor,
                    fontSize: props.messageFontSize,
                    fontWeight: props.messageFontWeight,
                    fontFamily: props.messageFontFamily ?? 'inherit',
                    border: props.messageBorder,
                    '--message-radius': props.messageRadius,
                };
            }
        });

        const isImageFile = attachment => {
            if (!attachment.type) return false;
            return attachment.type.startsWith('image/');
        };

        const formatFileSize = rawSize => {
            const bytes = Number(rawSize);
            if (!Number.isFinite(bytes) || bytes < 0) return '';
            if (bytes === 0) return '0 Bytes';

            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
            const value = bytes / Math.pow(1024, index);
            return `${parseFloat(value.toFixed(2))} ${sizes[index]}`;
        };

        const formattedAttachments = computed(() => {
            const attachments = Array.isArray(props.message.attachments) ? props.message.attachments : [];
            return attachments.map(attachment => ({
                attachment,
                isImage: isImageFile(attachment),
                formattedSize: formatFileSize(attachment.size),
            }));
        });

        const formatMessageTime = timestamp => {
            return formatTime(timestamp, dateTimeOptions.value);
        };

        const handleAttachmentClick = attachment => {
            if (isEditing.value) return;
            emit('attachment-click', attachment);
        };

        const handleRightClick = event => {
            // Coordinates relative to the chat root element
            let elementX = 0;
            let elementY = 0;
            const root = chatRootEl && chatRootEl.value ? chatRootEl.value : null;
            if (root && typeof root.getBoundingClientRect === 'function') {
                const chatRect = root.getBoundingClientRect();
                elementX = event.clientX - chatRect.left;
                elementY = event.clientY - chatRect.top;
            } else {
                // Fallback: treat client coords as element-relative if root not found
                elementX = event.clientX;
                elementY = event.clientY;
            }

            // Coordinates relative to page top-left
            const viewportX = event.pageX;
            const viewportY = event.pageY;

            emit('right-click', {
                message: props.message,
                elementX,
                elementY,
                viewportX,
                viewportY,
            });
        };

        return {
            isAssistantMessage,
            senderDisplayName,
            showSenderName,
            showTimestamp,
            renderedMarkdown,
            messageStyles,
            isImageFile,
            formatFileSize,
            formattedAttachments,
            formatMessageTime,
            handleAttachmentClick,
            handleRightClick,
        };
    },
};
</script>

<style lang="scss" scoped>
.ww-message-item {
    display: flex;
    margin-bottom: 4px;

    &--own {
        justify-content: flex-end;
    }

    &--assistant {
        justify-content: flex-start;
    }

    &__content {
        max-width: 70%;
        padding: 10px 12px;
        border-radius: var(--message-radius, 18px 18px 18px 18px);
        position: relative;

        &--own {
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        &:not(.ww-message-item--continued) {
            margin-top: 8px;
        }

        .ww-message-item--continued & {
            margin-top: 2px;
        }

        .ww-message-item--continue-next & {
            margin-bottom: 2px;
        }
    }

    &__sender {
        font-weight: 600;
        font-size: 0.75rem;
        margin-bottom: 2px;
        opacity: 0.8;

        &--own {
            text-align: right;
        }
    }

    &__text {
        line-height: 1.4;
        word-break: break-word;
        white-space: pre-line; // Respect \n in non-markdown mode

        &--markdown {
            white-space: normal; // Let markdown handle formatting

            // Markdown styling
            :deep(p) {
                margin: 0 0 0.5em 0;
                &:last-child {
                    margin-bottom: 0;
                }
            }

            :deep(code) {
                background-color: rgba(0, 0, 0, 0.05);
                padding: 0.125em 0.25em;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
            }

            :deep(pre) {
                background-color: rgba(0, 0, 0, 0.05);
                padding: 0.75em;
                border-radius: 6px;
                overflow-x: auto;
                margin: 0.5em 0;

                code {
                    background-color: transparent;
                    padding: 0;
                }
            }

            :deep(a) {
                color: #3b82f6;
                text-decoration: underline;
            }

            :deep(ul), :deep(ol) {
                margin: 0.5em 0;
                padding-left: 1.5em;
            }

            :deep(li) {
                margin: 0.25em 0;
            }

            :deep(strong) {
                font-weight: 600;
            }

            :deep(em) {
                font-style: italic;
            }

            :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
                margin: 0.75em 0 0.5em 0;
                font-weight: 600;
                &:first-child {
                    margin-top: 0;
                }
            }
        }
    }

    &__time {
        font-size: 0.6875rem;
        opacity: 0.7;
        text-align: right;
        margin-top: 4px;
        user-select: none;
    }

    &__attachments {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;

        .ww-message-item--own & {
            align-items: flex-end;
        }
    }

    &__attachment {
        border-radius: 8px;
        overflow: hidden;
        background-color: rgba(255, 255, 255, 0.1);
        cursor: pointer;

        &--own {
            align-self: flex-end;
        }
    }

    &__attachment-preview {
        max-width: var(--ww-chat-attachment-thumb-max-width, 250px);
        max-height: var(--ww-chat-attachment-thumb-max-height, 200px);
        display: flex;
        align-items: center;
        justify-content: center;

        &--own {
            justify-content: flex-end;
        }

        img {
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: var(--ww-chat-attachment-thumb-max-height, 200px);
            min-width: var(--ww-chat-attachment-thumb-min-width, 80px);
            min-height: var(--ww-chat-attachment-thumb-min-height, 80px);
            object-fit: contain;
            border-radius: var(--ww-chat-attachment-thumb-radius, 6px);
        }
    }

    &__attachment-file {
        display: flex;
        align-items: center;
        padding: 8px;
        background-color: rgba(255, 255, 255, 0.15);
        border-radius: 6px;
        max-width: 200px;

        &:hover {
            opacity: 0.9;
        }

        &--own {
            flex-direction: row-reverse;

            .ww-message-item__attachment-icon {
                margin-right: 0;
                margin-left: 8px;
            }

            .ww-message-item__attachment-info {
                text-align: right;
            }
        }
    }

    &__attachment-icon {
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__attachment-info {
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    &__attachment-name {
        font-size: 0.8125rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }

    &__attachment-size {
        font-size: 0.75rem;
        opacity: 0.7;
    }
}
</style>
