import { init } from "manitas";
import { GestureEvent, AirfingerEvent } from "manitas";
import { useEffect, useRef } from "react";
import { useSpring, useSpringRef, animated, to } from "@react-spring/web";

function subscribe(eventName: string, listener: (e: any) => void) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener: (e: any) => void) {
  document.removeEventListener(eventName, listener);
}

function App() {
  const api = useSpringRef();
  const selected = useRef<number>(null);
  const styles = useSpring({
    ref: api,
    from: { x: 10, y: 10, scale: 1, zoom: 1 },
    config: {
      mass: 1,
      friction: 10,
      tension: 100,
      delay: 1,
      velocity: 100,
    },
  });

  const gestureStarted = (e: GestureEvent) => {
    //console.log(e);
  };
  const gestureEnded = (e: GestureEvent) => {
    //console.log(e);
  };
  const airfingerStarted = (e: AirfingerEvent) => {
    api.start({
      to: {
        scale: 5,
      },
    });
  };
  const airfingerMove = (e: AirfingerEvent) => {
    api.start({
      to: {
        x: e.detail.airpoint.x * 960,
        y: e.detail.airpoint.y * 720,
        scale: 1.5,
      },
    });
  };
  const airfingerEnded = (e: any) => {
    api.start({
      to: {
        scale: 1,
      },
    });
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
        <animated.div
          style={{
            width: 80,
            height: 80,
            background: "#ff6d6d",
            borderRadius: 8,
            opacity: 0.8,
            x: styles.x,
            y: styles.y,
            scale: to([styles.scale, styles.zoom], (s, z) => s + z),
          }}
        />
      </div>
    </div>
  );
}

export default App;
