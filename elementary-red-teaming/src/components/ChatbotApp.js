import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import '../styles/ChatbotApp.css';

// Typewriter effect for the responses
const TypewriterText = ({ text }) => {

  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Effect to animate the text
  useEffect(() => {
    if (!text) {
      setDisplayText("");
      setCurrentIndex(0);
      return;
    }

    // If the text is not empty, animate it
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [text, currentIndex]);

  // Reset animation when text changes
  useEffect(() => {
    if (text) {
      setDisplayText("");
      setCurrentIndex(0);
    }
  }, [text]);

  return <p>{displayText}</p>;
};

// Main component for the chatbot
const ChatbotApp = () => {

  const [csvData, setCsvData] = useState([]); // Store the entire CSV data
  const [randomQuestions, setRandomQuestions] = useState([]); // Store random questions
  const [userInput, setUserInput] = useState(""); // Store user input
  const [response, setResponse] = useState(""); // Store the response to display
  const [adultResponse, setAdultResponse] = useState(""); // Store the adult response
  const [childResponse, setChildResponse] = useState(""); // Store the child response

  // Function to load CSV data
  useEffect(() => {
    const csvFilePath = "/Questions_Adult_Child_Responses.csv";
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (results) => {
        setCsvData(results.data);
        const allQuestions = results.data.map((row) => row.Question).filter(Boolean);
        if (allQuestions.length > 0) {
          loadRandomQuestions(allQuestions);
        } else {
          console.error("No questions found in the CSV file.");
        }
      },
      error: (error) => {
        console.error("Error loading CSV:", error);
      },
    });
  }, []);

  // Function to select 3 random questions
  const loadRandomQuestions = (allQuestions) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setRandomQuestions(shuffled.slice(0, 3)); // Pick 3 random questions
  };

  // Function to handle clicking on a question
  const handleQuestionClick = (question) => {
    setUserInput(question); // Insert the clicked question into the input field
    setResponse(""); // Clear the previous response
  };

  // Function to handle submit
  const handleSubmit = () => {
    const matchedRow = csvData.find((row) => row.Question === userInput);
    if (matchedRow) {
      setAdultResponse(matchedRow["Answer to an Adult"] || "Response not available.");
      setChildResponse(matchedRow["Answer to a Child"] || "Response not available.");
    } else {
      setAdultResponse("Sorry, I don't understand that question.");
      setChildResponse("Sorry, I don't understand that question.");
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Child-Friendly Chatbot</h1>
      </header>

      {/* Random Questions Section */}
      <section className="questionsSection">
        <h2>Suggestions:</h2>
        <div className="suggestionsContainer">
          {randomQuestions.length > 0 ? (
            randomQuestions.map((question, index) => (
              <div
                key={index}
                className="suggestionItem"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </div>
            ))
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      </section>

      {/* User Input Section */}
      <section className="inputSection">
        <h2>Ask me a question:</h2>
        <input
          type="text"
          placeholder="Type your question here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="inputField"
        />
        <button onClick={handleSubmit} className="submitButton">
          Submit
        </button>
      </section>

      {/* Response Section with Two Boxes */}
      <section className="responseSection">
        <div className="responsesContainer">
          <div className="responseColumn adult">
            <h3>Adult Response</h3>
            <div className="responseBox adult-box">
              <TypewriterText text={adultResponse} />
            </div>
          </div>
          <div className="responseColumn child">
            <h3>Child Response</h3>
            <div className="responseBox child-box">
              <TypewriterText text={childResponse} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatbotApp;
