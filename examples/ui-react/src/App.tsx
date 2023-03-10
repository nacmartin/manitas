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
    console.log(e);
  };
  const gestureEnded = (e: any) => {
    console.log(e);
  };
  useEffect(() => {
    init();
    subscribe("gestureStarted", gestureStarted);
    subscribe("gestureEnded", gestureEnded);

    return () => {
      unsubscribe("gestureStarted", gestureStarted);
      unsubscribe("gestureEnded", gestureEnded);
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
