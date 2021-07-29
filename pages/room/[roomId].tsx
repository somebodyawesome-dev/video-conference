import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Chat from "../../components/Chat";
import VideoChat from "../../components/VideoChat";
import io, { Socket } from "socket.io-client";
type RoomProps = {};

const useIOSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState("xxx-xxx-xxx");
  const connectTo = (id: string) => {
    setRoom(id);
    setSocket(io(url));
  };
  // useEffect(() => {
  // setSocket(io(url));
  // }, [room]);
  useEffect(() => {
    if (!socket) return;
    socket!.emit("user-connected", room, "wiow");
    socket!.on("user-sent-msg", () => {});
  }, [socket]);
  return [socket, connectTo] as const;
};
export default function room({}: RoomProps) {
  const router = useRouter();
  const roomId = router.query.roomId as string;

  const [socket, setSocket] = useState<Socket | null>(null);
  //init vars
  const [showChat, setShowChat] = useState(false);

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
    // "wiow" bich y3awdhha mba3ed peer id
    socket.emit("user-connected", roomId, "wiow");
    socket.on("user-connected", ({ id }) => {
      console.log(`${id} connected`);
    });
    socket.on("user-sent-msg", () => {});
  }, [socket]);
  return (
    <div className="h-screen w-screen flex flex-col sm:flex-row ">
      <VideoChat
        onToggleChat={() => {
          setShowChat(!showChat);
        }}
      />
      <Chat toggleChat={showChat} />
    </div>
  );
}
// interface IParams extends ParsedUrlQuery {
//   roomId: string;
// }
// export const getStaticProps: GetStaticProps = async (context) => {
//   const { roomId } = context.params as IParams;
//   return {
//     props: { roomId },
//   };
// };
// export async function getStaticPaths() {
//   return {
//     paths: ["/room/*"],
//     fallback: false,
//   };
// }
