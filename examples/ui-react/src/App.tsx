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
    //console.log(e);
  };
  const gestureEnded = (e: any) => {
    //console.log(e);
  };
  const airfingerStarted = (e: any) => {
    console.log("start", e.detail.hand, e.detail.airpoint);
  };
  const airfingerMove = (e: any) => {
    console.log("move", e.detail.hand, e.detail.airpoint);
  };
  const airfingerEnded = (e: any) => {
    console.log("end", e.detail.hand, e.detail.airpoint);
  };
  useEffect(() => {
    init();
    subscribe("gesturestart", gestureStarted);
    subscribe("gestureend", gestureEnded);
    subscribe("airfingerstart", airfingerStarted);
    subscribe("airfingerend", airfingerEnded);
    subscribe("airfingermove", airfingerMove);

    return () => {
      unsubscribe("gesturestart", gestureStarted);
      unsubscribe("gestureend", gestureEnded);
      unsubscribe("airfingerstart", airfingerStarted);
      unsubscribe("airfingerend", airfingerEnded);
      unsubscribe("airfingermove", airfingerMove);
    };
  }, []);

  return (
    <div>
      <video id="webcam" autoPlay playsInline />
      <canvas id="output_canvas" />
    </div>
  );
}

export default App;
