document.addEventListener('DOMContentLoaded', function () {
    const bookForm = document.getElementById('bookForm');
    const bookList = document.getElementById('bookList');
    const allBooksBtn = document.getElementById('allBooks');
    const readBooksBtn = document.getElementById('readBooks');
    const unreadBooksBtn = document.getElementById('unreadBooks');

    let books = JSON.parse(localStorage.getItem('books')) || [];

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

    // Save books to local storage
    function saveBooks() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    bookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addBook();
    });

    function addBook() {
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const pages = document.getElementById('pages').value;
        const category = document.getElementById('category').value;

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
        bookTitle.textContent = book.title;

        const bookAuthor = document.createElement('p');
        bookAuthor.innerHTML = `<i class="fas fa-user-edit"></i> ${book.author}`;

        const bookPages = document.createElement('p');
        bookPages.innerHTML = `<i class="fas fa-file-alt"></i> ${book.pages} pages`;

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
        readButton.innerHTML = book.read ? '<i class="fas fa-book"></i> Mark as Unread' : '<i class="fas fa-book-reader"></i> Mark as Read';
        readButton.addEventListener('click', function () {
            books[index].read = !books[index].read;
            saveBooks();
            bookItem.classList.toggle('read');
            readButton.innerHTML = books[index].read ? '<i class="fas fa-book"></i> Mark as Unread' : '<i class="fas fa-book-reader"></i> Mark as Read';
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
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