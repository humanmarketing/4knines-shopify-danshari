(function() {

/* variant selector */

let form = document.querySelector('form[action="/cart/add"]')
let variantSelector = form.querySelector('select[name="id"]')
form.addEventListener('change', () => {
  let formData = new FormData(form)
  let size_and_color = [formData.get('size'), formData.get('color')].join` / `
  let newlySelectedVariant = Array.from(variantSelector.options).find(option => option.text.includes(size_and_color))

  variantSelector.value = newlySelectedVariant.value
})

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

})()
