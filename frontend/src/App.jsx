import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SearchForm from './components/SearchForm';
import PhotoTable from './components/PhotoTable';
import InsertForm from './components/InsertForm';
import { searchPhotos, insertPhoto } from './api';

function App() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });
  const [view, setView] = useState(auth ? 'search' : 'login');
  const [searchResult, setSearchResult] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingInsert, setLoadingInsert] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function handleLogin(data) {
    const authData = {
      token: data.token,
      user: data.user,
    };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
    setView('search');
  }

  function handleLogout() {
    setAuth(null);
    localStorage.removeItem('auth');
    setView('login');
    setSearchResult(null);
  }

  async function handleSearch(filters) {
    if (!auth) return;
    setLoadingSearch(true);
    setError(null);
    setMessage(null);
    try {
      const result = await searchPhotos(auth.token, filters);
      setSearchResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSearch(false);
    }
  }

  async function handleInsert(photo) {
    if (!auth) return;
    setLoadingInsert(true);
    setError(null);
    setMessage(null);
    try {
      const created = await insertPhoto(auth.token, photo);
      setMessage(`Foto inserida com sucesso (id=${created.id}).`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingInsert(false);
    }
  }

  return (
    <div className="app-container">
      <header>
        <div>
          <h1>Projeto 2 - Mars Rover</h1>
          {auth && <small>Logado como {auth.user.email}</small>}
        </div>
        <nav>
          {auth && (
            <>
              <button
                className={view === 'search' ? '' : 'secondary'}
                onClick={() => setView('search')}
              >
                Busca
              </button>
              <button
                className={view === 'insert' ? '' : 'secondary'}
                onClick={() => setView('insert')}
              >
                Inserção
              </button>
              <button className="secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </header>
      <main>
        {!auth && <LoginForm onLogin={handleLogin} />}
        {auth && view === 'search' && (
          <>
            <SearchForm onSearch={handleSearch} loading={loadingSearch} />
            {error && <div className="error">{error}</div>}
            {message && <div className="success">{message}</div>}
            <PhotoTable result={searchResult} />
          </>
        )}
        {auth && view === 'insert' && (
          <>
            <InsertForm onInsert={handleInsert} loading={loadingInsert} />
            {error && <div className="error">{error}</div>}
            {message && <div className="success">{message}</div>}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
