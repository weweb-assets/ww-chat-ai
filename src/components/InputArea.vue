<template>
    <div class="ww-chat-input-area">
        <!-- Attachment button -->
        <label v-if="allowAttachments" class="ww-chat-input-area__attachment-btn">
            <input
                type="file"
                class="ww-chat-input-area__attachment-input"
                multiple
                @change="handleAttachment"
                :disabled="isDisabled"
            />
            <svg
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
            </svg>
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
            @click="sendMessage"
        >
            <svg
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
            </svg>
        </button>
    </div>
</template>

<script>
import { ref, computed, watch, onMounted, inject } from 'vue';

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
    },
    emits: ['update:modelValue', 'send', 'attachment'],
    setup(props, { emit }) {
        const isEditing = inject(
            'isEditing',
            computed(() => false)
        );
        const textareaRef = ref(null);
        const inputValue = ref(props.modelValue);

        // Update the main component with CSS variables
        onMounted(() => {
            const root = document.querySelector('.ww-chat');
            if (root) {
                root.style.setProperty('--ww-chat-input-min-height', props.inputMinHeight);
                root.style.setProperty('--ww-chat-input-max-height', props.inputMaxHeight);
                root.style.setProperty('--ww-chat-input-border-radius', props.inputBorderRadius);
            }
        });

        // Update CSS variables when props change
        watch(
            [() => props.inputMinHeight, () => props.inputMaxHeight, () => props.inputBorderRadius],
            ([minHeight, maxHeight, borderRadius]) => {
                const root = document.querySelector('.ww-chat');
                if (root) {
                    root.style.setProperty('--ww-chat-input-min-height', minHeight);
                    root.style.setProperty('--ww-chat-input-max-height', maxHeight);
                    root.style.setProperty('--ww-chat-input-border-radius', borderRadius);
                }
            }
        );

        // Determine if message can be sent
        const canSend = computed(() => inputValue.value.trim().length > 0);

        // Watch for changes in model value
        watch(
            () => props.modelValue,
            newValue => {
                inputValue.value = newValue;
            }
        );

        // Update parent model when input changes
        watch(inputValue, newValue => {
            emit('update:modelValue', newValue);
        });

        // Auto-resize textarea
        const resizeTextarea = () => {
            const textarea = textareaRef.value;
            if (!textarea) return;

            // Reset height to auto to get correct scrollHeight
            textarea.style.height = 'auto';

            // Set the height to the scroll height + small buffer
            const newHeight = Math.min(textarea.scrollHeight, parseInt(props.inputMaxHeight));
            textarea.style.height = `${newHeight}px`;
        };

        // Handle Enter key press
        const onEnterPress = event => {
            if (isEditing.value) return;

            // Send on Enter without Shift
            if (!event.shiftKey && canSend.value && !props.isDisabled) {
                sendMessage();
            } else if (event.shiftKey) {
                // Allow newline with Shift+Enter
                // The default behavior will be to insert a newline
                nextTick(resizeTextarea);
            }
        };

        // Send the message
        const sendMessage = () => {
            if (isEditing.value || !canSend.value || props.isDisabled) return;

            emit('send');
            inputValue.value = '';

            // Reset textarea height
            if (textareaRef.value) {
                textareaRef.value.style.height = 'auto';
            }
        };

        // Handle file attachment
        const handleAttachment = event => {
            if (isEditing.value || props.isDisabled) return;

            const files = event.target.files;
            if (files && files.length > 0) {
                emit('attachment', files);
                // Reset the input to allow selecting the same file again
                event.target.value = '';
            }
        };

        return {
            textareaRef,
            inputValue,
            canSend,
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
    border-top: var(--ww-chat-input-border, 1px solid #e2e8f0);

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
        color: var(--ww-chat-input-text, #334155);

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

    &__input-container {
        position: relative;
        flex: 1;
    }

    &__input {
        width: 100%;
        resize: none;
        min-height: var(--ww-chat-input-min-height, 38px);
        max-height: var(--ww-chat-input-max-height, 120px);
        padding: 8px 12px;
        border-radius: var(--ww-chat-input-border-radius, 20px);
        font-size: 0.9375rem;
        line-height: 1.4;
        overflow-y: auto;
        transition: border-color 0.2s;
        background-color: var(--ww-chat-input-bg, #ffffff);
        color: var(--ww-chat-input-text, #334155);
        border: var(--ww-chat-input-border, 1px solid #e2e8f0);

        &::placeholder {
            color: var(--ww-chat-input-placeholder, #94a3b8);
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
        color: var(--ww-chat-input-text, #334155);

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
