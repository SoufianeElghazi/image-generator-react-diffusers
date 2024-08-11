import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ImageGenerator from './components/ImageGenerator';
import ImageGallery from './components/ImageGallery';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ImageGenerator />} />
                <Route path="/gallery" element={<ImageGallery />} />
            </Routes>
        </Router>
    );
}

export default App;
