export default function AlgorandGame() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "#000", zIndex: 1 }}>
      <iframe
        src="/games/algorand-korea/index.html"
        title="Algorand Korea — One Campaign, Two Perspectives"
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
        allowFullScreen
      />
    </main>
  )
}
