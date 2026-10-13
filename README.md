# Sourabh Rajput — Portfolio

A dark, monochrome, single-page portfolio. Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Checks: `npx tsc --noEmit` and `npm run lint`.

## Edit the content

**Everything lives in [`data/portfolio.ts`](data/portfolio.ts)** — name, roles, tagline, bio, experience, services,
skills, icon cloud, projects (title, description, tech, links, image), certifications, contact details and every media
path. Change it there; the components only read from it.

- **Services** each have a title, summary, tags and an illustration (`visual`: one of `layout`, `code`, `performance`,
  `pen`, `timeline`, `backup`, `network`, `growth`, `search`, `support`). The summaries are draft copy — edit freely.
- **Project links** are `"#"` placeholders — swap in real URLs. External links open in a new tab.
- **Contact form**: set `contact.formEndpoint` to a form service URL (Formspree, Getform, your own API) to receive
  messages directly. Left empty, the form opens the visitor's email app with the message filled in.
- **Resume**: replace `public/resume.pdf` (the current one is generated from the data file).

## Media

| File | Used for |
| --- | --- |
| `public/media/portrait-sourabh.webm` | Hero video, scrubbed by scroll |
| `public/media/portrait-sourabh-poster.jpg` | Shown before the video loads (and where it can't play) |
| `public/media/about-sourabh.jpg` | About photo — the portrait lands here |
| `public/media/projects/*.jpg` | Project cards (16:10) |
| `public/media/og.jpg` | Social share preview (1200×630) |
| `public/icons/*.svg` | Icon cloud (monochrome Simple Icons) |

The current hero video is built from the client photo: a slow push-in with a light sweeping across the face. Swap in
the real head-turn video when it's ready.

> **Replacing an image?** Save it under a **new filename** and update the path in `data/portfolio.ts`. Next.js caches
> optimised images by URL, so reusing a name can keep showing the old one (or delete `.next/cache/images` and
> hard-refresh).

### Preparing the portrait video

Scrubbing jumps around the timeline, and a browser can only show a frame instantly if that frame is a keyframe. Encode
with **a keyframe on every frame** (`-g 1`), no audio, about 720px wide, 3–6 seconds, 4:5 portrait:

```bash
# MP4 (H.264) — plays everywhere, including Safari and iOS
ffmpeg -i input.mov -vf "scale=720:-2,fps=30" -an -c:v libx264 -preset slow -crf 22 -g 1 -pix_fmt yuv420p -movflags +faststart public/media/portrait.mp4

# WebM (VP9) — smaller for Chrome, Edge and Firefox
ffmpeg -i input.mov -vf "scale=720:-2,fps=30" -an -c:v libvpx-vp9 -b:v 0 -crf 34 -g 1 -row-mt 1 public/media/portrait.webm
```

Then list both in `hero.video.sources`, MP4 first:

```ts
sources: [
  { src: "/media/portrait.mp4", type: "video/mp4" },
  { src: "/media/portrait.webm", type: "video/webm" },
],
```

The bundled placeholder is WebM only, so on Safari/iOS it shows the poster until you add an MP4.

**Seamless hand-off to About:** the moving portrait crossfades into the About photo. For no visible change, make the
About photo the video's last frame cropped square, taking 30% of the excess off the top and 70% off the bottom
(`FOCUS_Y` in `components/sections/Intro.tsx`).

`hero.video.scrubScreens` sets how long the scrub lasts, in screen heights of scrolling.

## How it's built

```
app/
  layout.tsx            fonts, metadata, Lenis provider, navbar
  page.tsx              section order
  globals.css           Craft tokens → monochrome theme layer → component styles
craft/tokens.css        Craft design tokens (space, radius, easing, durations), vendored
data/portfolio.ts       all content
lib/
  gsap.ts               plugin registration (ScrollTrigger, SplitText, CustomEase)
  motion.ts             reads the CSS motion tokens so GSAP uses the same curves and durations
  useReveal.ts          fade-up / line-mask reveals for every section
components/
  providers/SmoothScroll.tsx   Lenis on GSAP's ticker; smooth in-page anchors
  layout/                      Navbar (active section, mobile menu), Footer
  sections/                    Intro (Hero + About + the portrait flight), Expertise (+ Services), Skills,
                               Projects, Certifications, Contact
  ui/                          PillButton, RotatingHeadline, SpotlightGrid, IconCloud, ServiceVisual, Marquee, …
```

**Timeline navbar.** The navbar is the page drawn as an editing timeline. Each section is a clip, sized by its
length on wide screens, and the hero clip has film perforations. A lime playhead and a "played" tint follow the scroll.
Click a clip to jump to that section, hover the track for a seek preview, or drag anywhere along it to scrub the
whole page, hero video included. On phones it becomes a thin strip on the bar's bottom edge: tap or swipe it
sideways. Clip labels shorten to fit (set `short` on a nav item in the data file).

**Hero scrub.** The hero is a tall scroll track with a sticky stage. ScrollTrigger maps scroll progress through the
stage to `video.currentTime`, one seek at a time (each `seeked` chases the latest target), so the decoder never falls
behind.

**Portrait flight.** Once the stage releases, the hero and About scroll together, so the distance from the portrait to
the About slot is constant. That distance is measured from layout (not screen position) and scrubbed with
`x / y / scale / clip-path`. It is re-measured on every resize.

**Spotlight cards.** One `pointermove` on the grid writes `--x` / `--y` into each card, at most once per frame. A
radial gradient lights the surface of the hovered card, and the same light, masked to the 1px border, spills onto its
neighbours.

**Services.** On desktop, the service rows form a big outline index. The row crossing the middle of the screen (or
the one under the cursor) lights up, a spotlight slides to it, and a sticky stage shows that service with its
illustration. On phones it becomes a swipeable card rail. The illustrations are plain SVG with CSS loops on
transform/opacity, and only the visible one runs.

**Icon cloud.** Adapted from [Magic UI's Icon Cloud](https://magicui.design/docs/components/icon-cloud): the same
sphere, cursor steering, drag and click-to-focus. State lives in refs and one loop runs on GSAP's ticker, so there are
no React re-renders per frame. The canvas renders at device resolution and stops drawing off screen.

**Design tokens.** Colours, spacing, radii, easing curves and durations are CSS custom properties. Craft's tokens sit
underneath; the **Electric Lime** palette (near-black, warm white, one `#c8ff3c` accent, lime-tinted spotlight glows) is
the theme layer at the top of `globals.css`. To change the accent, edit `--accent` (and its `--accent-*` / `--glow-*`
companions) there — every button, marker, glow and illustration highlight follows. GSAP reads the easing and duration
tokens at runtime.

**Motion and accessibility.** All motion is `transform` / `opacity` / `clip-path`. Hover effects only apply to devices
with a real pointer. With `prefers-reduced-motion`, Lenis scrolls 1:1, reveals only fade, the headline crossfades
instead of flipping, the portrait crossfades instead of flying, and the marquee and icon cloud stand still. The page
has a skip link, visible focus rings, and screen-reader text for everything that is drawn or animated.
