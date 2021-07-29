type ChatProps = { toggleChat: boolean };
export default function Chat({ toggleChat }: ChatProps) {
  const chatStyle =
    "p-4 fixed flex flex-col justify-between box-border bg-gray-600 transition-all duration-700 h-1/4 w-full sm:h-full sm:w-2/5  md:w-2/6 lg:w-80 ";
  const displayChat = "right-0 ";
  const hideChat = "right-full ";
  return (
    <div className={chatStyle + (toggleChat ? displayChat : hideChat)}>
      <div>message container</div>

      <div className=" relative p-2  w-full ring-2  ring-white rounded-lg ">
        <input
          className="outline-none  transition-all duration-700 w-full border-b-2 border-opacity-0 focus:border-opacity-70  bg-transparent"
          placeholder="type something"
          type="text"
        />
      </div>
    </div>
  );
}
