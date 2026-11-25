// The colour panel that carries you through a door and back. Going in, it grows out of the door
// you tapped to fill the screen, the page changes underneath it, and it fades away to show the
// page. Coming back to the room, it fades in over the page in that door's colour, the room loads
// underneath, and it shrinks back down into the door.
//
// While it covers the screen, Astro's usual crossfade between pages is skipped. That crossfade
// shows a captured image of the incoming page, and Safari draws the room's doors flat in it, so
// they would pop up once the real page took over.
import { site } from '../site'

const calm = matchMedia('(prefers-reduced-motion: reduce)')
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'

let veil: HTMLElement | null = null
let skip = false // skip Astro's crossfade on the next swap, because the panel is covering it

const pathOf = (url: URL) => url.pathname.replace(/\/$/, '') || '/'

// Which door leads to a page: the place whose href the path is, or is under
const placeFor = (path: string) =>
  site.places.findIndex((place) => place.href && (path === place.href || path.startsWith(`${place.href}/`)))

export const covering = () => veil !== null

function make(background: string) {
  veil?.remove()
  veil = document.createElement('div')
  veil.className = 'veil'
  veil.setAttribute('aria-hidden', 'true')
  veil.style.background = background
  // On <html> rather than <body>, so it stays put while the page's body is swapped
  document.documentElement.append(veil)
  return veil
}

function done() {
  veil?.remove()
  veil = null
}

// The panel as a box on screen
type Box = { left: number; top: number; width: number; height: number; radius: number; skew: number }

const screen = (): Box => ({ left: 0, top: 0, width: innerWidth, height: innerHeight, radius: 0, skew: 0 })

// The door's slab as the panel would draw it: a rounded box slanted at the sidelong angle. The
// slab's on-screen box includes its slant, so take that back off to find the width.
function doorBox(slab: HTMLElement): Box {
  const r = slab.getBoundingClientRect()
  const skew = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--angle')) || 10
  const lean = r.height * Math.tan((skew * Math.PI) / 180)
  const scale = r.height / (slab.offsetHeight || r.height)
  const radius = (parseFloat(getComputedStyle(slab).borderTopLeftRadius) || 0) * scale
  return { left: r.left + lean / 2, top: r.top, width: r.width - lean, height: r.height, radius, skew }
}

const frame = (b: Box): Keyframe => ({
  left: `${b.left}px`,
  top: `${b.top}px`,
  width: `${b.width}px`,
  height: `${b.height}px`,
  borderRadius: `${b.radius}px`,
  transform: `skewX(${-b.skew}deg)`,
})

// The door's name, carried on the panel so it doesn't vanish the moment the panel appears
function label(slab: HTMLElement, panel: HTMLElement) {
  const name = slab.querySelector<HTMLElement>('.name')
  if (!name) return null
  const copy = name.cloneNode(true) as HTMLElement
  copy.style.color = getComputedStyle(name).color
  copy.style.transform = `scale(${slab.getBoundingClientRect().height / (slab.offsetHeight || 1)})`
  panel.append(copy)
  return copy
}

// Going in: grow out of the door to fill the screen. Resolves once it does.
export async function grow(slab: HTMLElement) {
  const panel = make(getComputedStyle(slab).backgroundImage)
  const name = label(slab, panel)
  const from = frame(doorBox(slab))
  Object.assign(panel.style, from)
  name?.animate({ opacity: [1, 0] }, { duration: 200, easing: 'ease-out', fill: 'forwards' })
  await panel.animate([from, frame(screen())], { duration: 520, easing: EASE, fill: 'forwards' }).finished
  skip = true
}

// Fade away to show the page underneath
export async function reveal() {
  const panel = veil
  if (!panel) return
  await panel.animate({ opacity: [1, 0] }, { duration: 420, easing: 'ease-out', fill: 'forwards' }).finished
  if (veil === panel) done()
}

// Coming back: shrink from the full screen down into the door, then let the door take over
export async function shrinkInto(slab: HTMLElement) {
  const panel = veil
  if (!panel) return
  panel.style.background = getComputedStyle(slab).backgroundImage
  const name = label(slab, panel)
  const to = frame(doorBox(slab))
  name?.animate({ opacity: [0, 1] }, { duration: 220, delay: 380, easing: 'ease-in', fill: 'backwards' })
  await panel.animate([frame(screen()), to], { duration: 600, easing: EASE, fill: 'forwards' }).finished
  await panel.animate({ opacity: [1, 0] }, { duration: 120, fill: 'forwards' }).finished
  if (veil === panel) done()
}

// Leaving a door's page for the room: cover it in that door's colour while the room loads, and
// make that door the one at the front when it does.
document.addEventListener('astro:before-preparation', (e) => {
  const to = pathOf(e.to)
  const from = pathOf(e.from)
  if (to !== '/' || from === '/' || calm.matches) return
  const i = placeFor(from)
  if (i >= 0) sessionStorage.setItem('sidelong-door', String(i))
  const colors = i >= 0 ? site.places[i].colors : ''
  const panel = make(colors ? `linear-gradient(135deg, ${colors})` : 'var(--ground)')
  Object.assign(panel.style, frame(screen()))
  const shown = panel.animate({ opacity: [0, 1] }, { duration: 260, easing: 'ease-out', fill: 'forwards' }).finished
  const load = e.loader
  e.loader = async () => {
    await Promise.all([shown, load()])
  }
  skip = true
})

document.addEventListener('astro:before-swap', (e) => {
  if (!skip) return
  skip = false
  // Skipping rejects the transition's "ready" promise; that's expected, so don't report it
  e.viewTransition.ready.catch(() => {})
  e.viewTransition.skipTransition()
})

// Arriving on a door's page under the panel: show the page. (The room handles its own arrival,
// shrinking the panel back into a door.)
document.addEventListener('astro:page-load', () => {
  if (veil && !document.getElementById('scene')) reveal()
})
