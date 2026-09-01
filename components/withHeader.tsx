import type { ComponentType, CSSProperties } from "react"

export function withHeader<P extends { style?: CSSProperties }>(Component: ComponentType<P>) {
  return function FixedHeader(props: P) {
    return (
      <Component
        {...props}
        style={{
          ...props.style,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1000,
          background: "rgba(12, 3, 25, 0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />
    )
  }
}

export const negativeTopStyle: CSSProperties = {
  marginTop: "-100px",
  position: "relative",
  zIndex: 10,
}
