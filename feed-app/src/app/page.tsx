"use client";

import { useEffect, useState } from "react";
import Post from "@components/Post";
// import NPost from "@components/NPost"
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";

interface PostData {
  name: string;
  age: number;
  occupation: string;
  interests: string[];
  comments: string;
  personality: string[];
  education: string;
  profilePicture: string; 
}

interface NewsProps{
    name: string;
    news: string;
}

const images = [ 
 '/profiles/Anonymous-Profile-pic.jpg',
 '/profiles/Llama_1.webp',
 '/profiles/Llama_2.jpg',
 '/profiles/Llama_3.jpg',
]

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [updateInterval, setUpdateInterval] = useState<number>(4000);
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);

  // Mock function to generate random posts
  const generateRandomPost = (
    Username: string | string[] = ["Alice", "Bob", "Charlie", "Dana", "Eve"],
    occupations: string | string[] = ["Engineer", "Doctor", "Artist", "Teacher", "Designer"],
    interestsList:  string[] = ["Reading", "Traveling", "Gaming", "Cooking", "Sports"],
    comments: string = "Great post!",
    personality: string[] = ["oe: 0.6", "co: 0.8", "ex: 0.4", "ag: 0.7", "ne: 0.3"],
    education: string = 'Batchlor'
  ): PostData => {
    
    return {
      name: Username[Math.floor(Math.random() * Username.length)],
      age: Math.floor(Math.random() * 40) + 20,
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      interests: interestsList.sort(() => 0.5 - Math.random()).slice(0, 2),
      comments: comments,
      personality: personality,
      education: education,
      profilePicture: images[Math.floor(Math.random() * images.length)],
    };

  };

  const generateNews = (
    comments: string = "BREAKING NEWS! Ninja got a low taper fadeeee",
  ) => {
    return {
      name: 'LLAMANEWS',
      age: 100,
      occupation: 'News Reporter',
      interests: ['eating grass'],
      comments: comments,
      personality: ["oe: 0.6", "co: 0.8", "ex: 0.4", "ag: 0.7", "ne: 0.3"],
      education: 'LLama uni',
      profilePicture: '/profiles/llama_feeders.png',
    };

  };

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && prompt.trim() !== "") {
      setIsGenerating(true);
      setStart(true);
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
      let counter = 0;
  
      const interval = setInterval(() => {
        if (counter % 10 === 0) {
          // Call the alternate function every 10 seconds
          setPosts((prevPosts) => [generateNews(), ...prevPosts]);
        } else {
          // Default behavior
          setPosts((prevPosts) => [generateRandomPost(), ...prevPosts]);
        }
        counter += updateInterval / 1000; // Increment based on interval in seconds
      }, updateInterval);
  
      return () => clearInterval(interval);
    }
  }, [updateInterval, isGenerating]);
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="fixed top-0 left-10 flex justify-center items-center flex-col mt-4">
        {/* Logo */}
        <img
          src="/profiles/llama_feeders.png"
          alt="Llama Feeders Logo"
          className="w-32 h-auto mb-4"
        />
      </div>
      <h1 className="text-3xl font-bold text-center mb-6 text-black dark:text-black">
        Live LLAMA Feed
      </h1>
      <div className="fixed mx-auto bottom-0 left-0 right-0 bg-white dark:bg-gray-800 bg-opacity-100 p-4 shadow-lg z-50 rounded-lg w-full max-w-[60%] bottom-4 p-4">
        {/* Prompt input */}
        <div className="text-center mb-4">
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter an Event"
            className="border px-2 py-1 rounded text-gray-900 dark:text-white bg-white dark:bg-gray-800  w-[100%]"
          />
        </div>

        {/* Update interval input */}
        <div className="text-center mb-4 h-min">
          <label
            htmlFor="interval"
            className="font-medium mr-2 text-gray-700 dark:text-gray-300"
          >
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
          {isGenerating && start && (
            <button
              onClick={stopGenerating}
              className="ml-4 px-4 py-1 bg-red-500 text-white rounded"
            >
              {" "}
              <PauseCircleIcon />
            </button>
          )}
          {/* Show Start Generating Button when generating is active */}
          {!isGenerating && start && (
            <button
              onClick={startGenerating}
              className="ml-4 px-4 py-1 bg-green-500 text-white rounded"
            >
              {" "}
              <PlayCircleFilledWhiteIcon />
            </button>
          )}
          {/* Banner when generating is false */}
          {!isGenerating && start && (
            <div className="fixed mx-auto bottom-1000 left-0 right-0 flex py-2 justify-center items-center bg-green-500 text-white p-4 text-center rounded mb-4 max-w-[40%] w-full mx-auto mt-4 max-w-max">
              <p>Post generation stopped. Click the button to resume.</p>
            </div>
          )}
        </div>
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
