import { useState } from "react";

type VideoChatProps = {
  onToggleChat: Function;
};
export default function VideoChat({ onToggleChat }: VideoChatProps) {
  const [toggled, setToggled] = useState(false);

  const videoContainer = " bg-gray-700 box-border transition-all duration-700 ";
  const fullVideo = "h-full w-full ";
  const videoPlusChat = "h-3/4 w-full sm:h-full sm:w-3/5  md:w-4/6 lg:w-lw";
  return (
    <div
      className={
        toggled ? videoContainer + videoPlusChat : videoContainer + fullVideo
      }
      style={{}}
    >
      video calls
      <button
        className="transition m-2 p-2 px-3 border-solid border-2 border-blue-500 rounded-lg hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-opacity-50"
        onClick={() => {
          setToggled(!toggled);
          onToggleChat();
        }}
      >
        ~~
      </button>
    </div>
  );
}
