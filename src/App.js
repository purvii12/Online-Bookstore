import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_BASE = 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com'; // update when backend is ready

const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C Martin',
    category: 'Programming',
    price: 3799, // in rupees
    description: 'Practical handbook on writing clean, maintainable and readable code.',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX377_BO1,204,203,200_.jpg',
    stock: 25
  },

];
async function fetchExternalBooks() {
  try {
    const res = await fetch('https://api.itbook.store/1.0/new');
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.books)) return [];
    return data.books.slice(0, 12).map((b, index) => ({
      id: 1000 + index,
      title: b.title,
      author: b.subtitle || 'Unknown author',
      category: 'Technology',
      // convert price like "$32.04" to rupees approx
      price: Math.round(parseFloat((b.price || '$0').replace('$', '') || 0) * 80 * 100),
      description: b.subtitle || '',
      imageUrl: b.image,
      stock: 20
    }));
  } catch (e) {
    console.error('Error fetching external books', e);
    return [];
  }
}


function formatRupees(value) {
  return `₹${(value / 100).toFixed(2)}`;
}

function App() {

    const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null); // "login" or "register"
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthForm({ name: '', email: '', password: '' });
  };

  const handleAuthChange = (field, value) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password || (authMode === 'register' && !authForm.name)) {
      alert('Please fill all required fields');
      return;
    }
    const user = {
      name: authMode === 'register' ? authForm.name : authForm.email.split('@')[0],
      email: authForm.email
    };
    setCurrentUser(user);
    setAuthMode(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
    const loadBooks = async () => {
      let baseBooks = INITIAL_BOOKS;
      try {
        const res = await fetch(`${API_BASE}/books`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.books) && data.books.length > 0) {
            baseBooks = data.books.map((b) => ({
              id: b.id,
              title: b.title,
              author: b.author,
              category: b.category,
              price: Math.round(Number(b.price) * 100),
              description: b.description || '',
              imageUrl: b.image_url || '',
              stock: b.stock || 0
            }));
          }
        }
      } catch (err) {
        console.log('Using local books because API is not ready yet.');
      }

      const external = await fetchExternalBooks();
      setBooks([...baseBooks, ...external]);
    };

    loadBooks();
  }, []);


  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesCategory =
        category === 'All' || book.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, category]);

  const addToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === bookId);
      if (!existing) return prev;
      if ((existing.quantity || 1) <= 1) {
        return prev.filter((item) => item.id !== bookId);
      }
      return prev.map((item) =>
        item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category));
    return ['All', ...Array.from(set)];
  }, [books]);

  return (
    <div className="App">
      <header className="header">
        <div>
          <h1 className="site-title">Online Bookstore</h1>
          <p className="site-subtitle">Find any book you desire in minutes!</p>
        </div>
                <div className="header-right">
          <div className="user-summary">
            <span className="user-icon">👤</span>
            {currentUser ? (
              <>
                <span className="user-name">Hello, {currentUser.name}</span>
                <button className="secondary-button small" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  className="secondary-button small"
                  onClick={() => openAuth('login')}
                >
                  Log in
                </button>
                <button
                  className="add-button small"
                  onClick={() => openAuth('register')}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>


      </header>

      <div className="toolbar">
        <div className="toolbar-group">
          <label className="toolbar-label">Search</label>
          <input
            type="text"
            placeholder="Search by title"
            className="toolbar-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-group">
          <label className="toolbar-label">Category</label>
          <select
            className="toolbar-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <main className="main-content">
        <section className="books-section">
          <h2 className="section-title">Available Books</h2>
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-image-wrapper">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="book-image"
                    />
                  ) : (
                    <div className="book-cover">Book</div>
                  )}
                </div>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-category">{book.category}</p>
                <div className="book-footer">
                  <span className="book-price">{formatRupees(book.price)}</span>
                  <div className="book-actions">
                    <button
                      className="secondary-button"
                      onClick={() => setSelectedBook(book)}
                    >
                      Details
                    </button>
                    <button
                      className="add-button"
                      onClick={() => addToCart(book)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredBooks.length === 0 && (
              <p className="empty-state">No books match your search.</p>
            )}
          </div>
        </section>

        <aside className="cart-section">
                  <aside className="cart-section">
          <div className="cart-header">
            <div className="cart-header-left">
              <span className="cart-icon">🛒</span>
              <div>
                <h2 className="section-title cart-title">Cart</h2>
                <p className="cart-subtitle">
                  Items: {cart.length} · Total: {formatRupees(totalPrice)}
                </p>
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <p className="empty-cart">Cart is empty</p>
          ) : (
            <ul className="cart-list">
              {cart.map((item, index) => (
                <li key={index} className="cart-item">
                  <div className="cart-item-main">
                    <span className="cart-item-title">{item.title}</span>
                    <span className="cart-item-meta">
                      Qty: {item.quantity || 1}
                    </span>
                  </div>
                  <div className="cart-item-actions">
                    <span className="cart-item-price">
                      {formatRupees(item.price * (item.quantity || 1))}
                    </span>
                    <button
                      className="secondary-button tiny"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
        </aside>
      </main>

      <footer className="footer">
        <p>Sample online bookstore for AWS project</p>
      </footer>

  {selectedBook && (
    <div className="modal-backdrop" onClick={() => setSelectedBook(null)}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title">{selectedBook.title}</h3>
        <img
          src={selectedBook.imageUrl}
          alt={selectedBook.title}
          className="modal-book-image"
          style={{ maxWidth: '200px', marginBottom: '1rem' }}
        />
        <p><strong>Author:</strong> {selectedBook.author}</p>
        <p><strong>Category:</strong> {selectedBook.category}</p>
        <p><strong>Description:</strong> {selectedBook.description}</p>
        <p><strong>Price:</strong> {formatRupees(selectedBook.price)}</p>
        <p><strong>Stock:</strong> {selectedBook.stock}</p>
        <div className="modal-actions">
          <button
            className="secondary-button"
            onClick={() => setSelectedBook(null)}
          >
            Close
          </button>
          <button
            className="add-button"
            onClick={() => {
              addToCart(selectedBook);
              setSelectedBook(null);
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )}
            {authMode && (
        <div className="modal-backdrop" onClick={() => setAuthMode(null)}>
          <div
            className="modal auth-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">
              {authMode === 'login' ? 'User login' : 'User registration'}
            </h3>
            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authMode === 'register' && (
                <div className="form-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => handleAuthChange('name', e.target.value)}
                  />
                </div>
              )}
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => handleAuthChange('email', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => handleAuthChange('password', e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setAuthMode(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="add-button">
                  {authMode === 'login' ? 'Log in' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
