// Shadcn UI components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import DocumentDetailEditor from "./DocumentDetailEditor/DocumentDetailEditor";
import useDocumentDetail from "./DocumentDetail.hook";

const DocumentDetail = () => {
  const {
    username,
    setUsername,
    isSocketConnected,
    users,
    messages,
    newMessage,
    setNewMessage,
    isJoined,
    documentName,
    handleJoinRoom,
    handleSendMessage,
    messagesEndRef,
    getUserInitials,
    formatTime,
  } = useDocumentDetail();

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Join Collaboration Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl text-center mb-6">{documentName}</h2>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full"
                variant="default"
                disabled={!isSocketConnected}
              >
                {isSocketConnected ? "Join Room" : "Connecting..."}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2  h-screen w-full bg-background p-2">
      {/* Header */}
      <div className=" border rounded p-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">{documentName}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isSocketConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isSocketConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-2 flex-1 overflow-hidden">
        {/* Document Editor */}
        <DocumentDetailEditor />

        {/* Chat Section */}
        <div className="flex flex-col">
          <div className="flex-1 flex flex-col overflow-hidden bg-card rounded border">
            <CardHeader className="py-3 px-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Chat</CardTitle>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {users.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="px-2 py-0"
                  >
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
                        <span className="text-xs font-medium">
                          {msg.sender}
                        </span>
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
      </div>
    </div>
  );
};

export default DocumentDetail;
