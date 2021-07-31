import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
type ChatProps = { toggleChat: boolean };
export default function Chat({ toggleChat }: ChatProps) {
  const chatStyle =
    "fixed flex flex-col justify-between box-border bg-gray-600 transition-all duration-700 bottom-0 h-1/4 w-full sm:h-full sm:w-2/5  md:w-2/6 lg:w-80 ";
  const displayChat = "right-0 ";
  const hideChat = "right-full ";
  return (
    <div className={chatStyle + (toggleChat ? displayChat : hideChat)}>
      {/* {message container} */}
      <div className="flex-grow ring-2 ring-white mb-2 rounded-lg">
        message container
      </div>
      {/* {chat input} */}
      <div className="m-2 p-2 flex box-border justify-center   ring-2  ring-white rounded-lg  focus-within:ring-blue-500">
        <input
          className="outline-none  transition-all text-white duration-700 w-full border-b-2 border-opacity-0 focus:border-opacity-70  bg-transparent"
          placeholder="type something"
          type="text"
        />
        <div className="rounded-lg mx-1 transition duration-500 box-border p-2 text-white  hover:bg-white hover:text-gray-700 hover:cursor-pointer">
          <FontAwesomeIcon className="" icon={faPaperPlane}></FontAwesomeIcon>
        </div>
      </div>
    </div>
  );
}
