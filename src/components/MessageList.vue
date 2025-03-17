<template>
    <div class="ww-message-list">
      <div v-if="messages.length === 0" class="ww-message-list__empty">
        <div class="ww-message-list__empty-message">No messages yet</div>
      </div>
      
      <transition-group name="message-transition" tag="div">
        <div v-for="(message, index) in groupedMessages" :key="message.key">
          <!-- Date separator -->
          <div 
            v-if="message.type === 'date-separator'" 
            class="ww-message-list__date-separator"
          >
            <span>{{ message.date }}</span>
          </div>
          
          <!-- Message item -->
          <message-item
            v-else
            :message="message"
            :is-own-message="message.senderId === currentUserId"
            :same-sender-as-previous="isSameSenderAsPrevious(index)"
            :same-sender-as-next="isSameSenderAsNext(index)"
            :message-bg-color="messageBgColor"
            :message-text-color="messageTextColor"
            :message-border="messageBorder"
            :own-message-bg-color="ownMessageBgColor"
            :own-message-text-color="ownMessageTextColor"
            :own-message-border="ownMessageBorder"
            @attachment-click="handleAttachmentClick"
          />
        </div>
      </transition-group>
    </div>
  </template>
  
  <script>
  import { computed, inject } from 'vue';
  import MessageItem from './MessageItem.vue';
  import { formatDate } from '../utils/dateTimeFormatter';
  
  export default {
    name: 'MessageList',
    components: {
      MessageItem
    },
    props: {
      messages: {
        type: Array,
        default: () => []
      },
      currentUserId: {
        type: String,
        required: true
      },
      messageBgColor: {
        type: String,
        default: '#f1f5f9'
      },
      messageTextColor: {
        type: String,
        default: '#334155'
      },
      messageBorder: {
        type: String,
        default: '1px solid #e2e8f0'
      },
      ownMessageBgColor: {
        type: String,
        default: '#dbeafe'
      },
      ownMessageTextColor: {
        type: String,
        default: '#1e40af'
      },
      ownMessageBorder: {
        type: String,
        default: '1px solid #bfdbfe'
      }
    },
    emits: ['attachment-click'],
    setup(props, { emit }) {
      const isEditing = inject('isEditing', computed(() => false));
      
      // Group messages by date and add date separators
      const groupedMessages = computed(() => {
        if (!props.messages || props.messages.length === 0) return [];
        
        const result = [];
        let currentDate = null;
        
        props.messages.forEach(message => {
          // Extract the date part from the timestamp
          const messageDate = message.timestamp ? new Date(message.timestamp).toDateString() : new Date().toDateString();
          
          // Add date separator when date changes
          if (messageDate !== currentDate) {
            currentDate = messageDate;
            result.push({
              type: 'date-separator',
              date: formatDate(message.timestamp),
              key: `date-${messageDate}`
            });
          }
          
          // Add the message with a unique key
          result.push({
            ...message,
            key: message.id || `msg-${Math.random().toString(36).substring(2, 9)}`
          });
        });
        
        return result;
      });
  
      // Check if message is from the same sender as the previous message
      const isSameSenderAsPrevious = (index) => {
        if (index === 0) return false;
        
        const currentMessage = groupedMessages.value[index];
        if (currentMessage.type === 'date-separator') return false;
        
        let prevIndex = index - 1;
        while (prevIndex >= 0) {
          const prevMessage = groupedMessages.value[prevIndex];
          if (prevMessage.type !== 'date-separator') {
            return currentMessage.senderId === prevMessage.senderId;
          }
          prevIndex--;
        }
        
        return false;
      };
  
      // Check if message is from the same sender as the next message
      const isSameSenderAsNext = (index) => {
        if (index === groupedMessages.value.length - 1) return false;
        
        const currentMessage = groupedMessages.value[index];
        if (currentMessage.type === 'date-separator') return false;
        
        let nextIndex = index + 1;
        while (nextIndex < groupedMessages.value.length) {
          const nextMessage = groupedMessages.value[nextIndex];
          if (nextMessage.type !== 'date-separator') {
            return currentMessage.senderId === nextMessage.senderId;
          }
          nextIndex++;
        }
        
        return false;
      };
  
      // Handle attachment click
      const handleAttachmentClick = (attachment) => {
        if (isEditing.value) return;
        emit('attachment-click', attachment);
      };
  
      return {
        groupedMessages,
        isSameSenderAsPrevious,
        isSameSenderAsNext,
        handleAttachmentClick
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .ww-message-list {
    display: flex;
    flex-direction: column;
    
    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 100px;
      opacity: 0.5;
    }
    
    &__empty-message {
      font-size: 0.875rem;
      color: #64748b;
      font-style: italic;
    }
    
    &__date-separator {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 16px 0;
      position: relative;
      
      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background-color: #e2e8f0;
      }
      
      span {
        padding: 0 12px;
        font-size: 0.75rem;
        color: #64748b;
        background-color: #ffffff;
      }
    }
  }
  
  // Message transition animations
  .message-transition-enter-active,
  .message-transition-leave-active {
    transition: all 0.3s ease;
  }
  
  .message-transition-enter-from,
  .message-transition-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  
  .message-transition-move {
    transition: transform 0.3s;
  }
  </style>