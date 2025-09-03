import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import useDebounce from './hooks/useDebounce';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`http://localhost:4000/api/tasks?limit=10&status=${debouncedSearch}`);
      setTasks(res.data.items);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const renderedTasks = useMemo(() => {
    return tasks.map((t) => (
      <li key={t._id}>{t.title} - {t.status}</li>
    ));
  }, [tasks]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Tasks</h1>
      <input
        type="text"
        placeholder="Filter by status (todo, doing, done)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {error && <div><p>{error}</p><button onClick={fetchTasks}>Retry</button></div>}
      {!loading && !error && tasks.length === 0 && <p>No tasks found</p>}
      <ul>{renderedTasks}</ul>
    </div>
  );
}

export default App;