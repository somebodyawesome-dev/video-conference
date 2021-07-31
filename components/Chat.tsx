import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
type ChatProps = {
  toggleChat: boolean;
  messages: ChatMessage[];
  onPushMessage: (message: ChatMessage) => void;
};
export type ChatMessage = {
  name: string;
  id: string;
  text: string;
  isLocal: boolean;
};
export default function Chat({ toggleChat, onPushMessage }: ChatProps) {
  const chatStyle =
    " fixed flex flex-col justify-between box-border bg-gray-600 transition-all duration-700 h-1/4 w-full sm:h-full sm:w-2/5  md:w-2/6 lg:w-80 ";
  const displayChat = "right-0 ";
  const hideChat = "right-full ";
  return (
    <div className={chatStyle + (toggleChat ? displayChat : hideChat)}>
      {/* {message container} */}
      <div className="m-1 flex-grow flex flex-col overflow-y-auto ring-2 ring-white ring-offset-0 mb-2 rounded-lg ">
        <div className="m-2">
          <div className=" rounded my-2">
            <p className="p-2 bg-gray-700 inline-block  text-gray-200 rounded-r-lg rounded-bl-lg">
              <span className="text-gray-400 block">name:</span> message
              container
            </p>
          </div>

          <div className=" rounded my-2">
            <p className="p-2 bg-gray-700 inline-block  text-white float-right rounded-l-lg rounded-tr-lg">
              message container
            </p>
          </div>
        </div>
      </div>
      {/* {chat input} */}
      <div className="m-2 p-2 flex box-border justify-center   ring-2  ring-white rounded-lg  focus-within:ring-blue-500">
        <input
          className="outline-none  transition-all duration-700 w-full border-b-2 border-opacity-0 focus:border-opacity-70  bg-transparent"
          placeholder="type something"
          type="text"
          id="messageInput"
        />
        <div
          className="rounded-lg mx-1 transition duration-500 box-border p-2 text-white  hover:bg-white hover:text-gray-700"
          onClick={() => {
            const text = (
              document.getElementById("messageInput") as HTMLInputElement
            ).value;
            if (text === "") return;
            onPushMessage({ name: "", id: "", text, isLocal: true });
          }}
        >
          <FontAwesomeIcon className="" icon={faPaperPlane}></FontAwesomeIcon>
        </div>
      </div>
    </div>
  );
}
