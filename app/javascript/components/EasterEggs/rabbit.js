import data from 'assets/images/eastereggs/rabbit.gif'

export default function () {
  const img = new Image()
  img.src = data
  img.style.width = '374px'
  img.style.height = '375px'
  img.style.transition = '6s all'
  img.style.position = 'fixed'
  img.style.right = '-374px'
  img.style.bottom = '0'
  img.style.zIndex = 999999

  document.body.appendChild(img)

  window.setTimeout(() => {
    img.style.right = 'calc(50% - 187px)'
  }, 50)

  window.setTimeout(() => {
    img.style.right = 'calc(100% + 375px)'
  }, 4300)
  window.setTimeout(() => {
    img.parentNode.removeChild(img)
  }, 7300)
}
