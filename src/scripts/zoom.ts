// Click a screenshot to see it large. It grows out of the page to fill the view, the page dims
// behind it, and a click anywhere (or Esc) sends it back to where it was. Screenshots that are
// already links keep behaving as links.
const calm = matchMedia('(prefers-reduced-motion: reduce)')
const SELECTOR = '.frame img'
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'

function prepare() {
  document.querySelectorAll<HTMLImageElement>(SELECTOR).forEach((img) => {
    if (img.closest('a')) return
    img.classList.add('zoomable')
    img.tabIndex = 0
    img.setAttribute('role', 'button')
    img.setAttribute('aria-haspopup', 'dialog')
  })
}

// Where the big image starts from: the thumbnail's box, as a transform on the big one
function fromThumb(thumb: HTMLElement, big: HTMLElement): string {
  const a = thumb.getBoundingClientRect()
  const b = big.getBoundingClientRect()
  return `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width})`
}

// The big image's size, worked out up front so it never depends on the image having decoded:
// as large as fits inside the dialog's padding, at the screenshot's own proportions.
function fit(dialog: HTMLElement, big: HTMLImageElement, thumb: HTMLImageElement) {
  const pad = parseFloat(getComputedStyle(dialog).paddingLeft) || 0
  const box = thumb.getBoundingClientRect()
  const ratio = thumb.naturalWidth && thumb.naturalHeight ? thumb.naturalWidth / thumb.naturalHeight : box.width / box.height
  const width = Math.min(innerWidth - pad * 2, (innerHeight - pad * 2) * ratio)
  big.style.width = `${width}px`
  big.style.height = `${width / ratio}px`
}

let busy = false

async function open(thumb: HTMLImageElement) {
  if (busy) return // one at a time, even on a double-click
  busy = true
  const dialog = document.createElement('dialog')
  dialog.className = 'zoom'
  dialog.setAttribute('aria-label', thumb.alt || 'Screenshot')

  const big = new Image()
  big.src = thumb.currentSrc || thumb.src
  big.alt = thumb.alt
  await big.decode().catch(() => {}) // already downloaded for the thumbnail, so this is quick

  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'zoom-close'
  close.setAttribute('aria-label', 'Close')
  close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'

  dialog.append(big, close)
  document.body.append(dialog)
  document.documentElement.classList.add('zooming')
  dialog.showModal()
  fit(dialog, big, thumb)
  close.focus()

  const motion = !calm.matches
  if (motion) {
    thumb.style.visibility = 'hidden'
    big.animate([{ transform: fromThumb(thumb, big) }, { transform: 'none' }], { duration: 520, easing: EASE })
  }
  requestAnimationFrame(() => dialog.classList.add('is-open'))

  let closing = false
  const shut = async () => {
    if (closing) return
    closing = true
    dialog.classList.remove('is-open')
    if (motion) {
      await big.animate([{ transform: 'none' }, { transform: fromThumb(thumb, big) }], {
        duration: 440,
        easing: EASE,
        fill: 'forwards',
      }).finished
    }
    thumb.style.visibility = ''
    dialog.close()
    dialog.remove()
    document.documentElement.classList.remove('zooming')
    thumb.focus({ preventScroll: true })
    busy = false
  }

  dialog.addEventListener('click', shut)
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault() // Esc: close with the animation, not instantly
    shut()
  })
}

document.addEventListener('astro:page-load', prepare)

document.addEventListener('click', (e) => {
  const img = (e.target as Element).closest<HTMLImageElement>('img.zoomable')
  if (img) open(img)
})

document.addEventListener('keydown', (e) => {
  const el = document.activeElement
  if ((e.key === 'Enter' || e.key === ' ') && el instanceof HTMLImageElement && el.classList.contains('zoomable')) {
    e.preventDefault()
    open(el)
  }
})
