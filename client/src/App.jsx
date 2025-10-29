// liblink/client/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);

  // ✨ Recommendation state
  const [interests, setInterests] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Fetch loans on mount
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await API.get('/loans/my');
        setLoans(res.data);
      } catch (err) {
        console.error('Failed to load loans');
        setLoans([
          {
            _id: '1',
            bookId: { title: 'Clean Code', author: 'Robert C. Martin' },
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          }
        ]);
      } finally {
        setLoadingLoans(false);
      }
    };
    fetchLoans();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await API.get(`/books/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data);
    } catch (err) {
      setSearchResults([]);
    }
  };

  const handleRecommend = async (e) => {
    e.preventDefault();
    if (!interests.trim()) return;

    setLoadingRecs(true);
    try {
      const res = await API.get(`/books/recommend?interests=${encodeURIComponent(interests)}`);
      setRecommendations(res.data);
    } catch (err) {
      console.error('Recommendation failed');
      setRecommendations([
        { title: "Atomic Habits", author: "James Clear" },
        { title: "Deep Work", author: "Cal Newport" },
        { title: "The Pragmatic Programmer", author: "Andy Hunt" },
        { title: "Sapiens", author: "Yuval Noah Harari" },
        { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" }
      ]);
    } finally {
      setLoadingRecs(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 LibLink</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your unified library assistant — track due dates, check availability, and discover new books with AI.
          </p>
        </header>

        {/* Due Dates Card */}
        <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📅</span> Upcoming Due Dates
          </h2>
          {loadingLoans ? (
            <p className="text-gray-500">Loading your loans...</p>
          ) : loans.length === 0 ? (
            <p className="text-gray-500 italic">No active loans found.</p>
          ) : (
            <div className="space-y-3">
              {loans.map((loan) => (
                <div
                  key={loan._id}
                  className="flex justify-between items-start p-4 bg-blue-50 rounded-xl border border-blue-100"
                >
                  <div>
                    <h3 className="font-bold text-gray-800">{loan.bookId?.title || 'Unknown Book'}</h3>
                    <p className="text-gray-600 text-sm">by {loan.bookId?.author || 'Unknown Author'}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 font-medium rounded-full text-sm">
                    Due: {new Date(loan.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Search Section */}
        <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔍</span> Search Library Inventory
          </h2>
          <form onSubmit={handleSearch} className="flex gap-3 mb-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter book title or author..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="btn btn-primary whitespace-nowrap">
              Search Books
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((book) => (
                <div
                  key={book._id}
                  className="flex justify-between items-center p-4 border rounded-xl"
                >
                  <div>
                    <h3 className="font-bold text-gray-800">{book.title}</h3>
                    <p className="text-gray-600">by {book.author}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      book.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && (
            <p className="text-gray-500">No books found for "{searchQuery}".</p>
          )}
        </section>

        {/* AI Recommendations */}
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🧠</span> Get AI Book Recommendations
          </h2>
          <form onSubmit={handleRecommend} className="flex gap-3 mb-5">
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., AI, history, self-help..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button
              type="submit"
              disabled={loadingRecs}
              className={`btn ${loadingRecs ? 'btn-outline' : 'btn-secondary'} whitespace-nowrap`}
            >
              {loadingRecs ? 'Generating...' : 'Get Recommendations'}
            </button>
          </form>

          {recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Recommended for you:</h3>
              {recommendations.map((book, i) => (
                <div
                  key={i}
                  className="p-4 bg-violet-50 border border-violet-100 rounded-xl"
                >
                  <h3 className="font-bold text-gray-800">{book.title}</h3>
                  <p className="text-gray-600 text-sm">by {book.author}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-10">
          <p>LibLink • PR25-02 Hackathon Project • Tech Team</p>
        </footer>
      </div>
    </div>
  );
}
