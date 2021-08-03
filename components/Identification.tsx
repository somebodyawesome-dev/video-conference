import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

type usernameProps = {
  setUser: (username: string) => void;
};

export default function Identification({ setUser }: usernameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!videoRef.current) return;

    navigator.mediaDevices
      .getUserMedia({
        video: {},
      })
      .then((stream) => {
        let video = videoRef.current!;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  }, []);

  const [dropdown, Setdropdown] = useState(false);

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
                  setUser(username);
                }}
                className="bg-blue-600 border-2 border-solid select-none border-blue-600 rounded box-border text-white inline-block text-base py-2 px-4 relative text-center w-80 cursor-pointer"
              >
                Rejoindre Réunion
                {/* <div
                  className="rounded items-center flex h-full justify-center absolute right-0 top-0 w-9 hover:bg-blue-800"
                  onClick={() => {
                    Setdropdown(!dropdown);
                  }}
                >
                  {!dropdown && (
                    <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
                  )}
                  {dropdown && (
                    <div className="absolute top-full right-0 bg-white p-0 rounded box-content text-blue-300 max-h-96 z-">
                      <div className="w-80 py-2 px-0">
                        <div className="items-center text-gray-900 cursor-pointer flex h-12 text-base py-0 px-4 select-none">
                          Rejoignez sans microphone
                        </div>
                      </div>
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
