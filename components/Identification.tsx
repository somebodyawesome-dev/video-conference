import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faPhone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { MediaDevicesInfo } from "../pages/room/[roomId]";

type Props = {
  setUser: (username: string) => void;
  joinChat: () => void;
  localStream: MutableRefObject<MediaStream | null>;
  setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
  mediaDeviceInfo: MediaDevicesInfo;
  setToggleMute: (mute: boolean) => void;
  setToggleCamera: (camera: boolean) => void;
};

export default function Identification({
  setUser,
  mediaDeviceInfo,
  localStream,
  setLocalStream,
  joinChat,
  setToggleMute,
  setToggleCamera,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsername] = useState("");
  const [muted, setMuted] = useState(true);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const addVideoTracks = async () => {
      if (
        !localStream.current ||
        !mediaDeviceInfo.hasVideo ||
        !mediaDeviceInfo.videoAccess
      )
        return;
      try {
        setToggleCamera(true);

        let video = videoRef.current!;
        video.srcObject = localStream.current;
        video.muted = true;
        video.play();
      } catch (error) {
        console.log(error);
      }
    };
    const removeVideoTracks = async () => {
      if (
        !localStream.current ||
        !mediaDeviceInfo.hasVideo ||
        !mediaDeviceInfo.videoAccess
      )
        return;
      try {
        setToggleCamera(false);
        let video = videoRef.current!;
        video.srcObject = null;
        video.muted = true;
        video.play();
      } catch (error) {
        console.log(error);
      }
    };
    if (video) {
      addVideoTracks();
    } else {
      removeVideoTracks();
    }
  }, [video]);
  useEffect(() => {
    if (!videoRef.current) return;
    const removeAudioTrack = async () => {
      if (
        !localStream.current ||
        !mediaDeviceInfo.hasVideo ||
        !mediaDeviceInfo.videoAccess
      )
        return;
      try {
        setToggleMute(false);
      } catch (error) {
        console.log(error);
      }
    };
    const addAudioTrack = async () => {
      if (
        !localStream.current ||
        !mediaDeviceInfo.hasVideo ||
        !mediaDeviceInfo.videoAccess
      )
        return;
      try {
        setToggleMute(true);
      } catch (error) {
        console.log(error);
      }
    };

    if (muted) {
      removeAudioTrack();
    } else {
      addAudioTrack();
    }
  }, [muted]);
  return (
    <div className="flex flex-col items-stretch z-251 text-xl absolute bg-gray-800 inset-0 m-0 p-0">
      <canvas ref={canvasRef} className="w-0 h-0"></canvas>
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
                  setLocalStream(localStream.current);
                  joinChat();
                }}
                className="bg-blue-600 border-2 border-solid select-none border-blue-600 rounded box-border text-white inline-block text-base py-2 px-4 relative text-center w-80 cursor-pointer"
              >
                Rejoindre Réunion
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6 mb-4 mx-0 w-full select-none">
            <div className="my-0 mx-3 items-center box-border flex relative z-250 justify-between bg-gray-900 rounded-md p-2 text-center w-48">
              <button
                disabled={
                  !mediaDeviceInfo.hasAudio || !mediaDeviceInfo.audioAccess
                }
                className="text-white cursor-pointer text-center rounded-md ml-1 p-2 hover:bg-gray-500 disabled:opacity-50 disabled:text-red-500 disabled:hover:bg-transparent disabled:cursor-default"
                onClick={() => {
                  setMuted(!muted);
                }}
              >
                <div className="rounded flex justify-center w-8 ">
                  {muted ? (
                    <FontAwesomeIcon icon={faMicrophoneSlash}></FontAwesomeIcon>
                  ) : (
                    <FontAwesomeIcon icon={faMicrophone}></FontAwesomeIcon>
                  )}
                </div>
              </button>
              <button
                disabled={
                  !mediaDeviceInfo.hasVideo || !mediaDeviceInfo.videoAccess
                }
                className="text-white cursor-pointer text-center rounded-md mx-5 p-2 hover:bg-gray-500 disabled:opacity-50 disabled:text-red-500 disabled:hover:bg-transparent disabled:cursor-default"
                onClick={() => {
                  setVideo(!video);
                }}
              >
                <div className="rounded flex justify-center w-8">
                  {video ? (
                    <FontAwesomeIcon icon={faVideo}></FontAwesomeIcon>
                  ) : (
                    <FontAwesomeIcon icon={faVideoSlash}></FontAwesomeIcon>
                  )}
                </div>
              </button>
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
