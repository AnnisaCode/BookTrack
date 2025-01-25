document.addEventListener('DOMContentLoaded', function () {
    const bookForm = document.getElementById('bookForm');
    const bookList = document.getElementById('bookList');

    bookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addBook();
    });

    function addBook() {
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const pages = document.getElementById('pages').value;

        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');

        const bookDetails = document.createElement('div');
        bookDetails.classList.add('book-details'); 
        bookDetails.innerHTML = `<strong>${title}</strong> by ${author} - ${pages} pages`;

        const bookActions = document.createElement('div');
        bookActions.classList.add('book-actions'); 
        const readButton = document.createElement('button');
        readButton.textContent = 'Mark as Read';
        readButton.addEventListener('click', function () {
            bookItem.classList.toggle('read');
            readButton.textContent = bookItem.classList.contains('read') ? 'Unread' : 'Mark as Read';
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            bookList.removeChild(bookItem);
        });

        bookActions.appendChild(readButton);
        bookActions.appendChild(deleteButton);
        bookItem.appendChild(bookDetails);
        bookItem.appendChild(bookActions);
        bookList.appendChild(bookItem);

        bookForm.reset();
    }
});