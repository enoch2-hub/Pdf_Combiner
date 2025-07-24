import React from 'react'
// import PdfCombiner from './components/PdfCombiner.jsx';
import PdfComb from './components/PdfCmb/PdfComb.jsx';

import './App.css';
import PdfCombiner from './components/PdfCombiner.jsx';

const App = () => {
  return (
    <div className='container'>
      <PdfComb/>
      {/* <PdfCombiner/> */}
    </div>
  )
}

export default App