// Click a screenshot to see it large. It grows out of the page to fill the view, the page dims
// behind it, and a click anywhere (or Esc) sends it back to where it was. Screenshots that are
// already links keep behaving as links.
const calm = matchMedia('(prefers-reduced-motion: reduce)')
const SELECTOR = '.frame img, img[data-zoom-src]'
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
  const style = getComputedStyle(dialog)
  const availableWidth = dialog.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
  const availableHeight = dialog.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
  const box = thumb.getBoundingClientRect()
  const ratio = big.naturalWidth && big.naturalHeight ? big.naturalWidth / big.naturalHeight : box.width / box.height
  const width = Math.min(availableWidth, availableHeight * ratio)
  big.style.width = `${width}px`
  big.style.height = `${width / ratio}px`
}

function zoomButton(name: string, className: string, path: string) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = `zoom-control ${className}`
  button.setAttribute('aria-label', name)
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`
  return button
}

async function loadImage(thumb: HTMLImageElement) {
  const image = new Image()
  const preview = thumb.currentSrc || thumb.src
  image.src = thumb.dataset.zoomSrc || preview
  image.alt = thumb.alt
  try {
    await image.decode()
  } catch {
    image.src = preview
    await image.decode().catch(() => {})
  }
  return image
}

let busy = false

async function open(thumb: HTMLImageElement) {
  if (busy) return // one at a time, even on a double-click
  busy = true
  const group = thumb.closest('[data-zoom-gallery]')
  const photos = group ? Array.from(group.querySelectorAll<HTMLImageElement>('img.zoomable')) : [thumb]
  let index = photos.indexOf(thumb)
  const dialog = document.createElement('dialog')
  dialog.className = 'zoom'
  dialog.setAttribute('aria-label', photos.length > 1 ? group?.getAttribute('aria-label') || 'Image gallery' : thumb.alt || 'Screenshot')

  let big = await loadImage(thumb)
  let displayed = thumb
  const refit = () => fit(dialog, big, displayed)
  const close = zoomButton('Close', 'zoom-close', 'M6 6l12 12M18 6L6 18')
  dialog.append(big, close)

  let opening: Animation | undefined
  let closing = false
  let request = 0
  if (photos.length > 1) {
    dialog.classList.add('zoom-gallery')
    const previous = zoomButton('Previous image', 'zoom-prev', 'M15 5l-7 7 7 7')
    const next = zoomButton('Next image', 'zoom-next', 'M9 5l7 7-7 7')
    const count = document.createElement('span')
    count.className = 'zoom-count'
    count.setAttribute('role', 'status')
    count.setAttribute('aria-atomic', 'true')
    const updateCount = () => {
      count.textContent = `${index + 1} / ${photos.length}`
      count.setAttribute('aria-label', `Image ${index + 1} of ${photos.length}. ${displayed.alt}`)
    }
    updateCount()
    dialog.append(previous, next, count)

    const move = async (step: number) => {
      if (closing) return
      const id = ++request
      index = (index + step + photos.length) % photos.length
      const target = photos[index]
      const image = await loadImage(target)
      if (closing || id !== request) return
      opening?.cancel()
      thumb.style.visibility = ''
      big.replaceWith(image)
      big = image
      displayed = target
      refit()
      updateCount()
    }
    previous.addEventListener('click', () => void move(-1))
    next.addEventListener('click', () => void move(1))
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      e.preventDefault()
      void move(e.key === 'ArrowLeft' ? -1 : 1)
    })
  }

  document.body.append(dialog)
  document.documentElement.classList.add('zooming')
  dialog.showModal()
  refit()
  window.addEventListener('resize', refit)
  close.focus()

  const motion = !calm.matches
  if (motion) {
    thumb.style.visibility = 'hidden'
    opening = big.animate([{ transform: fromThumb(thumb, big) }, { transform: 'none' }], { duration: 520, easing: EASE })
  }
  requestAnimationFrame(() => dialog.classList.add('is-open'))

  const shut = async () => {
    if (closing) return
    closing = true
    dialog.classList.remove('is-open')
    if (motion && displayed === thumb) {
      const start = getComputedStyle(big).transform
      opening?.cancel()
      thumb.style.visibility = 'hidden'
      await big.animate([{ transform: start }, { transform: fromThumb(thumb, big) }], {
        duration: 440,
        easing: EASE,
        fill: 'forwards',
      }).finished
    }
    window.removeEventListener('resize', refit)
    thumb.style.visibility = ''
    dialog.close()
    dialog.remove()
    document.documentElement.classList.remove('zooming')
    thumb.focus({ preventScroll: true })
    busy = false
  }

  close.addEventListener('click', shut)
  dialog.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.zoom-control')) void shut()
  })
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
