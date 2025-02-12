'use client';

import React, { useEffect } from 'react'

import { Message, LoadingMessage } from '@/app/(app)/_components/chat';
import FollowUpSuggestions from './follow-up-suggestions';
import ToolInvocation from './tools';

import { useScrollAnchor } from '@/app/(app)/chat/_hooks';
import { useChat } from '../_contexts/chat';

import type { Message as MessageType } from 'ai';

interface Props {
    messages: MessageType[];
    messageClassName?: string;
}

const Messages: React.FC<Props> = ({ messages, messageClassName }) => {
    const { isResponseLoading, chatId } = useChat();
    const { scrollRef, messagesRef, scrollToBottom } = useScrollAnchor();
    
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    const lastAssistantIndex = lastAssistantMessage 
        ? messages.findIndex(m => m.id === lastAssistantMessage.id)
        : -1;

    return (
        <div className="flex-1 h-0 flex flex-col w-full overflow-y-auto max-w-full no-scrollbar" ref={scrollRef}>
            <div className="messages-container" ref={messagesRef}>
                {messages.map((message, index) => (
                    <React.Fragment key={`${chatId}-${message.id}`}>
                        <Message 
                            message={message} 
                            className={messageClassName} 
                            ToolComponent={ToolInvocation}
                            previousMessage={index > 0 ? messages[index - 1] : undefined} 
                            nextMessage={index < messages.length - 1 ? messages[index + 1] : undefined} 
                        />
                        {index === lastAssistantIndex && (
                            <FollowUpSuggestions 
                                messageId={message.id}
                                currentMessage={message}
                                previousMessage={index > 0 ? messages[index - 1] : undefined}
                            />
                        )}
                    </React.Fragment>
                ))}
                {isResponseLoading && <LoadingMessage />}
            </div>
        </div>
    )
}

export default Messages;