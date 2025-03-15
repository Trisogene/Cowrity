// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDocumentDetail from "./DocumentDetail.hook";
import DocumentDetailEditor from "./DocumentDetailEditor/DocumentDetailEditor";
import DocumentDetailChat from "./DocumentDetailChat/DocumentDetailChat";

const DocumentDetail = () => {
  const {
    username,
    isSocketConnected,
    hasJoinedRoom,
    documentName,
    handleJoinRoom,
    onChangeUsername,
  } = useDocumentDetail();

  if (!hasJoinedRoom) {
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
                onChange={onChangeUsername}
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
    <div className="flex flex-col gap-2  h-screen w-full max-w-full max-h-full bg-background p-2 overflow-hidden">
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

      <div className="grid md:grid-cols-3 grid-cols-2 gap-2 flex-1 overflow-hidden max-w-full max-h-full  ">
        <DocumentDetailEditor />

        <DocumentDetailChat />
      </div>
    </div>
  );
};

export default DocumentDetail;
