export const $ = document.querySelector.bind(document)
export const $$ = document.querySelectorAll.bind(document)

export function formatPrice(value) {
  const { format } = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `$${ format(value / 100) }`
}

export function delayAfterEvent(fn, ms) {
  let timer = 0
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(fn.bind(this, ...args), ms || 0)
  }
}
