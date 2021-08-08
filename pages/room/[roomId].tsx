import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
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
  peer: string;
  username: string;
  stream: MediaStream;
  isfocused: boolean;
};

const useVideoStream = () => {
  const [video, setvideo] = useState<Video>({
    stream: new MediaStream(),
    isfocused: false,
    peer: "",
    username: "",
  });
  const setStream = (stream: MediaStream) => {
    setvideo({ ...video, stream });
  };
  const setPeer = (peer: string) => {
    setvideo({ ...video, peer });
  };
  const setFocus = (isfocused: boolean) => {
    setvideo({ ...video, isfocused });
  };
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
  const [localVideo, setLocalVideo] = useState<Video | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [videos, setViedos] = useState<Video[]>([]);
  const videosRef = useRef(videos);

  //utility
  const addVideoStream = (peer: string, stream: MediaStream, username = "") => {
    setViedos([
      ...videosRef.current,
      { isfocused: false, stream, peer, username },
    ]);
  };
  const initPeer = () => {
    if (!router.isReady) return;
    import("peerjs").then(({ default: Peer }) => {
      setPeer(
        new Peer(undefined, {
          debug: 2,
          config: {
            iceServers: [
              { urls: "stun:stun01.sipphone.com" },
              { urls: "stun:stun.ekiga.net" },
              { urls: "stun:stun.fwdnet.net" },
              { urls: "stun:stun.ideasip.com" },
              { urls: "stun:stun.iptel.org" },
              { urls: "stun:stun.rixtelecom.se" },
              { urls: "stun:stun.schlund.de" },
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
              { urls: "stun:stun3.l.google.com:19302" },
              { urls: "stun:stun4.l.google.com:19302" },
              { urls: "stun:stunserver.org" },
              { urls: "stun:stun.softjoys.com" },
              { urls: "stun:stun.voiparound.com" },
              { urls: "stun:stun.voipbuster.com" },
              { urls: "stun:stun.voipstunt.com" },
              { urls: "stun:stun.voxgratia.org" },
              { urls: "stun:stun.xten.com" },
              {
                urls: "turn:numb.viagenie.ca",
                credential: "muazkh",
                username: "webrtc@live.com",
              },
              {
                urls: "turn:192.158.29.39:3478?transport=udp",
                credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                username: "28224511:1379330808",
              },
              {
                urls: "turn:192.158.29.39:3478?transport=tcp",
                credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                username: "28224511:1379330808",
              },
            ],
          },
        })
      );
    });
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
      socket.on("user-connected", ({ id, username }) => {
        //TODO Implement case of user join a room
        //call new user
        if (!myPeer) return;
        const handleNewUserConnection = (
          userId: string,
          stream: MediaStream
        ) => {
          //call the new peer user

          const call = myPeer.call(userId, stream);

          //handling the other user stream
          call.on("stream", (stream) => {
            addVideoStream(userId, stream, username);
            let conn = myPeer.connect(userId, { reliable: true });
            conn.on("open", () => {
              conn.send({ peerId: userId, peerName: username });
            });
            call.on("close", () => {
              setViedos(
                videosRef.current.filter((ele) => {
                  return ele.stream !== stream;
                })
              );
            });
          });
        };
        handleNewUserConnection(id, localStream!);
      });
      socket.on("user-disconnected", (peerId) => {
        //TODO handling disconnection of user
        setViedos(
          videosRef.current.filter((ele) => {
            return ele.peer !== peerId;
          })
        );
        //remove stream from the state
      });
      socket.on("user-sent-message", (message: ChatMessage) => {
        pushMessage(message);
      });
      socket.emit("user-connected", roomId, userId, username);
    };
    initSocket();
  }, [socket]);
  //init myPeer and set events
  useEffect(() => {
    if (!myPeer) return;

    myPeer.on("open", (id) => {
      setUserId(id);
      setSocket(io("http://localhost:8080"));

      myPeer.on("connection", (cb) => {
        cb.on("open", () => {
          console.log(cb.peer);
          cb.on("data", (data) => {
            console.log(`${data.peerName} `);
            //set name  calling user
            setViedos(
              videosRef.current.map((ele) => {
                return ele.peer !== cb.peer
                  ? ele
                  : { ...ele, username: data.peerName };
              })
            );
          });
        });
      });

      //answer calls from other users
      myPeer.on("call", (call) => {
        call.answer(localStream!);
        call.on("stream", (stream) => {
          addVideoStream(call.peer, stream);
          call.on("close", () => {
            setViedos(
              videosRef.current.filter((ele) => {
                return call.peer !== ele.peer;
              })
            );
          });
        });
      });
    });
  }, [myPeer]);

  //update refrences if needed
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    videosRef.current = videos;
    resizeVideoGrid();
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
  useEffect(() => {}, [localStream]);
  return (
    <div className="h-screen w-screen flex flex-col overflow-x-hidden sm:flex-row ">
      {username === "" ? (
        <Identification
          setUser={(user: string) => {
            setUsername(user);
          }}
          addVideoStream={(stream: MediaStream) => {
            // addVideoStream(stream);
            setLocalStream(stream);
            initPeer();
          }}
          joinChat={() => {
            initPeer();
          }}
        />
      ) : (
        <Fragment>
          <VideoChat
            localStream={{
              stream: localStream!,
              isfocused: false,
              peer: userId,
              username,
            }}
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
        </Fragment>
      )}
    </div>
  );
}
