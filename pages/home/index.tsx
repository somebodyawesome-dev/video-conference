import { useState } from "react";
import "tailwindcss/tailwind.css";
export default function home() {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="w-full h-full grid grid-cols-chatGrid grid-rows-1">
      <div className="bg-blue-900 bg-opacity-60 w-full h-full grid grid-cols-1 grid-rows-2 justify-between">
        <div>
          <p>hello</p>
        </div>
        <div>
          <input
            className="w-full border-2 focus:border-blue-400 rounded-md focus:border-solid  outline-none"
            type="text"
            placeholder="Écrire votre message"
          />
        </div>
      </div>
      <div></div>
    </div>
  );
}
