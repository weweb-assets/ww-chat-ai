<template>
    <div class="ww-chat-input-area">
        <!-- Attachment button -->
        <label
            v-if="allowAttachments"
            class="ww-chat-input-area__attachment-btn"
            :style="{ color: attachmentIconColor }"
        >
            <input
                type="file"
                class="ww-chat-input-area__attachment-input"
                multiple
                @change="handleAttachment"
                :disabled="isDisabled"
            />
            <span
                class="ww-chat-input-area__icon"
                :style="{ width: attachmentIconSize, height: attachmentIconSize }"
                v-html="attachmentIconHtml"
            ></span>
        </label>

        <!-- Input field -->
        <div class="ww-chat-input-area__input-container">
            <textarea
                ref="textareaRef"
                v-model="inputValue"
                class="ww-chat-input-area__input"
                :placeholder="placeholder"
                :disabled="isDisabled"
                @keydown.enter.prevent="onEnterPress"
                @input="resizeTextarea"
            ></textarea>
        </div>

        <!-- Send button -->
        <button
            type="button"
            class="ww-chat-input-area__send-btn"
            :class="{ 'ww-chat-input-area__send-btn--disabled': !canSend || isDisabled }"
            :disabled="!canSend || isDisabled"
            :style="{ color: sendIconColor }"
            @click="sendMessage"
        >
            <span
                class="ww-chat-input-area__icon"
                :style="{ width: sendIconSize, height: sendIconSize }"
                v-html="sendIconHtml"
            ></span>
        </button>
    </div>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted, inject, watchEffect } from 'vue';

export default {
    name: 'InputArea',
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
        allowAttachments: {
            type: Boolean,
            default: false,
        },
        inputBgColor: {
            type: String,
            default: '#ffffff',
        },
        inputTextColor: {
            type: String,
            default: '#334155',
        },
        inputPlaceholderColor: {
            type: String,
            default: '#94a3b8',
        },
        inputBorder: {
            type: String,
            default: '1px solid #e2e8f0',
        },
        inputMaxHeight: {
            type: String,
            default: '120px',
        },
        inputMinHeight: {
            type: String,
            default: '38px',
        },
        inputBorderRadius: {
            type: String,
            default: '20px',
        },
        placeholder: {
            type: String,
            default: 'Type a message...',
        },
        // Icon properties
        sendIcon: {
            type: String,
            default: 'send',
        },
        sendIconColor: {
            type: String,
            default: '#334155',
        },
        sendIconSize: {
            type: String,
            default: '20px',
        },
        attachmentIcon: {
            type: String,
            default: 'paperclip',
        },
        attachmentIconColor: {
            type: String,
            default: '#334155',
        },
        attachmentIconSize: {
            type: String,
            default: '20px',
        },
    },
    emits: ['update:modelValue', 'send', 'attachment'],
    setup(props, { emit }) {
        const isEditing = inject(
            'isEditing',
            computed(() => false)
        );
        const textareaRef = ref(null);
        const inputValue = ref(props.modelValue);
        const sendIconText = ref(null);
        const attachmentIconText = ref(null);

        const { getIcon } = wwLib.useIcons();

        const defaultSendIcon = `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>`;

        const defaultAttachmentIcon = `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path
                d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
            ></path>
        </svg>`;

        watchEffect(async () => {
            try {
                if (props.sendIcon) {
                    sendIconText.value = await getIcon(props.sendIcon);
                }
            } catch (error) {
                console.error('Failed to load send icon:', error);
                sendIconText.value = null;
            }
        });

        watchEffect(async () => {
            try {
                if (props.attachmentIcon) {
                    attachmentIconText.value = await getIcon(props.attachmentIcon);
                }
            } catch (error) {
                console.error('Failed to load attachment icon:', error);
                attachmentIconText.value = null;
            }
        });

        const sendIconHtml = computed(() => {
            return sendIconText.value || defaultSendIcon;
        });

        const attachmentIconHtml = computed(() => {
            return attachmentIconText.value || defaultAttachmentIcon;
        });

        const canSend = computed(() => inputValue.value.trim().length > 0);

        watch(
            () => props.modelValue,
            newValue => {
                inputValue.value = newValue;
            }
        );

        watch(inputValue, newValue => {
            emit('update:modelValue', newValue);
        });

        const resizeTextarea = () => {
            const textarea = textareaRef.value;
            if (!textarea) return;

            textarea.style.height = 'auto';

            const newHeight = Math.min(textarea.scrollHeight, parseInt(props.inputMaxHeight));
            textarea.style.height = `${newHeight}px`;
        };

        const onEnterPress = event => {
            if (isEditing.value) return;

            if (!event.shiftKey && canSend.value && !props.isDisabled) {
                sendMessage();
            } else if (event.shiftKey) {
                nextTick(resizeTextarea);
            }
        };

        const sendMessage = () => {
            if (isEditing.value || !canSend.value || props.isDisabled) return;

            emit('send');
            inputValue.value = '';

            if (textareaRef.value) {
                textareaRef.value.style.height = 'auto';
            }
        };

        const handleAttachment = event => {
            if (isEditing.value || props.isDisabled) return;

            const files = event.target.files;
            if (files && files.length > 0) {
                emit('attachment', files);
                event.target.value = '';
            }
        };

        return {
            textareaRef,
            inputValue,
            canSend,
            sendIconHtml,
            attachmentIconHtml,
            inputAreaStyles: computed(() => ({
                borderTop: props.inputBorder,
            })),
            inputStyles: computed(() => ({
                backgroundColor: props.inputBgColor,
                color: props.inputTextColor,
                border: props.inputBorder,
                '--placeholder-color': props.inputPlaceholderColor,
                maxHeight: props.inputMaxHeight,
                minHeight: props.inputMinHeight,
                borderRadius: props.inputBorderRadius,
            })),
            iconBtnStyles: computed(() => ({
                color: props.inputTextColor,
                opacity: props.isDisabled ? 0.5 : 1,
            })),
            resizeTextarea,
            onEnterPress,
            sendMessage,
            handleAttachment,
        };
    },
};
</script>

<style lang="scss" scoped>
.ww-chat-input-area {
    display: flex;
    align-items: flex-end;
    padding: 12px 16px;
    gap: 8px;
    border-top: v-bind('inputBorder');
    width: 100%;
    flex-shrink: 0;
    background-color: v-bind('inputBgColor');
    position: relative;

    &__attachment-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        cursor: pointer;
        transition: background-color 0.2s;
        flex-shrink: 0;

        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
    }

    &__attachment-input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
        pointer-events: none;
    }

    &__icon {
        display: flex;
        align-items: center;
        justify-content: center;

        :deep(svg) {
            width: 100%;
            height: 100%;
        }
    }

    &__input-container {
        position: relative;
        flex: 1;
    }

    &__input {
        width: 100%;
        resize: none;
        min-height: v-bind('inputMinHeight');
        max-height: v-bind('inputMaxHeight');
        padding: 8px 12px;
        border-radius: v-bind('inputBorderRadius');
        font-size: 0.9375rem;
        line-height: 1.4;
        overflow-y: auto;
        transition: border-color 0.2s;
        background-color: v-bind('inputBgColor');
        color: v-bind('inputTextColor');
        border: v-bind('inputBorder');

        &::placeholder {
            color: v-bind('inputPlaceholderColor');
        }

        &:focus {
            outline: none;
        }

        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    }

    &__send-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: none;
        background: transparent;
        cursor: pointer;
        transition: background-color 0.2s;
        flex-shrink: 0;

        &:hover:not(:disabled) {
            background-color: rgba(0, 0, 0, 0.05);
        }

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }
}
</style>
