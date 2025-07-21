import { useState } from 'react';
import Tabs from './Tabs';
import './App.css';

function App() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const totalTabs = 3;

  const handleNext = () => {
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, totalTabs - 1));
  };

  const handlePrevious = () => {
    setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }; 
  
  // 1. Define handleTabClick function
  const handleTabClick = (index) => {
    // Directly set the active tab index based on the clicked header's index
    setActiveTabIndex(index);
  };

  return (
    <div className="App">
      <h1>Job Application Form</h1>
      {/* 2. Add the onTabClick prop and pass the handler */}
      <Tabs
        activeTabIndex={activeTabIndex}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onTabClick={handleTabClick} // Pass the new handler function
      />
    </div>
  );
}

export default App;