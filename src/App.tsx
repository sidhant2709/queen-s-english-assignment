import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Loader from "./components/Loader";

const url = "https://opentdb.com/api.php?amount=1";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [myAnswer, setMyAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("submitResponse");

  const getResponse = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      const { question, correct_answer } = data.results[0];
      setQuestion(question);
      localStorage.setItem("correct_answer", correct_answer);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getResponse();
  }, [getResponse]);

  const handleChange = (e: any) => {
    setMyAnswer(e.target.value);
  };

  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (myAnswer) {
      const ans = localStorage.getItem("correct_answer");
      localStorage.removeItem("correct_answer");
      if (ans?.toLowerCase() === myAnswer.toLowerCase()) {
        setMessage("Your answer is correct");
        setMessageClass("submitResponseValidationCorrect");
      } else {
        setMessage("Your answer is incorrect");
        setMessageClass("submitResponseValidationInCorrect");
      }
      setTimeout(() => {
        getResponse();
        setMessageClass("submitResponse");
      }, 1000);

      setMyAnswer('');
    }
    else{
      setMyAnswer('');
      alert("Please Type Your answer in Input Field");
    }
    
  };
  return (
    <>
      <h2 className="title">Queesn's English Assignment</h2>
      <div className="container">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h2>{question}</h2>
            <form>
              <input
                type="text"
                placeholder="Type your Answer"
                id="answer-input"
                onChange={handleChange}
              />
              <button onClick={handleClick}>Submit</button>
            </form>
            <h2 className={messageClass}>{message}</h2>
          </>
        )}
      </div>
    </>
  );
};

export default App;
