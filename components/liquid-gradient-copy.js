import { Canvas, useFrame } from "react-three-fiber";
import { useEffect } from "react";

export default function LiquidGradient() {
  useEffect(() => {});
  return (
    <div className="wrapper">
      <div className="container"></div>
      <style jsx>
        {`
          .container {
            position: absolute;
            left: -3.5%;
            top: -18vh;
            width: 103.5%;
            height: 50vh;
            background: rgb(69, 232, 252);
            background: linear-gradient(
              45deg,
              rgba(69, 232, 252, 1) 0%,
              rgba(182, 72, 255, 1) 27%,
              rgba(255, 25, 101, 1) 60%,
              rgba(252, 192, 69, 1) 84%
            );
            mix-blend-mode: multiply;
            transform: rotateZ(-10deg);
          }

          .wrapper {
            width: 100%;
            height: 65%;
            overflow: hidden;
            top: 0;
            left: 0;
            position: absolute;
          }
        `}
      </style>
    </div>
  );
}
