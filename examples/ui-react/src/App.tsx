import { init } from "manitas";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("call init");
    init();
  }, []);

  console.log("render");
  return (
    <div>
      <video id="webcam" autoPlay playsInline />
      <canvas id="output_canvas" />
    </div>
  );
}

export default App;
