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
        type === 'human' ? 'flex justify-end' : 'flex justify-start'
      )}
    >
      <div
        className={cn(
          "max-w-3xl",
          type === 'human' ? 'bg-chat-human text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' : 'bg-chat-ai rounded-tr-lg rounded-bl-lg rounded-br-lg'
        )}
      >
        <div className="p-3">
          {type === 'human' ? (
            <p className="text-gray-100">{content}</p>
          ) : (
            <ReactMarkdown className="prose prose-invert">
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};
