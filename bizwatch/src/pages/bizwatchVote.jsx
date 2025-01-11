import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { app } from "../firebaseConfig"; // Adjust path as needed

const db = getFirestore(app);
const auth = getAuth(app);

const BizWatchVote = () => {
  const [fingerprint, setFingerprint] = useState(null); //search for document
  const [username, setUsername] = useState("");
  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(true); //Load time for authentication
  const [hasSavedUsername, setHasSavedUsername] = useState(false);
  const [outerBgColor, setOuterBgColor] = useState(""); // State to manage outer div's background color
  const [innerCardBgColor, setInnerCardBgColor] = useState("bg-violet-700"); // State to manage inner card's background color
  const [message, setMessage] = useState(""); // Message state for alerts

  //Authenticate user
  const initializeUser = async () => {
    try {
      // Sign in anonymously
      const result = await signInAnonymously(auth);
      const uid = result.user.uid;

      // Generate a fingerprint for additional verification
      const fp = await FingerprintJS.load();
      const fingerprintResult = await fp.get();
      const fingerprint = fingerprintResult.visitorId;
      setFingerprint(fingerprint);

      // Reference Firestore document based on fingerprint
      const userRef = doc(db, "BidWarUsers", fingerprint);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create a new document if it doesn't exist
        await setDoc(userRef, { uid, username: "", vote: null });
      } else {
        const data = userDoc.data();
        if (data.username) {
            setUsername(data.username);
            setHasSavedUsername(true); // Set this to true if username exists
          }
        setVote(data.vote || null);
      }
    } catch (error) {
      console.error("Error during initialization:", error);
      setMessage("Error during initialization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  //Handles user name
  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
        setMessage("Username cannot be empty.");
      return;
    }
  
    try {
      const userRef = doc(db, "BidWarUsers", fingerprint);
  
      // Update the username in Firestore
      await updateDoc(userRef, { username });
      setHasSavedUsername(true); // Update state to show voting buttons
      setMessage("Username saved successfully!");
    } catch (error) {
      console.error("Error saving username:", error);
    }
  };



  //Handles Vote
  const handleVote = async (voteType) => {
    if (!fingerprint || !username.trim()) {
        setMessage("Please set a username before voting.");
      return;
    }

    if (vote) {
        setMessage("You have already voted!");
        return;
    }
    
    try {
      const userRef = doc(db, "BidWarUsers", fingerprint);

      // Update the vote in Firestore
      await updateDoc(userRef, { vote: voteType });

      setVote(voteType);
      setMessage(`Your ${voteType} vote has been recorded!`);
    } catch (error) {
      console.error("Error storing vote:", error);
    }
  };


  //runs until user is not initialised
  useEffect(() => {
    const init = async () => {
      await initializeUser();
    };
    init();
  }, []);


  //Color handle
  const handleColorChange = (color) => {
    if (color === "red") {
      setOuterBgColor("bg-red-300");  // Change outer div's background to red
      setInnerCardBgColor("bg-violet-700");  // Keep inner card's background violet
    } else if (color === "green") {
      setOuterBgColor("bg-green-400"); // Change outer div's background to green
      setInnerCardBgColor("bg-violet-700"); // Keep inner card's background violet
    }
  };

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="bg-black">
    <div className={`outer flex flex-col items-center justify-center min-h-screen w-screen ${outerBgColor}`}>
      {/* Inner Card */}
      <div
        className={`flex flex-col justify-center items-center w-full md:w-4/5 lg:w-2/5 rounded-md p-8 ${innerCardBgColor} bg-opacity-10 ring-[1px] ring-violet-500 ring-opacity-50`}
      >
        

        <h1 className="text-4xl font-bold mb-12 text-center sm:text-6xl text-white">BIZWATCH</h1>
        {!hasSavedUsername ? (
          <div className="flex flex-col w-full items-center space-y-6">
            <div className="text-4xl w-full font-semibold mb-6 text-gray-800">
              Set Username
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter your username"
            />
            <button
              onClick={handleUsernameSubmit}
              className="w-full h-12 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xl font-bold shadow-lg transform hover:scale-110 transition-all duration-300"
            >
              Save Username
            </button>
          </div>
        ) : (
          <div className="flex flex-col w-full items-center space-y-6">
            <div className="text-4xl w-full text-center font-semibold mb-6 text-white">
              Welcome, {username}!
            </div>
            <div className="grid grid-cols-2 gap-8 w-full">
              <button
                className="w-full h-20 bg-red-500 text-white rounded-md hover:bg-red-600 text-xl font-bold shadow-lg transform hover:scale-110 transition-all duration-300"
                onClick={() => {handleVote("Red"); handleColorChange("red");}}
              >
                Red
              </button>
              <button
                className="w-full h-20 bg-green-500 text-white rounded-md hover:bg-green-600 text-xl font-bold shadow-lg transform hover:scale-110 transition-all duration-300"
                onClick={() => {handleVote("Green"); handleColorChange("green");}}
              >
                Green
              </button>
            </div>
            {vote && (
              <p className="mt-4 text-lg text-white">
                Your vote: <span className="font-bold">{vote}</span>
              </p>
            )}
          </div>
        )}
        {/* Message Display */}
        {message && (
            <div className="fixed top-4 w-3/4 md:w-1/2 text-center bg-gray-800 text-white p-4 rounded-md shadow-lg">
            {message}
            </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default BizWatchVote;