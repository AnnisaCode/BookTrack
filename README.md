# BookTrack - Personal Reading Collection Manager

BookTrack is a clean, intuitive web application for managing your personal book collection. Track your reading progress, categorize books, rate them, and organize your literary journey - all in one place.

## Features

- **Book Management**: Add books with title, author, page count, and category
- **Reading Status**: Mark books as read/unread with visual indicators
- **Rating System**: Rate your books with a 5-star system
- **Categorization**: Organize books by categories (Novel, Education, Biography, Fiction, Non-Fiction)
- **Filtering**: Filter your collection by reading status (All/Read/Unread)
- **Responsive Design**: Fully optimized for both desktop and mobile devices
- **Local Storage**: All your data is saved in your browser's local storage
- **Notifications**: Receive elegant notifications for actions like adding or deleting books

## Technologies Used

- HTML5
- CSS3 with modern design principles
- Vanilla JavaScript (No frameworks)
- Font Awesome for icons
- Google Fonts (Poppins)
- Local Storage API for data persistence

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/annisacode/booktrack.git
   ```
2. Navigate to the project directory:
   ```bash
   cd booktrack
   ```
3. Open `index.html` in your browser or use a local server.

## Usage

### Adding a Book
1. Fill in the book details: title, author, page count, and select a category
2. Click "Add Book" button

### Managing Books
- Toggle the read status by clicking "Mark as Read" / "Mark as Unread" button
- Rate books by clicking on the stars
- Delete books using the "Delete" button (with confirmation)

### Filtering Your Collection
- Use the filter buttons at the top of the book list to view:
  - All books
  - Read books only
  - Unread books only

## Project Structure

```
booktrack/
│
├── index.html          # Main HTML document
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## Key Code Features

- **Modular JS functions**: Organized code with separation of concerns
- **Dynamic DOM Manipulation**: All book elements created and updated dynamically
- **Event Delegation**: Efficient event handling
- **Local Storage Integration**: Data persistence without a backend
- **Responsive Design**: Flexbox and media queries for device adaptation

## Future Enhancements

Potential improvements for future versions:
- Book search and sort functionality
- More detailed book information (ISBN, publication date)
- Dark/light theme toggle
- Cloud data synchronization
- Book import/export capabilities
- Reading statistics and insights

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons provided by [Font Awesome](https://fontawesome.com/)
- Fonts provided by [Google Fonts](https://fonts.google.com/)

---

Created with ❤️ as a demonstration project. 
