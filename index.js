const flashcardsPerPage = 10;
let currentPage = 1;
let flashcards = [];

fetch('db.json')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        flashcards = data;
        renderFlashcards();
        renderNavigation();
    })
    .catch(error => console.error(error));

function renderFlashcards() {
    const flashcardsContainer = document.createElement('div');
    flashcardsContainer.classList.add('flashcards-container');
    const start = (currentPage - 1) * flashcardsPerPage;
    const end = start + flashcardsPerPage;
    const currentFlashcards = flashcards.slice(start, end);
    currentFlashcards.forEach(function (item) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        const card = document.createElement('div');
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
        card.classList.add('card');
        const numberQuestion1 = document.createElement('h1');
        numberQuestion1.textContent = item._id;
        const numberQuestion2 = document.createElement('h1');
        numberQuestion2.textContent = item._id;
        numberQuestion1.classList.add('numberQuestion');
        numberQuestion2.classList.add('numberQuestion');
        const front = document.createElement('div');
        front.classList.add('front');
        const frontText = document.createElement('p');
        frontText.textContent = item.question;
        front.append(numberQuestion1, frontText);
        const back = document.createElement('div');
        back.classList.add('back');
        const backText = document.createElement('p');
        backText.textContent = item.answer;
        back.append(numberQuestion2, backText);
        let isFlipped = false;
        card.addEventListener('click', () => {
            isFlipped = !isFlipped;
            if (isFlipped) {
                card.classList.add('is-flipped');
            } else {
                card.classList.remove('is-flipped');
            }
        });
        card.appendChild(front);
        card.appendChild(back);
        cardContainer.appendChild(card);
        flashcardsContainer.appendChild(cardContainer);
    });
    document.body.appendChild(flashcardsContainer);
}

function renderNavigation() {
    const navigationContainer = document.createElement('div');
    navigationContainer.classList.add('navigation-container');
    const totalPages = Math.ceil(flashcards.length / flashcardsPerPage);
    let startPage = 1;
    let endPage = totalPages;

    // add logic to display only 10 navigation buttons
    if (totalPages > 10 && currentPage > 6) {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
        if (endPage > totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        }
    } else if (totalPages > 10) {
        endPage = 10;
    }

    for (let i = startPage; i <= endPage; i++) {
        const navigationItem = document.createElement('button');
        navigationItem.textContent = i;
        navigationItem.addEventListener('click', () => {
            currentPage = i;
            document.body.innerHTML = '';
            renderFlashcards();
            renderNavigation();
        });
        navigationContainer.appendChild(navigationItem);
    }

    document.body.prepend(navigationContainer);
}
