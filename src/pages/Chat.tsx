import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface Message {
  content: string;
  type: 'human' | 'ai';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('message')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data.map(row => row.message as Message));
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new.message as Message;
          setMessages(prev => [...prev, newMessage]);
          setLoading(false);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (message: string, requestId: string) => {
    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          user_id: 'NA',
          request_id: requestId,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Request failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setSessionId(uuidv4());
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 dark:bg-gray-800 dark:text-gray-200">
      <ConversationSidebar
        currentSessionId={sessionId}
        onSessionSelect={setSessionId}
        onNewChat={handleNewChat}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Pydantic GitHub Agent</h1>
          <ThemeToggle />
        </div>
        <ScrollArea className="flex-1">
          <div className="min-h-full">
            {messages.map((message, i) => (
              <ChatMessage
                key={i}
                content={message.content}
                type={message.type}
              />
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
};

export default Chat;
