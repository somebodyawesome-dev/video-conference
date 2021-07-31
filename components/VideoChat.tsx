import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";

type VideoChatProps = {
  onToggleChat: Function;
};
export default function VideoChat({ onToggleChat }: VideoChatProps) {
  const [toggled, setToggled] = useState(false);

  const videoContainer =
    "relative bg-gray-700 box-border transition-all duration-700 ";
  const fullVideo = "h-full w-full ";
  const videoPlusChat = "h-3/4 w-full sm:h-full sm:w-3/5  md:w-4/6 lg:w-lw";
  const buttonStyle =
    "z-10 top-1/2 absolute text-white transition-all duration-700 m-2 p-2 px-3 border-solid border-2 border-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-opacity-50 " +
    (toggled ? "-right-7 " : "right-0");

  return (
    <div
      className={
        toggled ? videoContainer + videoPlusChat : videoContainer + fullVideo
      }
      style={{}}
    >
      video calls
      <button
        className={buttonStyle}
        onClick={() => {
          setToggled(!toggled);
          onToggleChat();
        }}
      >
        <FontAwesomeIcon className="" icon={faCommentAlt}></FontAwesomeIcon>
      </button>
    </div>
  );
}
