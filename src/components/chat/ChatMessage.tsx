import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  type: 'human' | 'ai';
}

export const ChatMessage = ({ content, type }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "px-4 py-6 w-full",
        type === 'human' ? 'bg-chat-human' : 'bg-chat-ai'
      )}
    >
      <div className="max-w-3xl mx-auto">
        {type === 'human' ? (
          <p className="text-gray-100">{content}</p>
        ) : (
          <ReactMarkdown className="prose prose-invert">
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};