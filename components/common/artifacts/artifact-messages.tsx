import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { UIMessage } from 'ai';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import { UIArtifact } from './artifact';
import { UseChatHelpers } from '@ai-sdk/react';
import { Message, MessageProps } from '@/app/components/chat/message';

// Define local Vote interface for client-side storage only
export interface Vote {
  id: string;
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
}

interface ArtifactMessagesProps {
  chatId: string;
  status: UseChatHelpers['status'];
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
  artifactStatus: UIArtifact['status'];
}

function PureArtifactMessages({
  chatId,
  status,
  messages,
  setMessages,
  reload,
  isReadonly,
  artifactStatus,
}: ArtifactMessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col gap-4 h-full items-center overflow-y-scroll px-4 pt-20"
    >
      {messages.map((message, index) => (
        <Message
          chatId={chatId}
          key={message.id}
          message={message}
          isLoading={status === 'streaming' && index === messages.length - 1}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      ))}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

function areEqual(
  prevProps: ArtifactMessagesProps,
  nextProps: ArtifactMessagesProps,
) {
  if (
    prevProps.artifactStatus === 'streaming' &&
    nextProps.artifactStatus === 'streaming'
  )
    return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.isReadonly !== nextProps.isReadonly) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;

  // Compare message contents for changes
  for (let i = 0; i < prevProps.messages.length; i++) {
    if (!equal(prevProps.messages[i], nextProps.messages[i])) {
      return false;
    }
  }

  return true;
}

export const ArtifactMessages = memo(PureArtifactMessages, areEqual);
