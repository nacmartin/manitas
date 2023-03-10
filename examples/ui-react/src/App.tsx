import { init } from "manitas";
import { useEffect } from "react";

function subscribe(eventName: string, listener: any) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener: any) {
  document.removeEventListener(eventName, listener);
}

function App() {
  const gestureStarted = (e: any) => {
    console.log("started!");
    console.log(e);
  };
  useEffect(() => {
    console.log("'init");
    init();
    subscribe("gestureStarted", (e: any) => gestureStarted(e));

    return () => {
      unsubscribe("gesturestarted", (e: any) => gestureStarted(e));
    };
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
