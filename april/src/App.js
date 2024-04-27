import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom'; // Add Navigate import

// Create a context to hold user information
const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setUser({ accessToken: token });
    }
  }, []);

  const handleSignUp = (userData) => {
    const accessToken = Math.random().toString(36).substring(2, 18);
    setUser({ ...userData, accessToken });
    localStorage.setItem('accessToken', accessToken);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <Router>
      <UserContext.Provider value={{ user, handleSignUp }}>
        <div className="App">
          <nav>
            <ul>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </nav>

          <Route path="/signup">
            {user ? <Navigate to="/profile" /> : <SignUp />}
          </Route>
          <Route path="/profile">
            {user ? <Profile /> : <Navigate to="/signup" />}
          </Route>
        </div>
      </UserContext.Provider>
    </Router>
  );
};

// Rest of your components remain unchanged
const SignUp = () => {
  const { handleSignUp } = React.useContext(UserContext);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [messages, setMessages] = useState({ errorMessage: '', successMessage: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username && formData.email && formData.password) {
      handleSignUp(formData);
      setMessages({ successMessage: 'Signed up successfully!', errorMessage: '' });
    } else {
      setMessages({ errorMessage: 'All fields are mandatory.', successMessage: '' });
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
      {messages.errorMessage && <p style={{ color: 'red' }}>{messages.errorMessage}</p>}
      {messages.successMessage && <p style={{ color: 'green' }}>{messages.successMessage}</p>}
    </div>
  );
};

const Profile = () => {
  const { user } = React.useContext(UserContext);

  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Access Token: {user.accessToken}</p>
        </div>
      )}
    </div>
  );
};

export default App;