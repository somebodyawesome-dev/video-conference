// Area:
function Area(
  Increment: number,
  Count: number,
  Width: number,
  Height: number,
  Margin = 10
) {
  let i = 0;
  let w = 0;
  let h = Increment * 0.75 + Margin * 2;
  while (i < Count) {
    if (w + Increment > Width) {
      w = 0;
      h = h + Increment * 0.75 + Margin * 2;
    }
    w = w + Increment + Margin * 2;
    i++;
  }
  if (h > Height) return false;
  else return Increment;
}
// Dish:
function resizeVideoGrid() {
  // variables:
  const Scenary = document.getElementById("camera-container");
  if (!Scenary) return;
  const Margin = 8;
  const Width = Scenary.offsetWidth - Margin * 2;
  const Height = Scenary.offsetHeight - Margin * 2;
  const Cameras = document.getElementsByClassName("camera");
  let max = 0;

  // loop (i recommend you optimize this)
  let i = 1;
  while (i < 5000) {
    let w = Area(i, Cameras.length, Width, Height, Margin);
    if (w === false) {
      max = i - 1;
      break;
    }
    i++;
  }

  // set styles
  max = max - Margin * 2;
  setWidth(max, Margin);
}

// Set Width and Margin
function setWidth(width: number, margin: number) {
  const Cameras = document.getElementsByClassName("camera");
  for (var s = 0; s < Cameras.length; s++) {
    const htmlElem = Cameras[s] as HTMLElement;
    htmlElem.style.width = width + "px";
    htmlElem.style.margin = margin + "px";
    htmlElem.style.height = width * 0.75 + "px";
  }
}

// const resizeObserver = new MutationObserver(function (mutations: any) {
//   console.log("size changed!");
// });

export { resizeVideoGrid };
