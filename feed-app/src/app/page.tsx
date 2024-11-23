
"use client";

import { useEffect, useState } from "react";
import Post from '@components/Post';

interface PostData {
  name: string;
  age: number;
  occupation: string;
  interests: string[];
  text: string;
  comments: string[];
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [updateInterval, setUpdateInterval] = useState<number>(4000);
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Mock function to generate random posts
  const generateRandomPost = (): PostData => {
    const names = ["Alice", "Bob", "Charlie", "Dana", "Eve"];
    const occupations = ["Engineer", "Doctor", "Artist", "Teacher", "Designer"];
    const interestsList = ["Reading", "Traveling", "Gaming", "Cooking", "Sports"];

    return {
      name: names[Math.floor(Math.random() * names.length)],
      age: Math.floor(Math.random() * 40) + 20,
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      interests: interestsList.sort(() => 0.5 - Math.random()).slice(0, 2),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      comments: ["Great post!", "Thanks for sharing!", "Interesting thoughts."],
    };
  };

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && prompt.trim() !== "") {
      setIsGenerating(true);
      setPosts([generateRandomPost()]); // Start with a new post
    }
  };

  const stopGenerating = () => {
    setIsGenerating(false);
  };
  const startGenerating = () => {
    setIsGenerating(true);
  };
  
  // Add a new post every interval once generating starts
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setPosts((prevPosts) => [generateRandomPost(), ...prevPosts]);
      }, updateInterval);

      return () => clearInterval(interval);
    }
  }, [updateInterval, isGenerating]);

  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-black dark:text-black">Live Social Media Feed</h1>
      
      {/* Prompt input */}
      <div className="text-center mb-4">
        <label htmlFor="prompt" className="font-medium mr-2 text-gray-700 dark:text-gray-300">
          Enter Prompt:
        </label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border px-2 py-1 rounded text-gray-900 dark:text-white bg-white dark:bg-gray-800"
        />
      </div>
      {/* Banner when generating is false */}
      {!isGenerating && (
        <div className="bg-yellow-500 text-white p-4 text-center rounded mb-4">
          <p>Post generation is stopped. Click "Start Generating" to resume.</p>
        </div>
      )}

      {/* Update interval input */}
      <div className="text-center mb-4">
        <label htmlFor="interval" className="font-medium mr-2 text-gray-700 dark:text-gray-300">
          Update Interval (ms):
        </label>
        
        <input
          type="number"
          id="interval"
          value={updateInterval}
          onChange={(e) => setUpdateInterval(Number(e.target.value))}
          className="border px-2 py-1 rounded text-gray-900 dark:text-white bg-white dark:bg-gray-800"
        />
        {/* Show Stop Generating Button when generating is active */}
        {isGenerating && (
          <button
            onClick={stopGenerating}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
          > Stop Generating
          </button>
        )}
        {/* Show Start Generating Button when generating is active */}
        {!isGenerating && (
          <button
            onClick={startGenerating}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
          > Start Generating
          </button>
        )}
      </div>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>
    </div>
  );

};


export default Home;
