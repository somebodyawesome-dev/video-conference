import { Fragment, MutableRefObject, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCommentAlt,
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { MediaDevicesInfo, Video } from "../pages/room/[roomId]";

import VideoComp from "./Video";

type VideoChatProps = {
  onToggleChat: Function;
  videos: Video[];
  localStream: Video | null;
  setToggleMute: (mute: boolean) => void;
  setToggleCamera: (camera: boolean) => void;
  toggleMute: boolean;
  toggleCamera: boolean;
  mediaDeviceInfo: MediaDevicesInfo;
};
export default function VideoChat({
  onToggleChat,
  videos,
  localStream,
  setToggleMute,
  setToggleCamera,
  toggleCamera,
  toggleMute,
  mediaDeviceInfo,
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
      <div className="absolute left-4 bottom-16 w-40 h-[180px] rounded">
        {localStream ? (
          <VideoComp stream={localStream.stream} isMuted={true} />
        ) : (
          <div className="absolute inset-0  bg-white"></div>
        )}
      </div>
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
              {ele.video ? (
                <VideoComp stream={ele.stream} />
              ) : (
                <div className="absolute inset-0 bg-black flex justify-center items-center">
                  <div className="bg-yellow-300 w-1/2 h-1/2 p-5 rounded-[50%] flex justify-center items-center ">
                    <h1 className="text-4xl font-bold text-white">
                      {ele.username[0]?.toUpperCase()}
                    </h1>
                  </div>
                </div>
              )}
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
      <div className="absolute flex bg-gray-900 rounded bottom-[15%] ">
        <button
          disabled={!mediaDeviceInfo.hasAudio || !mediaDeviceInfo.audioAccess}
          className="m-2 py-2 px-3  text-white hover:bg-gray-400 rounded disabled:text-red-500 disabled:text-opacity-50 disabled:hover:bg-transparent disabled:cursor-default"
          onClick={() => {
            setToggleMute(!toggleMute);
          }}
        >
          <FontAwesomeIcon
            className=""
            icon={toggleMute ? faMicrophone : faMicrophoneSlash}
          ></FontAwesomeIcon>
        </button>
        <button
          disabled={!mediaDeviceInfo.hasVideo || !mediaDeviceInfo.videoAccess}
          className="m-2 py-2 px-3  text-white hover:bg-gray-400 rounded disabled:text-red-500 disabled:text-opacity-50 disabled:hover:bg-transparent disabled:cursor-default"
          onClick={() => {
            setToggleCamera(!toggleCamera);
          }}
        >
          <FontAwesomeIcon
            className=""
            icon={toggleCamera ? faVideo : faVideoSlash}
          ></FontAwesomeIcon>
        </button>
        <button className="m-2 py-2 px-3  text-white bg-red-600 hover:bg-red-400 rounded">
          <FontAwesomeIcon className="" icon={faPhone}></FontAwesomeIcon>
        </button>
      </div>
    </div>
  );
}
