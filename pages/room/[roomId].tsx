import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Chat, { ChatMessage } from "../../components/Chat";
import VideoChat from "../../components/VideoChat";
import io, { Socket } from "socket.io-client";

type RoomProps = {};

export default function room({}: RoomProps) {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  //states
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  //getting room id
  useEffect(() => {
    const initSocket = () => {
      if (!router.isReady) return;
      setSocket(io("http://localhost:8080"));
    };
    initSocket();
  }, [router.isReady]);
  //connect to socket server and init events
  useEffect(() => {
    if (!socket) return;
    initSocket(socket, roomId, "wiow");
  }, [socket]);
  //handling new message
  const pushMessage = (message: ChatMessage) => {
    setMessages([...messages, message]);
  };
  return (
    <div className="h-screen w-screen flex flex-col sm:flex-row ">
      <VideoChat
        onToggleChat={() => {
          setShowChat(!showChat);
        }}
      />
      <Chat
        toggleChat={showChat}
        messages={messages}
        onPushMessage={pushMessage}
      />
    </div>
  );
}

const initSocket = (socket: Socket, roomId: string, userId: string) => {
  // "wiow" bich y3awdhha mba3ed peer id

  socket.emit("user-connected", roomId, userId);
  socket.on("user-connected", ({ id }) => {
    //TODO Implement case of user join a room

    console.log(`${id} connected`);
  });
  socket.on("user-disconnected", () => {
    //TODO handling deisconnection of user
  });
};
