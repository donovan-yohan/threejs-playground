import { extend } from "react-three-fiber";
import { shaderMaterial } from "@react-three/drei";
import fragment from "./fragment.frag";
import vertex from "./vertex.vert";

const LiquidMaterial = shaderMaterial(
  {
    effectFactor: 1.2,
    dispFactor: 0,
    tex: undefined,
    tex2: undefined,
    disp: undefined,
  },
  vertex,
  fragment
);

extend({ LiquidMaterial });
