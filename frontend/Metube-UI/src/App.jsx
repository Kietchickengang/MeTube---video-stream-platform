import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import LayOut from './page/LayOut';

function App() {
  return (
    <Router>
      <LayOut />
    </Router>
  );
}

export default App;