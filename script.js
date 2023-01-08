const textInput = document.getElementById('text-input')
const sizeInput = document.getElementById('size-input')
const sortInput = document.getElementById('sort-input')
const amountInput = document.getElementById('amount-input')
const btn = document.getElementById('search-button')
const imgElement = document.createElement('img')
const searchResultDiv = document.getElementById('search-result-div')

const searchAnimation = anime({
    targets: '#green-box',
    duration: 600,
    rotate: '360deg',
    backgroundColor: '#FFF',
    borderRadius: '50%',
    easing: 'easeInOutQuad',
    autoplay: false,
    loop: true,
    direction: 'alternate'

});

btn.addEventListener('click', searchFunction)

function searchFunction(event) {
    event.preventDefault()
    searchResultDiv.innerHTML = '';
    if (textInput.value == '') {
        errorAlertTextInput()
    }
    else if (amountInput.value > 99 || amountInput.value < 1) {
        errorAlertAmountInput()
    }


    else {
        searchAnimation.play()
        fetch('https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=08ec57d2da226c052d2dd04d01cd30fe&text=' + textInput.value + '&sort=' + sortInput.value + '&format=json&nojsoncallback=1')

            .then(response => {

                if (response.ok) {
                    return response.json()
                }
                else {
                    errorFetchFailed()
                }

            })
            .then(showImages)
            .catch(errorFetchFailed)
    }
}

function showImages(flickrData) {
    if (flickrData.photos.total === 0) {
        errorNothingFound()
    }


    else {
        if (flickrData.photos.total < amountInput.value){
            amountInput.value = flickrData.photos.total
            errorLesserImagesFound()
        }
        for (let i = 0; i < amountInput.value; i++) {
            imgElement[i] = document.createElement('img')
            imgElement[i].src = 'https://live.staticflickr.com/' + flickrData.photos.photo[i].server + '/' + flickrData.photos.photo[i].id + '_' + flickrData.photos.photo[i].secret + '_' + sizeInput.value + '.jpg'
            searchResultDiv.appendChild(imgElement[i])
        }
        searchAnimation.restart()
        searchAnimation.pause()
    }
}

function errorAlertTextInput() {
    alert("Keyword can't be blank.");
    location.reload()
}

function errorAlertAmountInput() {
    alert("Number of images has to be a number between 1 and 99.");
    location.reload()
}

function errorNothingFound() {
    alert("Nothing found. Try another keyword.");
    location.reload()
}

function errorFetchFailed() {
    alert("Error. Data not available.");
    location.reload()
}

function errorLesserImagesFound(){
    alert("Sorry. We couldn't find the requested number of images to match your keyword. All available matching images are shown instead.");
}

