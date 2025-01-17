import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';

interface ChatInputProps {
  onSend: (message: string, requestId: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const requestId = uuidv4();
    onSend(message.trim(), requestId);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
      <div className="max-w-3xl mx-auto flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="min-h-[60px]"
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled || !message.trim()}>
          Send
        </Button>
      </div>
    </form>
  );
};