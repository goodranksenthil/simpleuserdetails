import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import UserTable from './components/UserTable';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);

  // Provide logout function globally for UserTable
  window.onLogout = () => setUser(null);

  return (
    <div>
      {!user ? (
        <LoginForm onLogin={setUser} />
      ) : (
        <UserTable />
      )}
    </div>
  );
}

export default App;
