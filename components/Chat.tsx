import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Chat.module.css";
import { useEffect, useRef, useState } from "react";
import { UserInfo } from "../pages/room/[roomId]";
import SocketIOFileUpload from "socketio-file-upload/client";
import { Socket } from "socket.io-client";

type ChatProps = {
  toggleChat: boolean;
  messages: ChatMessage[];
  onPushMessage: (message: ChatMessage) => void;
  userInfo: UserInfo;
  socket: Socket | null;
};
export type ChatMessage = {
  name: string;
  id: string;
  text: string;
  isLocal: boolean;
};
export default function Chat({
  toggleChat,
  onPushMessage,
  messages,
  userInfo,
  socket,
}: ChatProps) {
  const [siofu, setSiofu] = useState<any>(null);
  const siofuRef = useRef(siofu);
  const uploadRef = useRef<HTMLInputElement>(null);
  const sendMessage = () => {
    const messageInput = document.getElementById(
      "messageInput"
    ) as HTMLInputElement;
    const text = messageInput.value;
    if (text === "") return;
    messageInput.value = "";
    onPushMessage({
      name: userInfo.username,
      id: userInfo.id,
      text,
      isLocal: true,
    });
  };
  useEffect(() => {
    const scrollToBottom = () => {
      document
        .getElementById("dummyDiv")!
        .scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (!socket) return;
    setSiofu(new SocketIOFileUpload(socket));
  }, [socket]);
  useEffect(() => {
    if (!siofu) return;

    siofu.maxFileSize = 1024 * 5;
    siofu.addEventListener("error", function (data: any) {
      if (data.code === 1) {
        console.log(data);

        alert("Don't upload such a big file");
      }
    });
  }, [siofu]);
  const chatStyle =
    "fixed flex flex-col justify-between box-border bg-gray-600 transition-all duration-700 bottom-0 h-1/4 w-full sm:h-full sm:w-2/5  md:w-2/6 lg:w-80 ";
  const displayChat = "right-0 ";
  const hideChat = "-right-full ";
  return (
    <div className={chatStyle + (toggleChat ? displayChat : hideChat)}>
      <input type="file" name="" id="wiow" className="hidden" ref={uploadRef} />
      {/* {message container} */}
      <div
        className={`${styles.scroll} m-1 flex-grow flex flex-col overflow-y-auto ring-2 ring-white ring-offset-0 mb-2 rounded-lg `}
      >
        <div className="m-2 flex flex-col">
          {/* {messages goes here} */}
          {messages.map((ele, index) => {
            return getMessageDomElement(ele, index);
          })}
          <div id="dummyDiv"></div>
        </div>
      </div>
      {/* {chat input} */}
      <div className="m-2 p-2 flex box-border justify-center   ring-2  ring-white rounded-lg  focus-within:ring-blue-500">
        <input
          className="outline-none  transition-all text-white duration-700 w-full border-b-2 border-opacity-0 focus:border-opacity-70  bg-transparent"
          placeholder="type something"
          type="text"
          id="messageInput"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <div
          className="rounded-lg mx-1 transition duration-500 box-border p-2 text-white  hover:bg-white hover:text-gray-700 hover:cursor-pointer"
          onClick={() => {
            if (!siofu) return;
            siofu.prompt();
          }}
        >
          <FontAwesomeIcon className="" icon={faFileUpload}></FontAwesomeIcon>
        </div>
        <div
          className="rounded-lg mx-1 transition duration-500 box-border p-2 text-white  hover:bg-white hover:text-gray-700 hover:cursor-pointer"
          onClick={() => {
            sendMessage();
          }}
        >
          <FontAwesomeIcon className="" icon={faPaperPlane}></FontAwesomeIcon>
        </div>
      </div>
    </div>
  );
}
const getMessageDomElement = (message: ChatMessage, index: number) => {
  return message.isLocal ? (
    <div className=" rounded mb-1" key={`message-${index}`}>
      <p className="p-2 break-words max-w-4/5  bg-gray-700 inline-block  text-white float-right rounded-l-lg rounded-tr-lg">
        {message.text}
      </p>
    </div>
  ) : (
    <div className=" rounded mb-1" key={`message-${index}`}>
      <p className="p-2 break-words max-w-4/5 bg-gray-700 inline-block  text-gray-200 rounded-r-lg rounded-bl-lg">
        <span className="text-gray-400 block">
          {message.name === "" ? "user" : message.name}:
        </span>{" "}
        {message.text}
      </p>
    </div>
  );
};
