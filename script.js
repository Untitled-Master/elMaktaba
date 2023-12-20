document.addEventListener("DOMContentLoaded", function () {
  const tagSelect = document.getElementById('tagSelect');
  const bookCardsContainer = document.getElementById('bookCards');
  const documentCountSpan = document.getElementById('documentCount');
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');
  const booksPerPage = 6;
  let currentPage = 1;

  // Load JSON data
  fetch('https://booksapi.u1u1u1u1u1u1u1.repl.co/api/books')
    .then(response => response.json())
    .then(data => {
      // Function to generate book cards for the current page
      function generateBookCards(selectedTag) {
        // Clear existing book cards
        bookCardsContainer.innerHTML = '';

        // Filter books based on the selected tag
        const filteredBooks = selectedTag === 'all' ? data : data.filter(book => book.tag === selectedTag);

        // Calculate start and end indices for the current page
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;

        // Slice books for the current page
        const booksForPage = filteredBooks.slice(startIndex, endIndex);

        // Generate book cards for the current page
        booksForPage.forEach(book => {
          const cardHtml = `
            <div class="col-lg-4 mb-4">
              <div class="card animate__animated animate__fadeInLeft">
                <img src="${book.image}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                  <h5 class="card-title">${book.title}</h5>
                  <p class="card-text">
                    <strong>الكاتب:</strong> ${book.author}<br>
                    <strong>الوسم:</strong> ${book.tag}<br>
                    <strong>اللغة:</strong> ${book.language}
                  </p>
                  <a href="${book.link}" class="btn btn-primary">
                    اقرأ الكتاب
                    <i class="fas fa-book-reader ml-2"></i>
                  </a>
                </div>
              </div>
            </div>
          `;
          bookCardsContainer.innerHTML += cardHtml;
        });

        // Update document count
        documentCountSpan.textContent = filteredBooks.length;
      }

      // Populate the dropdown with unique tags from the data
      const uniqueTags = [...new Set(data.map(book => book.tag))];
      uniqueTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.text = tag;
        tagSelect.add(option);
      });

      // Add event listener to dynamically update book cards based on the selected tag
      tagSelect.addEventListener('change', function () {
        generateBookCards(this.value);
      });

      // Add event listeners for pagination buttons
      prevPageButton.addEventListener('click', function () {
        if (currentPage > 1) {
          currentPage--;
          generateBookCards(tagSelect.value);
        }
      });

      nextPageButton.addEventListener('click', function () {
        const totalBooks = tagSelect.value === 'all' ? data.length : data.filter(book => book.tag === tagSelect.value).length;
        const totalPages = Math.ceil(totalBooks / booksPerPage);

        if (currentPage < totalPages) {
          currentPage++;
          generateBookCards(tagSelect.value);
        }
      });

      // Initially load book cards with all books
      generateBookCards('all');
    })
    .catch(error => console.error('Error fetching data:', error));
});
