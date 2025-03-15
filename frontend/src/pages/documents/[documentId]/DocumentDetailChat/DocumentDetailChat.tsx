// Shadcn UI components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDocumentDetailChat from "./DocumentDetailChat.hook";

const DocumentDetailChat = () => {
  const {
    username,
    users,
    messages,
    newMessage,
    setNewMessage,
    isSocketConnected,
    handleSendMessage,
    messagesEndRef,
    getUserInitials,
    formatTime,
  } = useDocumentDetailChat();

  return (
    <div className="flex flex-col w-full col-span-1 h-full max-h-full">
      <div className="flex-1 flex flex-col overflow-hidden bg-card rounded border">
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Chat</CardTitle>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {users.map((user) => (
              <Badge key={user.id} variant="secondary" className="px-2 py-0">
                {user.username}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-[400px] p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.sender === username ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === username
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.sender !== username && (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getUserInitials(msg.sender)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span className="text-xs font-medium">{msg.sender}</span>
                    <span className="text-xs opacity-70 ml-auto">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-2">
          <form className="flex w-full gap-2" onSubmit={handleSendMessage}>
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={!isSocketConnected}
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={!isSocketConnected}>
              Send
            </Button>
          </form>
        </CardFooter>
      </div>
    </div>
  );
};

export default DocumentDetailChat;
