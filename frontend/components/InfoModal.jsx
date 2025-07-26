import "./InfoModal.css";
import MapImg from "../src/assets/image1.png"

export default function InfoModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="info-modal" onClick={onClose}>
      <div className="info-modal__container" onClick={(e) => e.stopPropagation()}>
        <div className="info-modal__top-bar">
          <h2 className="info-modal__button-title">
            <img src={MapImg} alt=""  style={{ width: "30px", height: "30px", marginRight: "10px", borderRadius:"20px" }} />
                About Mapish
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="info-modal__close-button"
          >
            &times;
          </button>
        </div>
        <div className="info-modal__content">
          <section>
            <h3 className="info-modal__section-header">🌍 Hey there, explorer!</h3>
            <p>
                Welcome to <strong>Mapish </strong> — your new favorite way to get lost.
                What if you could explore the world just by dragging your mouse across a map... and uncovering real travel stories, one pin at a time?
                No boring lists. No endless searches. Just a living map filled with vlogs from people who’ve actually been there.
                Zoom into the Himalayas, click through Tokyo’s neon streets, or stumble across a quiet village you’ve never heard of — all through the eyes of real travelers.
                Mapish turns the whole planet into your personal playlist of adventures. So go ahead, wander a little.
            </p>
          </section>

          <section>
            <h3 className="info-modal__section-header">🚀 So, what’s the big idea?</h3>
            <p>
              You scroll. You zoom. You click. Boom — instant travel video from
              that exact location. No more guessing where a vlog was shot. Just
              drop in and get inspired.
            </p>
            <ul>
              <li>Explore vlogs by geographic location</li>
              <li>Pin-point location detection powered by AI</li>
              <li>Clickable video markers on the map</li>
              <li>Filters to help you find what (and where) you love</li>
              <li>Watch videos directly in-app (zero distractions!)</li>
            </ul>
          </section>

          <section>
            <h3 className="info-modal__section-header">🧭 How do I use this thing?</h3>
            <ol>
              <li>Wander around the map (go wild)</li>
              <li>Look for YouTube channel you like</li>
              <li>Select country you want to explore</li>
              <li>Booom!! - you are in the world of travel vlogs</li>
              <li>Click a pin to see what magic awaits</li>
              <li>Use filters to find videos by place, channel, or date</li>
              <li>You can load videos from the last 24 Hours into applications !!</li>
            </ol>
          </section>

          <section>
            <h3 className="info-modal__section-header">📬 Got a travel channel?</h3>
            <p>
              I’m building a feature that lets you auto-map your vlogs, but if
              you’re impatient (like me), email me your channel name and link
              to <a href="mailto:tajmohammadkhan679@gmail.com">tajmohammadkhan679@gmail.com</a>. Boom
              — your videos could be on the map before you finish your coffee.
            </p>
          </section>

          <section>
            <h3 className="info-modal__section-header">☕ Buy me a coffee?</h3>
            <p>
              If Mapish helped you plan your trip, discover a hidden gem, or
              waste your evening in the best way — consider{" "}
              <a href="#">buying me a coffee</a>. Just kidding 😆. But if you want to support this project, share it with your fellow travelers!
            </p>
          </section>

          <section>
            <h3 className="info-modal__section-header">📫 Talk to me!</h3>
           <p>
                Got feedback, found a bug, or just binge-watched a vlog that deserves a spotlight?
                Drop a message at <a href="mailto:tajmohammadkhan679@gmail.com">tajmohammadkhan679@gmail.com</a> —
                I check every email (even if I’m deep-diving into Himalayan drone videos).
            </p>

            <p style={{ marginTop: "2rem", marginBottom: "1rem", fontSize: "0.9em", color: "#aaa" }}>
              Made with ❤️ and map-obsession by Taj Mohammad Khan
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
