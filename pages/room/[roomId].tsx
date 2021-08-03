import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Chat, { ChatMessage } from "../../components/Chat";
import VideoChat from "../../components/VideoChat";
import io, { Socket } from "socket.io-client";
// import { MyPeer } from "../../types/MyPeer";

import Peer from "peerjs";
import Identification from "../../components/Identification";

type RoomProps = {};
export type UserInfo = {
  id: string;
  username: string;
};
type VideoChat = {
  stream: MediaStream;
  isfocused: boolean;
};
export default function room({}: RoomProps) {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  //states
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [myPeer, setPeer] = useState<Peer | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [videos, setViedos] = useState<VideoChat[]>([]);
  const messagesRef = useRef(messages);
  //getting room id
  useEffect(() => {
    if (!router.isReady) return;
    import("peerjs").then(({ default: Peer }) => {
      setPeer(new Peer());
    });
  }, [router.isReady]);
  //connect to socket server and init events
  useEffect(() => {
    if (!socket) return;
    const initSocket = () => {
      // "wiow" bich y3awdhha mba3ed peer id

      socket.emit("user-connected", roomId, userId);
      socket.on("user-connected", ({ id }) => {
        //TODO Implement case of user join a room

        console.log(`${id} connected`);
        //call new user
        if (!myPeer) return;
        const handleNewUserConnection = (
          userId: string,
          stream?: MediaStream
        ) => {
          const call = myPeer.call(userId, stream ?? new MediaStream());
        };
      });
      socket.on("user-disconnected", () => {
        //TODO handling disconnection of user
      });
      socket.on("user-sent-message", (message: ChatMessage) => {
        pushMessage(message);
      });
    };

    initSocket();
  }, [socket]);
  //init myPeer and set events
  useEffect(() => {
    if (!myPeer) return;

    myPeer.on("open", (id) => {
      setUserId(id);
      setSocket(io("http://localhost:8080"));
    });
  }, [myPeer]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  //handling new message

  const pushMessage = (message: ChatMessage) => {
    setMessages([...messagesRef.current, message]);
  };
  const emitMessage = (message: ChatMessage) => {
    if (!socket) return;
    //emit to other users
    socket.emit("user-sent-message", message);
  };
  return (
    // <div className="h-screen w-screen flex flex-col overflow-x-hidden sm:flex-row ">
    //   <VideoChat
    //     onToggleChat={() => {
    //       setShowChat(!showChat);
    //     }}
    //   />
    //   <Chat
    //     toggleChat={showChat}
    //     messages={messages}
    //     onPushMessage={(message: ChatMessage) => {
    //       pushMessage(message);
    //       emitMessage(message);
    //     }}
    //     userInfo={{ id: userId, username: "default" }}
    //   />
    // </div>
    <Identification
      setUser={(user: string) => {
        setUsername(user);
      }}
    />
  );
}
