import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Chat, { ChatMessage } from "../../components/Chat";
import VideoChat from "../../components/VideoChat";
import io, { Socket } from "socket.io-client";
// import { MyPeer } from "../../types/MyPeer";

import Peer from "peerjs";
import Identification from "../../components/Identification";
import { resizeVideoGrid } from "../../utils/VideoGridHandler";

type RoomProps = {};
export type UserInfo = {
  id: string;
  username: string;
};
export type Video = {
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
  const messagesRef = useRef(messages);
  const [videos, setViedos] = useState<Video[]>([]);
  const videosRef = useRef(videos);
  const peers = useRef<any>({});
  //utility
  const addVideoStream = (stream: MediaStream) => {
    setViedos([...videosRef.current, { isfocused: false, stream }]);
  };
  //
  useEffect(() => {
    console.log("load event set");
    window.addEventListener(
      "load",
      function (event) {
        resizeVideoGrid();
        window.onresize = resizeVideoGrid;
      },
      false
    );
  }, []);
  //getting room id
  useEffect(() => {
    // if (!router.isReady) return;
    // import("peerjs").then(({ default: Peer }) => {
    //   setPeer(new Peer());
    // });
  }, [router.isReady]);
  //connect to socket server and init events
  useEffect(() => {
    if (!socket) return;
    const initSocket = () => {
      socket.on("user-connected", ({ id }) => {
        //TODO Implement case of user join a room
        console.log(`${id} connected`);
        //call new user
        if (!myPeer) return;
        const handleNewUserConnection = (
          userId: string,
          stream: MediaStream
        ) => {
          //call the new peer user
          const call = myPeer.call(userId, stream ?? new MediaStream());
          //handling the other user stream
          call.on("stream", (stream) => {
            addVideoStream(stream);
            call.on("close", () => {
              setViedos(
                videosRef.current.filter((ele) => {
                  return ele.stream !== stream;
                })
              );
            });
          });
          console.log("use length :" + videos.length);
          peers.current[userId] = call;
        };
        handleNewUserConnection(id, videosRef.current[0].stream);
      });
      socket.on("user-disconnected", (peerId) => {
        //TODO handling disconnection of user
        if (peers.current[peerId]) peers.current[peerId].close();
      });
      socket.on("user-sent-message", (message: ChatMessage) => {
        pushMessage(message);
      });
      socket.emit("user-connected", roomId, userId);
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
    //answer calls from other users
    myPeer.on("call", (call) => {
      call.answer(videosRef.current[0].stream);
      call.on("stream", (stream) => {
        addVideoStream(stream);
      });
    });
  }, [myPeer]);

  //update refrences if needed
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    resizeVideoGrid();
    videosRef.current = videos;
  }, [videos]);
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
    <div className="h-screen w-screen flex flex-col overflow-x-hidden sm:flex-row ">
      {username === "" ? (
        <Identification
          setUser={(user: string) => {
            setUsername(user);
          }}
          addVideoStream={(stream: MediaStream) => {
            addVideoStream(stream);
            if (!router.isReady) return;
            import("peerjs").then(({ default: Peer }) => {
              setPeer(new Peer());
            });
          }}
        />
      ) : null}
      <VideoChat
        onToggleChat={() => {
          setShowChat(!showChat);
        }}
        videos={videos}
      />
      <Chat
        toggleChat={showChat}
        messages={messages}
        onPushMessage={(message: ChatMessage) => {
          pushMessage(message);
          emitMessage(message);
        }}
        userInfo={{ id: userId, username }}
      />
    </div>
  );
}
