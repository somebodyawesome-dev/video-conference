import { useRouter } from "next/router";
import { Fragment, MutableRefObject, useEffect, useRef, useState } from "react";
import Chat, { ChatMessage } from "../../components/Chat";
import VideoChat from "../../components/VideoChat";
import io, { Socket } from "socket.io-client";
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
  audio: boolean;
  video: boolean;
};
export type MediaDevicesInfo = {
  hasVideo: boolean;
  hasAudio: boolean;
  audioAccess: boolean;
  videoAccess: boolean;
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
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef(localStream);
  const [videos, setVideos] = useState<Video[]>([]);
  const videosRef = useRef(videos);
  const [toggleCamera, setToggleCamera] = useState(false);
  const [toggleMute, setToggleMute] = useState(false);
  const [mediaDeviceInfo, setMediaDeviceInfo] = useState<MediaDevicesInfo>({
    hasAudio: false,
    hasVideo: false,
    audioAccess: false,
    videoAccess: false,
  });
  //utility
  const addVideoStream = (
    peer: string,
    stream: MediaStream,
    username = "",
    audio = false,
    video = false
  ) => {
    setVideos([
      ...videosRef.current,
      { isfocused: false, stream, peer, username, audio, video },
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
    const getMediaDeviceInfo = async () => {
      if (!navigator.mediaDevices) return;
      let devices = null;
      let hasVideo = false;
      let hasAudio = false;
      let audioAccess = false;
      let videoAccess = false;
      try {
        devices = await navigator.mediaDevices.enumerateDevices();
        for (const dev of devices) {
          if (dev.kind === "audioinput") {
            hasAudio = true;
          }
          if (dev.kind === "videoinput") {
            hasVideo = true;
          }
        }
        let videoStream: MediaStream | null = null;
        let audioStream: MediaStream | null = null;
        try {
          videoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoAccess = true;
        } catch (err) {
          videoAccess = false;
        }
        try {
          audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          audioAccess = true;
        } catch (err) {
          audioAccess = false;
        }
        setMediaDeviceInfo({ hasAudio, hasVideo, audioAccess, videoAccess });
        let tracks: MediaStreamTrack[] = [];

        videoStream
          ? (tracks = tracks.concat(videoStream.getVideoTracks()))
          : null;
        audioStream
          ? (tracks = tracks.concat(audioStream.getAudioTracks()))
          : null;
        for (const track of tracks) {
          track.enabled = false;
        }
        setLocalStream(new MediaStream(tracks));
      } catch (error) {
        console.log(error);
      }
    };
    getMediaDeviceInfo();
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

  //connect to socket server and init events
  useEffect(() => {
    if (!socket) return;
    const initSocket = () => {
      socket.on("user-connected", ({ id, user, audio, video }) => {
        //call new user

        if (!myPeer) return;
        const handleNewUserConnection = (
          userId: string,
          stream: MutableRefObject<MediaStream | null>
        ) => {
          //call the new peer user

          const call = myPeer.call(userId, stream.current!);
          console.log("new user connected");
          call.on("stream", (stream) => {
            console.log(stream.id);
            addVideoStream(userId, stream, user, audio, video);
            let conn = myPeer.connect(userId, { reliable: true });
            conn.on("open", () => {
              conn.send({
                peerId: userId,
                peerName: username,
                mute: toggleMute,
                video: toggleCamera,
              });
            });
            call.on("close", () => {
              setVideos(
                videosRef.current.filter((ele) => {
                  return ele.stream !== stream;
                })
              );
            });
            conn.on("error", (err) => {
              console.log("err");
            });
          });
          //handling the other user stream
          call.on("error", (err) => {
            console.log("error");
            console.log(err);
          });
        };
        handleNewUserConnection(id, localStreamRef);
      });
      socket.on("user-toggle-video", (id: string, video: boolean) => {
        setVideos(
          videosRef.current.map((ele) => {
            return ele.peer !== id ? ele : { ...ele, video };
          })
        );
      });
      socket.on("user-toggle-audio", (id: string, audio: boolean) => {
        setVideos(
          videosRef.current.map((ele) => {
            return ele.peer !== id ? ele : { ...ele, audio };
          })
        );
      });
      socket.on("user-disconnected", (peerId) => {
        //TODO handling disconnection of user
        setVideos(
          videosRef.current.filter((ele) => {
            return ele.peer !== peerId;
          })
        );
        //remove stream from the state
      });
      socket.on("user-sent-message", (message: ChatMessage) => {
        pushMessage(message);
      });
      socket.emit(
        "user-connected",
        roomId,
        userId,
        username,
        toggleMute,
        toggleCamera
      );
    };
    initSocket();
  }, [socket]);
  //init myPeer and set events
  useEffect(() => {
    if (!myPeer) return;

    myPeer.on("open", (id) => {
      setUserId(id);

      //recieving new user name
      myPeer.on("connection", (cb) => {
        cb.on("open", () => {
          console.log(cb.peer);
          cb.on("data", (data) => {
            console.log(`${"user connected : " + data.peerName} `);
            //set name  calling user
            setVideos(
              videosRef.current.map((ele) => {
                return ele.peer !== cb.peer
                  ? ele
                  : {
                      ...ele,
                      username: data.peerName,
                      mute: data.mute,
                      video: data.video,
                    };
              })
            );
          });
        });
      });

      //answer calls from other users
      myPeer.on("call", (call) => {
        call.answer(localStreamRef.current!);

        call.on("stream", (stream) => {
          console.log(call.peer);
          addVideoStream(call.peer, stream);
        });
        call.on("close", () => {
          setVideos(
            videosRef.current.filter((ele) => {
              return call.peer !== ele.peer;
            })
          );
        });
        call.on("error", (err) => {
          console.log(err);
        });
      });

      myPeer.on("error", (err) => {
        console.log(err);
      });

      setSocket(io("http://localhost:8080"));
    });
  }, [myPeer]);

  //update refrences if needed
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    videosRef.current = videos;
    for (const vid of videos) {
      const vidTracks = vid.stream.getVideoTracks();
      for (const track of vidTracks) {
        track.enabled = vid.video;
      }
      const audTracks = vid.stream.getAudioTracks();
      for (const track of audTracks) {
        track.enabled = vid.audio;
      }
    }
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
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);
  useEffect(() => {
    if (!localStreamRef.current) return;
    const tracks = localStreamRef.current.getVideoTracks();
    for (const track of tracks) {
      track.enabled = toggleCamera;
    }
    if (!socket) return;
    socket.emit("user-toggle-video", toggleCamera);
  }, [toggleCamera]);
  useEffect(() => {
    if (!localStreamRef.current) return;
    const tracks = localStreamRef.current.getAudioTracks();
    for (const track of tracks) {
      track.enabled = toggleMute;
    }
    if (!socket) return;
    socket.emit("user-toggle-audio", toggleMute);
  }, [toggleMute]);
  return (
    <div className="h-screen w-screen flex flex-col overflow-x-hidden sm:flex-row ">
      {username === "" ? (
        <Identification
          setUser={(user: string) => {
            setUsername(user);
          }}
          joinChat={() => {
            initPeer();
          }}
          localStream={localStreamRef}
          setLocalStream={setLocalStream}
          mediaDeviceInfo={mediaDeviceInfo}
          setToggleCamera={setToggleCamera}
          setToggleMute={setToggleMute}
        />
      ) : (
        <Fragment>
          <VideoChat
            localStream={{
              stream: localStream!,
              isfocused: false,
              peer: userId,
              username,
              audio: toggleMute,
              video: toggleCamera,
            }}
            onToggleChat={() => {
              setShowChat(!showChat);
              resizeVideoGrid();
            }}
            videos={videos}
            setToggleCamera={setToggleCamera}
            setToggleMute={setToggleMute}
            toggleMute={toggleMute}
            toggleCamera={toggleCamera}
            mediaDeviceInfo={mediaDeviceInfo}
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
