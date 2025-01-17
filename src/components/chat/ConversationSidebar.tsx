import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  return (
    <div
      className={cn(
        "border-r border-gray-700 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-12" : "w-64"
      )}
    >
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && (
          <Button 
            onClick={onNewChat} 
            variant="secondary" 
            className="w-full bg-chat-human text-white hover:bg-chat-human/90"
          >
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
        <ScrollArea className="flex-1">
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
      <div className={cn("p-4 border-t border-gray-700", isCollapsed && "flex items-center justify-center")}>
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/10", isCollapsed && "justify-center")}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
};
