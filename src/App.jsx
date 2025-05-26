import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [showTips, setShowTips] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setCharacterCount(prompt.length);
  }, [prompt]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('storyHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const copyToClipboard = async () => {
    if (story) {
      try {
        await navigator.clipboard.writeText(story);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const addToHistory = (prompt, story) => {
    const newHistory = [
      { prompt, story, timestamp: new Date().toISOString() },
      ...history
    ].slice(0, 10); // Keep only the last 10 stories
    setHistory(newHistory);
    localStorage.setItem('storyHistory', JSON.stringify(newHistory));
  };

  const loadStoryFromHistory = (story) => {
    setStory(story);
    setShowHistory(false);
  };

  const deleteFromHistory = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem('storyHistory', JSON.stringify(newHistory));
  };

  const generateStory = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setStory("");
    setShowTips(false);
    setCopied(false);
    
    try {
      const response = await fetch("https://story-genertor.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate story');
      }
      
      const data = await response.json();
      setStory(data.story);
      addToHistory(prompt, data.story);
    } catch (error) {
      console.error("Error generating story:", error);
      setStory("⚠️ Failed to generate story. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateStory();
    }
  };

  const tips = [
    "Try to be specific about the setting and characters",
    "Include emotions and conflicts for more engaging stories",
    "Mention the genre or style you're looking for",
    "Add some key plot points you'd like to see",
    "Specify the tone (funny, serious, mysterious, etc.)"
  ];

  return (
    <>
      <div className="top-controls">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        />
        <button 
          className="history-toggle"
          onClick={() => setShowHistory(!showHistory)}
          aria-label="Toggle history"
        >
          📜 History
        </button>
      </div>
      
      <div className="hero">
        <h1>✨ AI Story Generator</h1>
        <p>Transform your ideas into captivating stories with the power of AI</p>
      </div>
      
      <div className="story-generator">
        <div className="input-section">
          <div className="input-header">
            <h2>Your Story Prompt</h2>
            <span className="character-count">{characterCount}/500</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your story prompt or keywords... (Press Ctrl + Enter to generate)"
            rows={4}
            disabled={loading}
            maxLength={500}
          />
          {showTips && (
            <div className="tips-section">
              <h3>💡 Tips for better stories:</h3>
              <ul>
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          <button 
            onClick={generateStory} 
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <span>Generating<span className="loading-dots"></span></span>
            ) : (
              "Generate Story"
            )}
          </button>
        </div>
        
        <div className="story-section">
          <div className="story-header">
            <h2>Your Story</h2>
            {story && (
              <button 
                className="copy-button"
                onClick={copyToClipboard}
                aria-label="Copy story to clipboard"
              >
                {copied ? 'Copied!' : '📋 Copy'}
              </button>
            )}
          </div>
          <div className="story-content">
            {loading ? (
              <div className="loading-placeholder">
                <p>Creating your story...</p>
                <div className="loading-animation"></div>
              </div>
            ) : story ? (
              story
            ) : (
              <p className="placeholder-text">
                Your generated story will appear here...
              </p>
            )}
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="history-modal">
          <div className="history-content">
            <div className="history-header">
              <h2>Story History</h2>
              <button 
                className="close-button"
                onClick={() => setShowHistory(false)}
                aria-label="Close history"
              >
                ✕
              </button>
            </div>
            <div className="history-list">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-prompt">{item.prompt}</div>
                    <div className="history-actions">
                      <button 
                        onClick={() => loadStoryFromHistory(item.story)}
                        className="load-button"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => deleteFromHistory(index)}
                        className="delete-button"
                        aria-label="Delete story"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-history">No history yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
