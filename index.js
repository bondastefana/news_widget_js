const baseUrl = 'http://www.mocky.io/v2/58fda6ce0f0000c40908b8c8'
const newsContainer = document.getElementsByClassName('news')[0]
const buttons = document.getElementsByClassName('button')[0]
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
  let allButtons = document.getElementsByClassName('button')

  if (goFirstPage) {
    if (allButtons[0].classList.contains('button-active')) {
      return
    } else if (allButtons[1].classList.contains('button-active')) {
      allButtons[1].classList.remove('button-active')
      handleChangePage('page-1')
    } else if (allButtons[2].classList.contains('button-active')) {
      allButtons[2].classList.remove('button-active')
      handleChangePage('page-1')
    }
  } else {
    if (allButtons[0].classList.contains('button-active')) {
      allButtons[0].classList.remove('button-active')
      handleChangePage('page-2')
    } else if (allButtons[1].classList.contains('button-active')) {
      allButtons[1].classList.remove('button-active')
      handleChangePage('page-3')
    } else if (allButtons[2].classList.contains('button-active')) {
      allButtons[2].classList.remove('button-active')
      handleChangePage('page-1')
    }
  }
}

const handleChangePage = pageNumber => {
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

    let allButtons = document.getElementsByClassName('button')
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
      newsList[i].classList.remove('inactive')
      newsList[i].classList.add('active')
    }

    if (isNotCurrentPage) {
      newsList[i].classList.remove('active')
      newsList[i].classList.add('inactive')
    }
  }
}

window.onload = function () {
  getNews(baseUrl)
  refetchData()
  changePage()
}
