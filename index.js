class Flashcards {
    constructor(flashcardsPerPage) {
      this.flashcardsPerPage = flashcardsPerPage;
      this.currentPage = 1;
      this.flashcards = [];
    }
  
    fetchFlashcards() {
      fetch("db.json")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.flashcards = data;
          this.renderNavigation();
          this.renderFlashcards();
        })
        .catch((error) => console.error(error));
    }
  
    renderFlashcards() {
      const flashcardsContainer = document.createElement("div");
      flashcardsContainer.classList.add("flashcards-container");
      const start = (this.currentPage - 1) * this.flashcardsPerPage;
      const end = start + this.flashcardsPerPage;
      const currentFlashcards = this.flashcards.slice(start, end);
      currentFlashcards.forEach(function (item) {
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("card-container");
        const card = document.createElement("div");
        card.addEventListener("click", () => {
          card.classList.toggle("is-flipped");
        });
        card.classList.add("card");
        const numberQuestion1 = document.createElement("h1");
        numberQuestion1.textContent = item._id;
        const numberQuestion2 = document.createElement("h1");
        numberQuestion2.textContent = item._id;
        numberQuestion1.classList.add("numberQuestion");
        numberQuestion2.classList.add("numberQuestion");
        const front = document.createElement("div");
        front.classList.add("front");
        const frontText = document.createElement("p");
        frontText.textContent = item.question;
        const answerInput = document.createElement("input");
        answerInput.setAttribute("type", "text");
        answerInput.addEventListener("click", (event) => {
          event.stopPropagation();
        });
        answerInput.addEventListener("keyup", (event) => {
          event.stopPropagation();
          const currentAnswer = event.target.value.toLowerCase().trim();
          const correctAnswer = item.answer.toLowerCase().trim();
          if (currentAnswer === correctAnswer) {
            event.target.classList.add("correct-answer");
          } else {
            event.target.classList.remove("correct-answer");
          }
        });
        const back = document.createElement("div");
        back.classList.add("back");
        const backText = document.createElement("p");
        backText.textContent = item.answer;
        let isFlipped = false;
        card.addEventListener("click", () => {
          isFlipped = !isFlipped;
          if (isFlipped) {
            card.classList.add("is-flipped");
          } else {
            card.classList.remove("is-flipped");
          }
        });
        back.append(numberQuestion2, backText);
        front.append(numberQuestion1, frontText, answerInput);
        card.appendChild(front);
        card.appendChild(back);
        cardContainer.appendChild(card);
        flashcardsContainer.appendChild(cardContainer);
      });
      document.body.appendChild(flashcardsContainer);
      this.renderSearch();
    }
  
    renderSearch() {
      const searchContainer = document.createElement("div");
      searchContainer.classList.add("search-container");
  
      const searchInput = document.createElement("input");
      searchInput.setAttribute("type", "text");
      searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase().trim();
        const searchResults = this.flashcards.filter((item) => {
          return (
            item.question.toLowerCase().includes(searchValue) ||
            item.answer.toLowerCase().includes(searchValue)
          );
        });
        this.renderSearchResults(searchResults.slice(0, 6));
      });
  
      searchContainer.appendChild(searchInput);
      document.body.append(searchContainer);
    }
  
    renderSearchResults(results) {
      const searchResultsContainer = document.createElement("div");
      searchResultsContainer.classList.add("search-results-container");
  
      results.forEach((item) => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("search-result");
        resultItem.textContent = item.question;
        resultItem.addEventListener("click", () => {
          this.currentPage = Math.ceil(item._id / this.flashcardsPerPage);
          document.body.innerHTML = "";
          this.renderFlashcards();
          this.renderNavigation();
        });
        searchResultsContainer.appendChild(resultItem);
      });
  
      const previousSearchResults = document.querySelector(
        ".search-results-container"
      );
      if (previousSearchResults) {
        previousSearchResults.remove();
      }
      document.body.appendChild(searchResultsContainer);
    }
  
    renderNavigation() {
      const navigationContainer = document.createElement("div");
      navigationContainer.classList.add("navigation-container");
      const totalPages = Math.ceil(
        this.flashcards.length / this.flashcardsPerPage
      );
      let startPage = 1;
      let endPage = totalPages;
  
      if (totalPages > 10 && this.currentPage > 6) {
        startPage = this.currentPage - 5;
        endPage = this.currentPage + 4;
        if (endPage > totalPages) {
          startPage = totalPages - 9;
          endPage = totalPages;
        }
      } else if (totalPages > 10) {
        endPage = 10;
      }
  
      for (let i = startPage; i <= endPage; i++) {
        const navigationItem = document.createElement("button");
        navigationItem.textContent = i;
        navigationItem.addEventListener("click", () => {
          this.currentPage = i;
          document.body.innerHTML = "";
          this.renderFlashcards();
          this.renderNavigation();
        });
        navigationContainer.appendChild(navigationItem);
      }
  
      document.body.prepend(navigationContainer);
    }
  }
  
  const flashcards = new Flashcards(10);
  flashcards.fetchFlashcards();
  
  