import { Fragment, MutableRefObject, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { Video } from "../pages/room/[roomId]";

import VideoComp from "./Video";

type VideoChatProps = {
  onToggleChat: Function;
  videos: Video[];
};
export default function VideoChat({ onToggleChat, videos }: VideoChatProps) {
  const [toggled, setToggled] = useState(false);
  const [videosS, setVideo] = useState();
  useEffect(() => {
    videos.map((ele, index) => {
      console.log(index);
    });
  }, [videos]);
  const videoContainer =
    "relative bg-gray-700 box-border transition-all duration-700 ";
  const fullVideo = "h-full w-full ";
  const videoPlusChat = "h-3/4 w-full sm:h-full sm:w-3/5  md:w-4/6 lg:w-lw ";
  const buttonStyle =
    "transform z-10 absolute h-12 w-12 text-white transition-all duration-700 m-2 p-2 px-3 border-solid border-2 border-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-opacity-50 " +
    (toggled
      ? "sm:top-1/2 sm:-right-7  sm:-translate-y-1/2 sm:-translate-x-0 translate-x-1/2  -translate-y-0 right-1/2 -bottom-7 bg-blue-500"
      : "sm:right-0 sm:top-1/2  sm:-translate-y-1/2 sm:-translate-x-0 translate-x-1/2 -translate-y-0 bottom-0 right-1/2 ");

  return (
    <div
      className={videoContainer + (toggled ? videoPlusChat : fullVideo)}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="w-full h-4/5 box-border p-4 transition-all duration-1000 border-2 flex flex-col justify-center items-center flex-wrap ">
        {/* {flex flex-col flex-wrap } */}
        {videos.map((ele, index) => {
          return (
            <div
              className="relative m-2 max-w-full max-h-full min-w-1/4 min-h-1 w-1/2 h-full flex-grow"
              key={`videoComp-${index}`}
            >
              <div className="bg-cover absolute w-full h-full rounded-lg top-0 left-0 -z-0 ">
                <VideoComp stream={ele.stream} />
              </div>
            </div>
          );
        })}
      </div>
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
