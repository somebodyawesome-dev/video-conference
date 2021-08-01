import { useEffect, useRef } from "react";

export default function Identification() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    console.log("selem sehpi");

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

  return (
    <div className="flex flex-row w-screen h-screen">
      <video ref={videoRef} className="object-cover w-full h-full"></video>
      <input type="text" placeholder="Please enter your name" className="" />
    </div>
  );
}
