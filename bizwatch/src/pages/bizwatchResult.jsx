import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../firebaseConfig"; // Adjust path as needed

const db = getFirestore(app);

const BizwatchResult = () => {
  const [redCount, setRedCount] = useState(0); // Count of "Red" votes
  const [greenCount, setGreenCount] = useState(0); // Count of "Green" votes
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const fetchVotes = async () => {
    try {
      const usersCollection = collection(db, "BidWarUsers");
      const querySnapshot = await getDocs(usersCollection);

      let redVotes = 0;
      let greenVotes = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.vote === "Red") {
          redVotes++;
        } else if (data.vote === "Green") {
          greenVotes++;
        }
      });

      setRedCount(redVotes);
      setGreenCount(greenVotes);
    } catch (error) {
      console.error("Error fetching votes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  if (isLoading) {
    return <p>Loading results...</p>;
  }

  return (
    <div className="flex bg-zinc-900 flex-col items-center justify-center min-h-screen">
      <div className={`p-8 bg-opacity-10 shadow-lg rounded-md text-center ring-[1px] ring-violet-500 ring-opacity-50`}>
        <h1 className="text-4xl font-bold mb-6 text-white">BidWars Result</h1>
        <div className="flex flex-col space-y-4">
          <div className="text-3xl text-red-500 font-semibold">
            Red Votes: {redCount}
          </div>
          <div className="text-3xl text-green-500 font-semibold">
            Green Votes: {greenCount}
          </div>
        </div>
        <div className="mt-6 text-lg text-white font-bold">
          {redCount > greenCount
            ? "Red is in Majority!"
            : greenCount > redCount
            ? "Green is in Majority!"
            : "It's a Tie!"}
        </div>
      </div>
    </div>
  );
};

export default BizwatchResult;