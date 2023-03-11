import { init } from "manitas";
import { useEffect, useState } from "react";

function subscribe(eventName: string, listener: any) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener: any) {
  document.removeEventListener(eventName, listener);
}

function App() {
  const [left, setLeft] = useState(50);

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
    const point = e.detail.airpoint.x * 960;
    setLeft((left) => {
      if (point < left + 50 && point > left) {
        return point - 25;
      } else {
        return left;
      }
    });
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
      <video
        id="webcam"
        autoPlay
        playsInline
        style={{ position: "absolute" }}
      />
      <div
        style={{
          position: "absolute",
          width: "960px",
          height: "720px",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "50px",
            height: "50px",
            backgroundColor: "tomato",
            opacity: 0.8,
            left: `${left}px`,
            top: "100px",
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
