import type { TargetAndTransition, Transition } from "motion/react"

type Clip = { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition }
export const clips: Record<string, Clip> = {
"412:201": {initial:{ opacity: 0, y: 24, }, animate:{ opacity: [0, 0, 1], y: [24, 24, 0], }, transition:{ opacity: { duration: 2, times: [0, 0.9999, 1], ease: ["linear", "easeOut"], repeat: 0 }, y: { duration: 2, times: [0, 0.9999, 1], ease: ["linear", "easeOut"], repeat: 0 }, }},
"412:216": {initial:{ opacity: 0.5, x: -144, }, animate:{ opacity: [0.5, 1, 1], x: [-144, -6, -6], }, transition:{ opacity: { duration: 2, times: [0, 0.25, 1], ease: ["easeIn", "linear"], repeat: 0 }, x: { duration: 2, times: [0, 0.225, 1], ease: "linear", repeat: 0 }, }},
"412:221": {initial:{ opacity: 0.8, }, animate:{ opacity: [0.8, 1, 1], }, transition:{ opacity: { duration: 2, times: [0, 0.35, 1], ease: ["easeOut", "linear"], repeat: 0 }, }},
"412:230": {initial:{ opacity: 0.5, x: -118.824, y: -2.24, }, animate:{ opacity: [0.5, 1, 1], x: [-118.824, 14.283, 14.283], y: [-2.24, -1.732, -1.732], }, transition:{ opacity: { duration: 2, times: [0, 0.35, 1], ease: ["easeIn", "linear"], repeat: 0 }, x: { duration: 2, times: [0, 0.249, 1], ease: "linear", repeat: 0 }, y: { duration: 2, times: [0, 0.249, 1], ease: "linear", repeat: 0 }, }},
"412:235": {initial:{ opacity: 0.8, }, animate:{ opacity: [0.8, 1, 1], }, transition:{ opacity: { duration: 2, times: [0, 0.25, 1], ease: ["easeOut", "linear"], repeat: 0 }, }},
"434:1318": {initial:{ opacity: 0, }, animate:{ opacity: [0, 1, 1], }, transition:{ opacity: { duration: 2, times: [0, 0.25, 1], ease: ["easeOut", "linear"], repeat: 0 }, }},
"433:307": {initial:{ height: 416, scaleX: 0.8, scaleY: 0.8, width: 573, }, animate:{ height: [416, 366, 366], scaleX: [0.8, 1, 1], scaleY: [0.8, 1, 1], width: [573, 523, 523], }, transition:{ height: { duration: 2, times: [0, 0.25, 1], ease: ["easeIn", "linear"], repeat: 0 }, scaleX: { duration: 2, times: [0, 0.2485, 1], ease: [[0.5, 0, 0.5, 1], "linear"], repeat: 0 }, scaleY: { duration: 2, times: [0, 0.2485, 1], ease: [[0.5, 0, 0.5, 1], "linear"], repeat: 0 }, width: { duration: 2, times: [0, 0.25, 1], ease: ["easeIn", "linear"], repeat: 0 }, }},
"434:938": {initial:{ x: 0, y: 0, }, animate:{ x: [0, 274, 274], y: [0, -2, -2], }, transition:{ x: { duration: 2, times: [0, 0.2105, 1], ease: "linear", repeat: 0 }, y: { duration: 2, times: [0, 0.2105, 1], ease: "linear", repeat: 0 }, }},
"412:288": {initial:{ x: 0, }, animate:{ x: [0, 0, 274.5, 274.5], }, transition:{ x: { duration: 2, times: [0, 0.001, 0.21, 1], ease: "linear", repeat: 0 }, }},
"432:186": {initial:{ opacity: 0, }, animate:{ opacity: [0, 1, 1], }, transition:{ opacity: { duration: 2, times: [0, 0.152, 1], ease: ["easeIn", "linear"], repeat: 0 }, }},
"432:193": {initial:{ opacity: 0.08, }, animate:{ opacity: [0.08, 1, 1], }, transition:{ opacity: { duration: 2, times: [0, 0.25, 1], ease: [[0.45, 1.45, 0.8, 1], "linear"], repeat: 0 }, }},
"415:307": {initial:{ x: -200, }, animate:{ x: [-200, 0, 0], }, transition:{ x: { duration: 2, times: [0, 0.25, 1], ease: ["easeOut", "linear"], repeat: 0 }, }},
"415:299": {initial:{ x: 200, }, animate:{ x: [200, 0, 0], }, transition:{ x: { duration: 2, times: [0, 0.25, 1], ease: ["easeOut", "linear"], repeat: 0 }, }},
"415:301": {initial:{ y: -200, }, animate:{ y: [-200, -155.225, -119.621, -93.668, -80.051, -84, -83.987, -83.987], }, transition:{ y: { duration: 2, times: [0, 0.05, 0.1, 0.15, 0.2, 0.2485, 0.25, 1], ease: "linear", repeat: 0 }, }},
"432:199": {initial:{ y: 200, }, animate:{ y: [200, 198.637, 158.678, 126.941, 104.855, 95.106, 103.006, 103, 103], }, transition:{ y: { duration: 2, times: [0, 0.001, 0.05, 0.1, 0.15, 0.2, 0.249, 0.25, 1], ease: "linear", repeat: 0 }, }},
"434:1321": {initial:{ opacity: 0, }, animate:{ opacity: [0, 1, 1], }, transition:{ opacity: { duration: 2, times: [0, 0.25, 1], ease: ["easeOut", "linear"], repeat: 0 }, }},
"432:211": {initial:{ x: -200, y: -200, }, animate:{ x: [-200, 0, 0], y: [-200, 0, 0], }, transition:{ x: { duration: 2, times: [0, 0.25, 1], ease: ["easeOut", "linear"], repeat: 0 }, y: { duration: 2, times: [0, 0.25, 1], ease: ["easeOut", "linear"], repeat: 0 }, }},
"432:217": {initial:{ opacity: 0.16, }, animate:{ opacity: [0.16, 1, 1], }, transition:{ opacity: { duration: 2, times: [0, 0.25, 1], ease: ["easeIn", "linear"], repeat: 0 }, }},
"433:293": {initial:{ x: -200, }, animate:{ x: [-200, 0, 0], }, transition:{ x: { duration: 2, times: [0, 0.25, 1], ease: ["easeOut", "linear"], repeat: 0 }, }},
"433:296": {initial:{ x: -200, }, animate:{ x: [-200, -200, 0, 0], }, transition:{ x: { duration: 2, times: [0, 0.1141, 0.3641, 1], ease: ["linear", "easeOut", "linear"], repeat: 0 }, }},
"433:299": {initial:{ x: -200, }, animate:{ x: [-200, -200, 0, 0], }, transition:{ x: { duration: 2, times: [0, 0.2025, 0.4525, 1], ease: ["linear", "easeOut", "linear"], repeat: 0 }, }},
}
clips["434:1319"] = clips["434:1318"]
clips["434:1320"] = clips["434:1318"]
clips["432:195"] = clips["415:307"]
clips["432:196"] = clips["415:307"]
clips["432:215"] = clips["434:1321"]
// Final metric entrances use the requested exact 200ms stagger at their call sites.
clips["433:296"] = clips["433:293"]
clips["433:299"] = clips["433:293"]
clips["432:200"] = { initial: { y: -40 }, animate: { y: 0 }, transition: { duration: .5, delay: .002, ease: [.42,0,1,1] } }
