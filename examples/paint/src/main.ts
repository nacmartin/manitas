import { setupPaint } from "./paint";
import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";

document.querySelector<HTMLDivElement>("#root")!.innerHTML = `
      <center>
        <h1>Manitas React Example</h1>
        <p>
          (This example is much better in desktop, not ready for mobile yet!)
        </p>
      </center>
      <div class="center">
        <video
          id="webcam"
          autoPlay
          playsInline
          style="height: 960px; width: 1280px"
          class="cam"
        >
        </video>
        <canvas
          id="canvas"
          class="canvas"
          width=1280 height=960
        >
        </canvas>
      </div>
  <div>
`;

setupPaint(document.querySelector<HTMLCanvasElement>("#canvas"));

//setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
