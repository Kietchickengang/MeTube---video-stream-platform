import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import LayOut from './page/LayOut';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LayOut />
      </AuthProvider>
    </Router>
  );
}

export default App;
