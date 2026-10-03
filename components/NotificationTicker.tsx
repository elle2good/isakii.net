const NOTIFICATION_TEXT = "LVMH Innovation Award Finalist, 2021 · Product Hunt Best Rated Product of the Month, 2023 · 3,500 followers grown organically"
const NOTIFICATION_LOOP_TEXT = `${NOTIFICATION_TEXT} ·\u00a0`

export default function NotificationTicker() {
  return (
    <div className="home-ticker" aria-label={NOTIFICATION_TEXT}>
      <div className="home-ticker-track">
        {Array.from({ length: 2 }, (_, groupIndex) => (
          <div className="home-ticker-group" aria-hidden="true" key={groupIndex}>
            {Array.from({ length: 3 }, (_, index) => (
              <span key={index}>{NOTIFICATION_LOOP_TEXT}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
