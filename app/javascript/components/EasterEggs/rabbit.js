export default function () {
  const data = 'https://i.imgur.com/rXh1XTM.gif'

  const img = new Image()
  img.src = data
  img.style.width = '374px'
  img.style.height = '375px'
  img.style.transition = '6s all'
  img.style.position = 'fixed'
  img.style.right = '-374px'
  img.style.bottom = 'calc(-50% + 350px)'
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