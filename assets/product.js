(function() {

/* variant selector */

let form = document.querySelector('form[action="/cart/add"]')
let variantSelector = form.querySelector('select[name="id"]')
let variantOptions = ['size', 'color']

form.addEventListener('change', () => {
  let formData = new FormData(form)
  variantOptions.forEach(option => {
    let optionPreview = form.querySelector(`[data-option-preview="${ option }"]`)
    optionPreview && (optionPreview.innerHTML = formData.get(option))
  })

  let selectedValues = variantOptions.map(option => formData.get(option)).join` / `
  let newlySelectedVariant = Array.from(variantSelector.options).find(option => option.text.includes(selectedValues))

  variantSelector.value = newlySelectedVariant.value

  let { selectedPrice, selectedCompareAtPrice } = newlySelectedVariant.dataset
  form.querySelector('[data-price]').innerHTML = formatPrice(selectedPrice)
  if (form.querySelector('[data-compare-at-price]')) {
    form.querySelector('[data-compare-at-price]').innerHTML = formatPrice(selectedCompareAtPrice)
  }

  window.history.replaceState(null, null, `?variant=${ newlySelectedVariant.value }`)
})

function formatPrice(value) {
  const { format } = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `$${ format(value / 100) }`
}

/* product recommendations */

const handleIntersection = (entries, observer) => {
  if (!entries[0].isIntersecting) return

  observer.unobserve(productRecommendationsSection)

  fetch(productRecommendationsSection.dataset.url)
    .then(response => response.text())
    .then(text => {
      const html = document.createElement('div')
      html.innerHTML = text
      const recommendations = html.querySelector('.product-recommendations')

      if (recommendations && recommendations.innerHTML.trim().length) {
        productRecommendationsSection.innerHTML = recommendations.innerHTML
      }
    })
    .catch(console.error)
}

const productRecommendationsSection = document.querySelector('.product-recommendations')
const observer = new IntersectionObserver(handleIntersection, {rootMargin: '0px 0px 200px 0px'})

observer.observe(productRecommendationsSection)

/* product tabs */

const productTabs = document.querySelectorAll('input[name="pdp-tabs"]')
const tabItems = document.querySelectorAll('.pdp-tab-item')

function updateSelectedTab() {
  const selectedTab = document.querySelector('input[name="pdp-tabs"]:checked')

  tabItems.forEach(item => { item.classList.remove('text-accent-1') })

  const targetTab = document.querySelector(`.pdp-tab-item[for="${ selectedTab.id }"]`)
  targetTab.classList.add('text-accent-1')
}
updateSelectedTab()

productTabs.forEach(tab => {
  tab.addEventListener('change', updateSelectedTab)
})

})()
