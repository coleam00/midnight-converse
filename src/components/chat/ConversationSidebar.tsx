import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  session_id: string;
  title: string;
}

interface ConversationSidebarProps {
  currentSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

export const ConversationSidebar = ({
  currentSessionId,
  onSessionSelect,
  onNewChat,
}: ConversationSidebarProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('session_id, message')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      // Group by session_id and get first message
      const conversationsMap = data.reduce((acc: Record<string, Conversation>, curr) => {
        if (!acc[curr.session_id]) {
          const message = curr.message as { content: string; type: string };
          if (message.type === 'human') {
            acc[curr.session_id] = {
              session_id: curr.session_id,
              title: message.content.slice(0, 100),
            };
          }
        }
        return acc;
      }, {});

      setConversations(Object.values(conversationsMap));
    };

    fetchConversations();
  }, []);

  return (
    <div
      className={cn(
        "border-r border-gray-700 transition-all duration-300",
        isCollapsed ? "w-12" : "w-64"
      )}
    >
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && (
          <Button onClick={onNewChat} variant="outline" className="w-full">
            New Chat
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      {!isCollapsed && (
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="space-y-2 p-2">
            {conversations.map((conv) => (
              <Button
                key={conv.session_id}
                variant={currentSessionId === conv.session_id ? "secondary" : "ghost"}
                className="w-full justify-start text-sm truncate h-auto py-3"
                onClick={() => onSessionSelect(conv.session_id)}
              >
                {conv.title}
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};