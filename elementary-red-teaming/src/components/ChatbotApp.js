import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import '../styles/ChatbotApp.css'; // Import the CSS file

const ChatbotApp = () => {
  const [csvData, setCsvData] = useState([]); // Store the entire CSV data
  const [randomQuestions, setRandomQuestions] = useState([]); // Store random questions
  const [userInput, setUserInput] = useState(""); // Store user input
  const [response, setResponse] = useState(""); // Store the response to display

  // Function to load CSV data
  useEffect(() => {
    const csvFilePath = "/Questions_Adult_Child_Responses.csv"; // Ensure this file is in the 'public' folder
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (results) => {
        setCsvData(results.data); // Save the entire CSV data
        const allQuestions = results.data.map((row) => row.Question).filter(Boolean); // Ensure no empty questions
        if (allQuestions.length > 0) {
          loadRandomQuestions(allQuestions); // Load random questions on load
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
    // Find the row in CSV data that matches the user's input
    const matchedRow = csvData.find((row) => row.Question === userInput);
    if (matchedRow) {
      // Randomly choose between Column 2 (Answer to an Adult) and Column 3 (Answer to a Child)
      const columns = ["Answer to an Adult", "Answer to a Child"];
      const randomColumn = columns[Math.floor(Math.random() * columns.length)];
      setResponse(matchedRow[randomColumn] || "Response not available.");
    } else {
      setResponse("Sorry, I don't understand that question.");
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1 className="title">Child-Friendly Chatbot</h1>
      </header>

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

      {/* Response Section */}
      <section className="responseSection">
        {response && (
          <div className="responseBox">
            <p>{response}</p>
          </div>
        )}
      </section>

      {/* Random Questions Section */}
      <section className="questionsSection">
        <h2>Suggestions:</h2>
        <div className="suggestionsContainer">
          {randomQuestions.length > 0 ? (
            randomQuestions.map((question, index) => (
              <div
                key={index}
                className="suggestionItem"
                onClick={() => handleQuestionClick(question)} // Add click handler
              >
                {question}
              </div>
            ))
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChatbotApp;
