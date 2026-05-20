import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { getTheme } from './service/userDataService.js';

import LayOut from './page/LayOut';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const storedTheme = getTheme();
    setTheme(storedTheme);
    document.documentElement.classList.toggle('theme-light', storedTheme === 'light');
    document.documentElement.classList.toggle('theme-dark', storedTheme === 'dark');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <LayOut theme={theme} />
      </AuthProvider>
    </Router>
  );
}

export default App;
