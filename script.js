document.addEventListener('DOMContentLoaded', function () {
    const bookForm = document.getElementById('bookForm');
    const bookList = document.getElementById('bookList');
    const allBooksBtn = document.getElementById('allBooks');
    const readBooksBtn = document.getElementById('readBooks');
    const unreadBooksBtn = document.getElementById('unreadBooks');
    const resetDataBtn = document.getElementById('resetData');

    // Simple encryption and decryption functions
    function encrypt(data) {
        try {
            // Create simple key for encryption (not for real security, just obfuscation)
            const key = "BookTrack_Secret_Key";
            // Convert to JSON string and encode
            const jsonString = JSON.stringify(data);
            // Use btoa for simple encoding and add a prefix
            return 'ENCRYPTED:' + btoa(jsonString + key);
        } catch (e) {
            console.error("Encryption error:", e);
            return JSON.stringify(data); // Fallback to plain JSON
        }
    }

    function decrypt(encryptedData) {
        try {
            // Check if the data is encrypted
            if (!encryptedData || !encryptedData.startsWith('ENCRYPTED:')) {
                // Return empty array for non-encrypted or invalid data
                return [];
            }
            // Remove prefix and decode
            const encodedData = encryptedData.replace('ENCRYPTED:', '');
            const key = "BookTrack_Secret_Key";
            const decodedString = atob(encodedData);
            // Remove the key from the decoded string
            const jsonString = decodedString.substring(0, decodedString.length - key.length);
            // Parse JSON
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Decryption error:", e);
            return []; // Return empty array on error
        }
    }

    // Load books from local storage with decryption
    let books = [];
    try {
        const storedData = localStorage.getItem('books');
        books = storedData ? decrypt(storedData) : [];

        // Validate loaded data
        if (!Array.isArray(books)) {
            console.warn("Invalid data format in localStorage. Resetting.");
            books = [];
        } else {
            // Validate each book object
            books = books.filter(book => {
                return (
                    book &&
                    typeof book === 'object' &&
                    typeof book.title === 'string' &&
                    typeof book.author === 'string' &&
                    !isNaN(book.pages) &&
                    typeof book.category === 'string'
                );
            });
        }
    } catch (e) {
        console.error("Error loading books:", e);
        books = [];
    }

    // Sanitize function to prevent XSS attacks
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Validate input function
    function validateInput(title, author, pages) {
        // Check if title and author contain only valid characters
        const nameRegex = /^[a-zA-Z0-9\s.,\-':()&]+$/;

        if (!nameRegex.test(title)) {
            showNotification('Invalid characters in title!', 'delete');
            return false;
        }

        if (!nameRegex.test(author)) {
            showNotification('Invalid characters in author!', 'delete');
            return false;
        }

        // Check if pages is a positive number
        if (isNaN(pages) || parseInt(pages) <= 0 || parseInt(pages) > 10000) {
            showNotification('Pages must be a positive number less than 10,000!', 'delete');
            return false;
        }

        return true;
    }

    // Load books from local storage
    function loadBooks() {
        bookList.innerHTML = '';
        if (books.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-message');
            emptyMessage.innerHTML = '<i class="fas fa-info-circle"></i> No books yet. Add your first book!';
            bookList.appendChild(emptyMessage);
            return;
        }

        books.forEach((book, index) => {
            createBookElement(book, index);
        });
    }

    // Save books to local storage with encryption
    function saveBooks() {
        try {
            localStorage.setItem('books', encrypt(books));
        } catch (e) {
            console.error("Error saving books:", e);
            showNotification('Error saving data!', 'delete');
        }
    }

    // Reset all data
    function resetAllData() {
        try {
            if (confirm('Are you sure you want to delete ALL books? This cannot be undone.')) {
                localStorage.removeItem('books');
                books = [];
                loadBooks();
                showNotification('All data has been reset!', 'delete');
            }
        } catch (e) {
            console.error("Error resetting data:", e);
            showNotification('Error resetting data!', 'delete');
        }
    }

    // Add error handling to all event listeners
    bookForm.addEventListener('submit', function (e) {
        try {
            e.preventDefault();
            addBook();
        } catch (err) {
            console.error("Error in form submission:", err);
            showNotification('An error occurred!', 'delete');
        }
    });

    // Reset data button event listener
    resetDataBtn.addEventListener('click', function () {
        resetAllData();
    });

    function addBook() {
        try {
            const titleInput = document.getElementById('title').value.trim();
            const authorInput = document.getElementById('author').value.trim();
            const pagesInput = document.getElementById('pages').value.trim();
            const category = document.getElementById('category').value;

            // Validate inputs
            if (!validateInput(titleInput, authorInput, pagesInput)) {
                return;
            }

            // Validate category is from allowed list
            const validCategories = ['Novel', 'Education', 'Biography', 'Fiction', 'Non-Fiction'];
            if (!validCategories.includes(category)) {
                showNotification('Invalid category selected!', 'delete');
                return;
            }

            // Sanitize inputs
            const title = sanitizeInput(titleInput);
            const author = sanitizeInput(authorInput);
            const pages = parseInt(pagesInput);

            // Create a new book object
            const newBook = {
                title,
                author,
                pages,
                category,
                read: false,
                rating: 0,
                dateAdded: new Date().toISOString()
            };

            // Prevent duplicate entries
            const isDuplicate = books.some(book =>
                book.title.toLowerCase() === title.toLowerCase() &&
                book.author.toLowerCase() === author.toLowerCase()
            );

            if (isDuplicate) {
                showNotification('This book already exists in your collection!', 'delete');
                return;
            }

            // Add to books array
            books.push(newBook);

            // Save to local storage
            saveBooks();

            // Create book element
            createBookElement(newBook, books.length - 1);

            // Show success notification
            showNotification('Book added successfully!', 'success');

            // Reset the form
            bookForm.reset();
        } catch (err) {
            console.error("Error adding book:", err);
            showNotification('Error adding book!', 'delete');
        }
    }

    function createBookElement(book, index) {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        if (book.read) bookItem.classList.add('read');

        // Create category badge
        const categoryBadge = document.createElement('span');
        categoryBadge.classList.add('category-badge');
        categoryBadge.textContent = book.category;

        const bookDetails = document.createElement('div');
        bookDetails.classList.add('book-details');

        const bookTitle = document.createElement('h3');
        // Use textContent instead of innerHTML for secure rendering
        bookTitle.textContent = book.title;

        const bookAuthor = document.createElement('p');
        // Create elements safely without using innerHTML
        const authorIcon = document.createElement('i');
        authorIcon.className = 'fas fa-user-edit';
        bookAuthor.appendChild(authorIcon);
        bookAuthor.appendChild(document.createTextNode(' ' + book.author));

        const bookPages = document.createElement('p');
        // Create elements safely without using innerHTML
        const pagesIcon = document.createElement('i');
        pagesIcon.className = 'fas fa-file-alt';
        bookPages.appendChild(pagesIcon);
        bookPages.appendChild(document.createTextNode(' ' + book.pages + ' pages'));

        const ratingStars = document.createElement('div');
        ratingStars.classList.add('rating');

        // Create rating stars
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.classList.add('far', 'fa-star');
            if (i <= book.rating) {
                star.classList.replace('far', 'fas');
            }
            star.setAttribute('data-rating', i);
            star.addEventListener('click', function () {
                books[index].rating = i;
                saveBooks();
                loadBooks();
            });
            ratingStars.appendChild(star);
        }

        bookDetails.appendChild(bookTitle);
        bookDetails.appendChild(categoryBadge);
        bookDetails.appendChild(bookAuthor);
        bookDetails.appendChild(bookPages);
        bookDetails.appendChild(ratingStars);

        const bookActions = document.createElement('div');
        bookActions.classList.add('book-actions');

        const readButton = document.createElement('button');
        // Create button content safely
        const readIcon = document.createElement('i');
        readIcon.className = book.read ? 'fas fa-book' : 'fas fa-book-reader';
        readButton.appendChild(readIcon);
        readButton.appendChild(document.createTextNode(' ' + (book.read ? 'Mark as Unread' : 'Mark as Read')));

        readButton.addEventListener('click', function () {
            books[index].read = !books[index].read;
            saveBooks();
            bookItem.classList.toggle('read');

            // Update button content safely
            readButton.innerHTML = '';
            const newIcon = document.createElement('i');
            newIcon.className = books[index].read ? 'fas fa-book' : 'fas fa-book-reader';
            readButton.appendChild(newIcon);
            readButton.appendChild(document.createTextNode(' ' + (books[index].read ? 'Mark as Unread' : 'Mark as Read')));
        });

        const deleteButton = document.createElement('button');
        // Create button content safely
        const trashIcon = document.createElement('i');
        trashIcon.className = 'fas fa-trash';
        deleteButton.appendChild(trashIcon);
        deleteButton.appendChild(document.createTextNode(' Delete'));

        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', function () {
            // Confirm delete
            if (confirm('Are you sure you want to delete this book?')) {
                books.splice(index, 1);
                saveBooks();
                loadBooks();
                showNotification('Book deleted successfully!', 'delete');
            }
        });

        bookActions.appendChild(readButton);
        bookActions.appendChild(deleteButton);
        bookItem.appendChild(bookDetails);
        bookItem.appendChild(bookActions);
        bookList.appendChild(bookItem);
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 2000);
    }

    // Filter handlers
    allBooksBtn.addEventListener('click', function () {
        setActiveFilter(this);
        loadBooks();
    });

    readBooksBtn.addEventListener('click', function () {
        setActiveFilter(this);
        bookList.innerHTML = '';
        const readBooks = books.filter(book => book.read);

        if (readBooks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-message');
            emptyMessage.innerHTML = '<i class="fas fa-info-circle"></i> No books marked as read yet.';
            bookList.appendChild(emptyMessage);
            return;
        }

        readBooks.forEach((book, index) => {
            const originalIndex = books.findIndex(b => b === book);
            createBookElement(book, originalIndex);
        });
    });

    unreadBooksBtn.addEventListener('click', function () {
        setActiveFilter(this);
        bookList.innerHTML = '';
        const unreadBooks = books.filter(book => !book.read);

        if (unreadBooks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-message');
            emptyMessage.innerHTML = '<i class="fas fa-info-circle"></i> All books have been read. Great job!';
            bookList.appendChild(emptyMessage);
            return;
        }

        unreadBooks.forEach((book, index) => {
            const originalIndex = books.findIndex(b => b === book);
            createBookElement(book, originalIndex);
        });
    });

    function setActiveFilter(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    }

    // Load books on page load
    loadBooks();
});