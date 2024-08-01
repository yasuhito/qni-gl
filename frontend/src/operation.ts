import { AntiControlGate } from "./anti-control-gate";
import { ControlGate } from "./control-gate";
import { HGate } from "./h-gate";
import { MeasurementGate } from "./measurement-gate";
import { RnotGate } from "./rnot-gate";
import { RxGate } from "./rx-gate";
import { RyGate } from "./ry-gate";
import { RzGate } from "./rz-gate";
import { SDaggerGate } from "./s-dagger-gate";
import { SGate } from "./s-gate";
import { SwapGate } from "./swap-gate";
import { TDaggerGate } from "./t-dagger-gate";
import { TGate } from "./t-gate";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { XGate } from "./x-gate";
import { YGate } from "./y-gate";
import { ZGate } from "./z-gate";

export type Operation =
  | HGate
  | XGate
  | YGate
  | ZGate
  | RnotGate
  | SGate
  | SDaggerGate
  | TGate
  | TDaggerGate
  | RxGate
  | RyGate
  | RzGate
  | SwapGate
  | ControlGate
  | AntiControlGate
  | Write0Gate
  | Write1Gate
  | MeasurementGate;
