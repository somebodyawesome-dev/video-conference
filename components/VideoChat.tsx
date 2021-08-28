import { Fragment, MutableRefObject, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { Video } from "../pages/room/[roomId]";

import VideoComp from "./Video";

type VideoChatProps = {
  onToggleChat: Function;
  videos: Video[];
  localStream: Video | null;
};
export default function VideoChat({
  onToggleChat,
  videos,
  localStream,
}: VideoChatProps) {
  const [toggled, setToggled] = useState(false);
  const [videosS, setVideo] = useState();
  useEffect(() => {
    videos.map((ele, index) => {
      // console.log(index);
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
      {localStream ? (
        <div className="absolute left-0 top-1/2 w-56 h-1/2">
          <VideoComp stream={localStream.stream} isMuted={true} />
        </div>
      ) : null}
      <div
        id="camera-container"
        className="camera-container w-full h-4/5  transition-all duration-1000 border-2 flex flex-wrap justify-center content-center align-middle items-center "
      >
        {/* {flex flex-col flex-wrap } */}
        {videos.map((ele, index) => {
          return (
            <div
              className="camera relative overflow-hidden align-middle self-center rounded-lg inline-block"
              key={`videoComp-${index}`}
            >
              <VideoComp stream={ele.stream} />

              {/* <div className="absolute inset-0 bg-white"></div> */}
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
