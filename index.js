const baseUrl = 'https://www.mocky.io/v2/58fda6ce0f0000c40908b8c8'
const newsContainer = document.getElementsByClassName('news')[0]
const buttons = document.getElementsByClassName('button')[0]
const allButtons = document.getElementsByClassName('button')

let counter = 180
let counterPage = 15

const displayNews = news => {
  for (let i = 0; i < news.length; i++) {
    let page = ''
    if (i <= 4) {
      page = 'page-1'
    } else if (i > 4 && i <= 9) {
      page = 'page-2'
    } else {
      page = 'page-3'
    }

    let newsTemplate = `
    <div class="card mb-1 mt-2 col-12 news-item ${page} ${
      i <= 4 ? 'active' : 'inactive'
    }">
      <div class="card-body">
        <h5 class="card-title">${news[i].title}</h5>
        <p class="card-text">${news[i].details}</p>
      </div>
    </div>
    `
    newsContainer.insertAdjacentHTML('beforeend', newsTemplate)
  }
}

const getNews = url => {
  return fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(parsedResponse => {
      displayNews(parsedResponse.news)
    })
    .catch(error => console.log(error))
}

const refetchData = () => {
  setInterval(() => {
    if (counter > 0) {
      counter--
    } else if (counter === 0) {
      getNews(baseUrl)
      newsContainer.innerHTML = ''
      counter = 180
      goNextPage(true)
    }
  }, 1000)
}

const changePage = () => {
  setInterval(() => {
    if (counterPage > 0) {
      counterPage--
    } else if (counterPage === 0) {
      goNextPage()
      counterPage = 15
    }
  }, 1000)
}

const goNextPage = goFirstPage => {
  if (goFirstPage) {
    if (hasActiveClass(0)) {
      return
    } else if (hasActiveClass(1)) {
      removeActiveClass(1, 'page-1')
    } else if (hasActiveClass(2)) {
      removeActiveClass(2, 'page-1')
    }
  } else {
    if (hasActiveClass(0)) {
      removeActiveClass(0, 'page-2')
    } else if (hasActiveClass(1)) {
      removeActiveClass(1, 'page-3')
    } else if (hasActiveClass(2)) {
      removeActiveClass(2, 'page-1')
    }
  }
}

const hasActiveClass = elementIndex => {
  return allButtons[elementIndex].classList.contains('button-active')
}

const removeActiveClass = (elementIndex, page) => {
  allButtons[elementIndex].classList.remove('button-active')
  handleChangePage(page)
}

const handleChangePage = pageNumber => {
  counterPage = 15
  let newsList = document.getElementsByClassName('news-item')
  let buttonActive = document.getElementsByClassName(`button ${pageNumber}`)[0]

  const isCurrentPage =
    buttonActive.classList.contains('button-active') &&
    buttonActive.classList.contains(`${pageNumber}`)

  const isNotCurrentPage = !buttonActive.classList.contains('button-active')

  if (isCurrentPage) {
    return
  } else if (isNotCurrentPage) {
    buttonActive.classList.add('button-active')

    for (let i = 0; i < allButtons.length; i++) {
      if (!allButtons[i].classList.contains(`${pageNumber}`)) {
        allButtons[i].classList.remove('button-active')
      }
    }
  }

  for (i = 0; i < newsList.length; i++) {
    const isCurrentPageActive =
      newsList[i].classList.contains(pageNumber) &&
      newsList[i].classList.contains('active')

    const isCurrentPageInactive =
      newsList[i].classList.contains(pageNumber) &&
      newsList[i].classList.contains('inactive')

    const isNotCurrentPage = !newsList[i].classList.contains(pageNumber)

    if (isCurrentPageActive) {
      return
    } else if (isCurrentPageInactive) {
      switchClasses('inactive', 'active')
    }

    if (isNotCurrentPage) {
      switchClasses('active', 'inactive')
    }
  }
}

const switchClasses = (classToRemove, classToAdd) => {
  newsList[i].classList.remove(classToRemove)
  newsList[i].classList.add(classToAdd)
}

window.onload = function () {
  getNews(baseUrl)
  refetchData()
  changePage()
}
