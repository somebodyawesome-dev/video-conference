import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faPhone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  setUser: (username: string) => void;
  addVideoStream: (stream: MediaStream) => void;
  joinChat: () => void;
};

export default function Identification({ setUser, addVideoStream }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [username, setUsername] = useState("");
  const [muted, setMuted] = useState(true);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!muted || video) {
      navigator.mediaDevices
        .getUserMedia({
          video: video,
          audio: !muted,
        })
        .then((stream) => {
          let video = videoRef.current!;
          video.srcObject = stream;
          video.muted = true;
          if (video) {
            video.play();
          } else {
            console.log(video);

            stream.getTracks().forEach((track) => {
              track.stop();
            });
          }
        })
        .catch((err) => {
          console.error("error:", err);
        });
    } else {
      videoRef.current!.srcObject = null;
    }
  }, [muted, video]);

  return (
    <div className="flex flex-col items-stretch z-251 text-xl absolute bg-gray-800 inset-0 m-0 p-0">
      <div className="w-screen h-screen">
        <video
          ref={videoRef}
          className="absolute object-cover w-full h-full"
        ></video>
      </div>
      <div className="flex-1 flex-col justify-end pb-6 z-252 items-center">
        <div className="m-0 p-0">
          <div className="my-0 mx-auto text-center block">
            <label className="block mb-2 text-white font-light text-base select-none">
              Merci de saisir votre nom pour rejoindre
            </label>
            <input
              type="text"
              placeholder="Merci de saisir votre nom ici"
              className="bg-white border-none outline-none rounded text-base text-gray-900 py-2 px-0 text-center w-80 focus:shadow-custom"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <div className="mt-4 ">
              <div
                onClick={() => {
                  if (username === "") return;
                  setUser(username);
                  addVideoStream(videoRef.current!.srcObject as MediaStream);
                }}
                className="bg-blue-600 border-2 border-solid select-none border-blue-600 rounded box-border text-white inline-block text-base py-2 px-4 relative text-center w-80 cursor-pointer"
              >
                Rejoindre Réunion
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6 mb-4 mx-0 w-full select-none">
            <div className="my-0 mx-3 items-center box-border flex relative z-250 justify-between bg-gray-900 rounded-md p-2 text-center w-48">
              <div
                className="text-white cursor-pointer text-center rounded-md ml-1 p-2 hover:bg-gray-500"
                onClick={() => {
                  setMuted(!muted);
                }}
              >
                <div className="rounded flex ">
                  {!muted && (
                    <FontAwesomeIcon icon={faMicrophone}></FontAwesomeIcon>
                  )}
                  {muted && (
                    <FontAwesomeIcon icon={faMicrophoneSlash}></FontAwesomeIcon>
                  )}
                </div>
              </div>
              <div
                className="text-white cursor-pointer text-center rounded-md mx-5 p-2 hover:bg-gray-500"
                onClick={() => {
                  setVideo(!video);
                }}
              >
                <div className="rounded flex ">
                  {video && <FontAwesomeIcon icon={faVideo}></FontAwesomeIcon>}
                  {!video && (
                    <FontAwesomeIcon icon={faVideoSlash}></FontAwesomeIcon>
                  )}
                </div>
              </div>
              <div className="bg-red-600 text-center cursor-pointer rounded-md mr-1 p-2 hover:bg-red-400">
                <div className="rounded flex ">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-white"
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
