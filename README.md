## Inês Lino — Personal Website & CV
Interactive, single‑page portfolio for an API Platform & DevOps Engineer. Built with plain HTML, CSS and JavaScript — no frameworks, fast to load, easy to host.

### Highlights
- **Recruiter Mode**: one‑page summary with skills, certifications, experience, projects, and contacts
- **Interactive UX**: command palette, DevOps mini‑game, section animations (fade/blur), keyboard support
- **Bilingual**: Portuguese/English toggle with content switching
- **Theming**: dark/light mode with persistence
- **Performance**: IntersectionObserver‑driven animations and GPU‑friendly transitions

### Project Structure
```
Personal-Website-CV/
├── index.html     # Main page
├── styles.css     # Styles, themes, responsiveness
├── script.js      # Interactions, animations, recruiter mode, game
├── V2.png         # Logo / avatar asset
└── README.md
```

### Local Preview
Open `index.html` directly in a browser, or run a tiny static server:

```bash
# Python 3
python3 -m http.server 8000 --bind 127.0.0.1

# Node (serve)
npx serve . -l 8000 --single
```
Then visit `http://127.0.0.1:8000`.

### Deployment
- Static hosting (no backend): GitHub Pages, Netlify, Vercel, S3/CloudFront
- Set custom domain and HTTPS in your provider

### Configuration
- Google Analytics 4: replace `G-XXXXXXXXXX` in `index.html` with your GA4 ID
- CV download link: update the `href` in the hero and recruiter summary buttons
- Social links and contact: edit links in the Contact section

### Customization
- Colors and theme: adjust CSS variables in `styles.css` (`:root` and dark mode scope)
- Content: edit section copy in `index.html` (PT/EN texts use `data-en`/`data-pt` attributes)
- Interactions: modify behavior in `script.js` (command palette, game, animations)

### Accessibility & Performance
- Semantic HTML, keyboard navigation, ARIA labels, and color‑contrast conscious styles
- Reduced‑motion friendly; animations activate only in viewport via `IntersectionObserver`

### License
All rights reserved. You may view and deploy for personal portfolio use. For other uses, contact the author.

### Author
Inês Lino — LinkedIn: https://www.linkedin.com/in/ines-fv-lino/ • GitHub: https://github.com/ineslino
