<template>
    <div class="ww-chat-header">
        <div class="ww-chat-header__user">
            <div class="ww-chat-header__avatar" :style="avatarStyles">
                <img v-if="userAvatar" :src="userAvatar" alt="User avatar" />
                <span v-else>{{ userInitials }}</span>
                <div
                    class="ww-chat-header__status-indicator"
                    :class="`ww-chat-header__status-indicator--${userStatus}`"
                    :title="statusText"
                ></div>
            </div>
            <div class="ww-chat-header__info">
                <div class="ww-chat-header__name">{{ userName }}</div>
                <div v-if="userLocation" class="ww-chat-header__location">{{ userLocation }}</div>
            </div>
        </div>
        <button class="ww-chat-header__close" @click="$emit('close')">
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>
</template>

<script>
import { computed, inject } from 'vue';

export default {
    name: 'ChatHeader',
    props: {
        userName: {
            type: String,
            required: true,
        },
        userAvatar: {
            type: String,
            default: '',
        },
        userLocation: {
            type: String,
            default: '',
        },
        userStatus: {
            type: String,
            default: 'online',
            validator: value => ['online', 'offline', 'away', 'busy'].includes(value),
        },
        headerBgColor: {
            type: String,
            default: '#ffffff',
        },
        textColor: {
            type: String,
            default: '#1e293b',
        },
    },
    emits: ['close'],
    setup(props) {
        const isEditing = inject(
            'isEditing',
            computed(() => false)
        );

        // Compute user initials for avatar fallback
        const userInitials = computed(() => {
            return props.userName
                .split(' ')
                .map(part => part.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2);
        });

        // Compute human-readable status text
        const statusText = computed(() => {
            const statusMap = {
                online: 'Online',
                offline: 'Offline',
                away: 'Away',
                busy: 'Busy',
            };
            return statusMap[props.userStatus] || 'Unknown';
        });

        // Style objects
        const headerStyles = computed(() => ({
            backgroundColor: props.headerBgColor,
            color: props.textColor,
        }));

        const avatarStyles = computed(() => ({
            backgroundColor: getAvatarColor(props.userName),
            color: '#ffffff',
        }));

        // Generate a consistent color based on username
        const getAvatarColor = name => {
            const colors = [
                '#4f46e5',
                '#0891b2',
                '#0d9488',
                '#059669',
                '#16a34a',
                '#84cc16',
                '#ca8a04',
                '#ea580c',
                '#dc2626',
                '#e11d48',
                '#db2777',
                '#a855f7',
            ];

            // Simple hash function for consistent color
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }

            const index = Math.abs(hash) % colors.length;
            return colors[index];
        };

        return {
            isEditing,
            userInitials,
            statusText,
            headerStyles,
            avatarStyles,
        };
    },
};
</script>

<style lang="scss" scoped>
.ww-chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    background-color: v-bind('headerBgColor');
    color: v-bind('textColor');

    &__user {
        display: flex;
        align-items: center;
    }

    &__avatar {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-right: 12px;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }
    }

    &__status-indicator {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;

        &--online {
            background-color: #22c55e;
        }

        &--offline {
            background-color: #94a3b8;
        }

        &--away {
            background-color: #f59e0b;
        }

        &--busy {
            background-color: #ef4444;
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
    }

    &__name {
        font-weight: 600;
        font-size: 1rem;
        line-height: 1.2;
    }

    &__location {
        font-size: 0.875rem;
        opacity: 0.7;
        line-height: 1.2;
        margin-top: 2px;
    }

    &__close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: inherit;
        opacity: 0.7;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            opacity: 1;
            background-color: rgba(0, 0, 0, 0.05);
        }
    }
}
</style>
