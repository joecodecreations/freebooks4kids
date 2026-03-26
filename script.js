document.addEventListener('DOMContentLoaded', () => {
    const booksGrid = document.getElementById('booksGrid');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const youtubeIframe = document.getElementById('youtubeIframe');
    const amazonBtn = document.getElementById('amazonBtn');

    // Fetch the generated books data
    fetch('books_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderBooks(data);
        })
        .catch(error => {
            console.error('Error fetching books data:', error);
            booksGrid.innerHTML = `
                <div style="text-align: center; grid-column: 1 / -1; padding: 40px;">
                    <h3>Oops! Could not load the books.</h3>
                    <p>Make sure you have run the data generator script.</p>
                </div>
            `;
        });

    function renderBooks(books) {
        if (books.length === 0) {
            booksGrid.innerHTML = `
                <div style="text-align: center; grid-column: 1 / -1; padding: 40px;">
                    <h3>No books available yet!</h3>
                    <p>Check back soon for magical stories.</p>
                </div>
            `;
            return;
        }

        books.forEach(book => {
            // Create Book Card Element
            const card = document.createElement('div');
            card.className = 'book-card';
            
            // Generate Inner HTML
            card.innerHTML = `
                <img class="book-cover" src="${book.coverImage !== null ? book.coverImage : 'https://via.placeholder.com/400x500.png?text=No+Cover'}" alt="${book.title} Cover">
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">By ${book.author}</p>
                    <div class="card-actions">
                        <button class="watch-btn">▶ Watch & Read</button>
                        ${book.amazonUrl ? `<a href="${book.amazonUrl}" class="card-amazon-btn" target="_blank" rel="noopener noreferrer">🛒 Buy on Amazon</a>` : ''}
                    </div>
                </div>
            `;

            // Add Click Event Listener
            card.addEventListener('click', (e) => {
                if (e.target.closest('.card-amazon-btn')) {
                    return; // Default <a> behavior triggered, stop from opening modal
                }
                openModal(book);
            });

            booksGrid.appendChild(card);
        });
    }

    function openModal(book) {
        // Ensure the Youtube URL is an embed URL. If not, auto-convert standard links.
        let embedUrl = book.youtubeUrl;
        if (embedUrl.includes('watch?v=')) {
            embedUrl = embedUrl.replace('watch?v=', 'embed/');
            // Remove any other query params like &t= or &list=
            if (embedUrl.includes('&')) {
                embedUrl = embedUrl.split('&')[0];
            }
        } else if (embedUrl.includes('youtu.be/')) {
            embedUrl = embedUrl.replace('youtu.be/', 'www.youtube.com/embed/');
            if (embedUrl.includes('?')) {
                embedUrl = embedUrl.split('?')[0];
            }
        }
        
        // Add autoplay
        const separator = embedUrl.includes('?') ? '&' : '?';
        youtubeIframe.src = `${embedUrl}${separator}autoplay=1`;
        
        // Handle Amazon Link Visibility
        if (book.amazonUrl) {
            amazonBtn.href = book.amazonUrl;
            amazonBtn.style.display = 'inline-block';
        } else {
            amazonBtn.href = '#';
            amazonBtn.style.display = 'none';
        }

        // Show Modal
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeVideoModal() {
        videoModal.classList.remove('active');
        youtubeIframe.src = ''; // Stop video from playing in bg
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    closeModal.addEventListener('click', closeVideoModal);

    // Close on clicking outside the modal content
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
});
