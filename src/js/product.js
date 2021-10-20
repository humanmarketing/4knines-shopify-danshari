(function() {
  const $ = document.querySelector.bind(document)
  const $$ = document.querySelectorAll.bind(document)

/* variant selector */

let form = $('form[action="/cart/add"]')
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

  let { selectedPrice, selectedCompareAtPrice, selectedAvailable } = newlySelectedVariant.dataset
  form.querySelector('[data-price]').innerHTML = formatPrice(selectedPrice)
  if (form.querySelector('[data-compare-at-price]')) {
    form.querySelector('[data-compare-at-price]').innerHTML = formatPrice(selectedCompareAtPrice)
  }

  if (selectedAvailable === 'true') {
    form.querySelector('.add-to-cart-btn').removeAttribute('hidden')
    form.querySelector('.sold-out-btn').setAttribute('hidden', true)
  } else {
    form.querySelector('.add-to-cart-btn').setAttribute('hidden', true)
    form.querySelector('.sold-out-btn').removeAttribute('hidden')
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

const productRecommendationsSection = $('.product-recommendations')
const observer = new IntersectionObserver(handleIntersection, {rootMargin: '0px 0px 200px 0px'})

observer.observe(productRecommendationsSection)

/* product tabs */

const productTabs = $$('input[name="pdp-tabs"]')
const tabItems = $$('.pdp-tab-item')

function updateSelectedTab() {
  tabItems?.forEach(item => { item.classList.remove('is-active') })

  const selectedTab = $('input[name="pdp-tabs"]:checked')
  $(`.pdp-tab-item[for="${ selectedTab?.id }"]`)?.classList.add('is-active')
}
updateSelectedTab()

productTabs?.forEach(tab => {
  tab.addEventListener('change', updateSelectedTab)
})

/* show link to size dimensions */

tabItems?.forEach(item => {
  if (item.innerText.includes('Dimensions')) {
    let linkToSizes = $('.link-to-sizes')
    linkToSizes?.removeAttribute('hidden')
    linkToSizes?.addEventListener('click', () => {
      $('.pdp-tab-item[for="pdp-tab-2"]')?.click()
    })
  }
})

})()
