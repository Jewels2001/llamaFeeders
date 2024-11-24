"use client";

import { useEffect, useState, useRef } from "react";
import Post from "@components/Post";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import config from "../config.json";
import SentimentAnalysis from "./components/SentAnalysis";

interface serverR{
  events: getData[];
  posts: getData[];
}

interface getData {
  Author: string;
  Message: string;
}

interface PostData {
  Author: string;
  Message: string;
  //Id: string;
  profilePicture: string;
}

const fakeImages = [ 
 '/profiles/Anonymous-Profile-pic.jpg',
 '/profiles/Llama_1.webp',
 '/profiles/Llama_2.jpg',
 '/profiles/Llama_3.jpg',
]

const Home: React.FC = () => {
  const [posts, setPosts] = useState<getData[]>([]);
  const [allevents, setEvents] = useState<getData[]>([]);
  const [updateInterval, setUpdateInterval] = useState<number>(1000);
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const [sentiFlag, setSentiFlag] = useState<boolean>(false);
  const [currevent, setcurrevent] = useState<string>("No Events Yet");
  const queueRef = useRef<getData[]>([]);
  const isGeneratingRef = useRef(isGenerating); 
  const [postQueue, setPostQueue] = useState<getData[]>([]);

  const generateRandomPost = (
    Author: string | string[] = ["Alice", "Bob", "Charlie", "Dana", "Eve"],
    Message: string = "Great post!",
    id: string = '112'
  ): PostData => {
    
    return {
      Author: Author[Math.floor(Math.random() * Author.length)],
      Message: Message,
      profilePicture: fakeImages[Math.floor(Math.random() * fakeImages.length)],
    };

  };

  const generateNews = (
    messages: string = "BREAKING NEWS! Ninja got a low taper fadeeee",
  ) => {
    return {
      name: 'LLAMANEWS',
      age: 100,
      occupation: 'News Reporter',
      interests: ['eating grass'],
      messages: messages,
      personality: ["oe: 0.6", "co: 0.8", "ex: 0.4", "ag: 0.7", "ne: 0.3"],
      education: 'LLama uni',
      profilePicture: '/profiles/llama_feeders.png',
    };
  };

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const handleButtonPress = () => {
      setIsGenerating(true);
      setStart(true);
      createNewEvent();
  };

  const createNewEvent = async () => {
      console.log('Testing', JSON.stringify({ eventText: prompt }));
      const response = await fetch(config.createNewEventEndpoint, {
        method: 'POST', // Specify the request method
        headers: {
          'Content-Type': 'application/json', // Indicate we're sending JSON
        },
        body: JSON.stringify({ eventText: prompt }), // Convert JavaScript object to JSON string
      });

      
      if (response.ok) {
        console.log('Event created successfully');
      } else {
        console.error('Failed to create event');
      }

  };

  const getPfpPath = (author: string): string => {
    const authorToNum = (author.charCodeAt(0) % 100) + 1;
    return `image_${authorToNum}.jpg`;
  }


  const stopGenerating = () => {

    setIsGenerating(false);

    // when paused, upload all the backlog
    if( queueRef.current.length != 0){
      const newPosts = queueRef.current; 
      setPosts(prevPosts => [...newPosts,...prevPosts]);
    }

  };

  const startGenerating = () => {
    setIsGenerating(true);
  };

  const tasks = [
    "Export all Tweets",
    "Sentiment analysis",
  ];

  const handleClick = (type: string) =>{
    if (type === 'Export all Tweets') {
      console.log(type);
    }
    if (type === "Sentiment analysis") {
      console.log(type);
      setSentiFlag(oldflag => !oldflag);
    }
  };

  useEffect(() => {
    // Update ref whenever isGenerating changes
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);
  // Add a new post every interval once generating starts
  useEffect(() => {
    if (isGenerating) {
      let counter = 0;
  
      const interval = setInterval(async () => {

        try {
          const response = await fetch(config.getEventsEndpoint);
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
        
          const data : serverR = await response.json();
          const events : getData[] = data.events
          const newposts : getData[] = data.posts
          console.log(data); 

          // setPosts(posts => [...events, ...newposts, ...posts]);
          setPostQueue((prevQueue) => [...prevQueue, ...newposts]);
          queueRef.current = [...queueRef.current, ...newposts];

          // update the events to this
          setEvents(pastevents => [...events, ...pastevents])

          // send in post every 1 s 
          const processQueueInterval = setInterval(() => {
            if (queueRef.current.length > 0) {
              const nextPost = queueRef.current.shift(); // Remove the first post from the queue
              if (nextPost && isGeneratingRef.current) {
                setPosts((prevPosts) => [nextPost, ...prevPosts]); // Add it to the feed
              }
            }
          }, 350); // 1 second between each post

          setcurrevent(currevent => events[0].Message)
          
        } catch (error) {
          console.error('Fetch error:', error); 
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
      <h1 className="text-3xl font-bold text-center mb-6 text-black dark:text-black ml-[200px]">
        Live LLAMA Feed
      </h1>
      <div className="fixed mx-auto bottom-0 left-0 right-0 bg-white dark:bg-gray-800 bg-opacity-100 p-4 shadow-lg z-50 rounded-lg w-full max-w-[60%] bottom-4 p-4">
        {/* Prompt input */}
        <div className="text-center mb-4">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            placeholder="Enter an Event"
            className="border px-2 py-1 rounded text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-full resize-none overflow-auto min-h-[50px] max-h-[300px]
                       shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            
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
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ml-3" onClick={handleButtonPress}>
            Update
          </button>

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
      {/* main post stuff */}
        <div className="flex flex-wrap justify-end space-x-5">
          {/* Posts Feed */}
          <div className="w-full md:w-2/4 space-y-4">
            <h2 className="text-xl font-bold mb-4 text-center">Posts Feed</h2>
            {posts.map((post, index) => (
                <Post key={`post-${index}`} {...{ author: post.Author, commentContent: post.Message, profilePicture: getPfpPath(post.Author) }}/>
            ))}
          </div>

          {/* Events Feed */}
          <div className="w-full md:w-1/3 space-y-4">
            <h2 className="text-xl font-bold mb-4 text-center">Events Feed</h2>
            {allevents.map((event, index) => (
                <Post key={`event-${index}`} {...{ author: event.Author, commentContent: event.Message, profilePicture: getPfpPath(event.Author) }}/>
              ))}
          </div>
        </div>
      {/* <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Posts Feed</h2>
        {posts.map((post, index) => (
          <Post key={index} {...{author : post.Author, commentContent: post.Message, profilePicture: getPfpPath(post.Author)}} />
        ))}
        <h2 className="text-xl font-bold mb-4">Events Feed</h2>
        {allevents.map((event, index) => (
          <Post key={`event-${index}`} {...{author: event.Author, commentContent: event.Message, profilePicture: getPfpPath(event.Author)}} />
        ))}
      </div> */}
       {/* Task bar at the side post stuff */}
      <div className="fixed top-40 left-5 transform -translate-x-0 bg-gray-800 text-white rounded-lg shadow-lg p-1 w-64 ">
        <h2 className="text-lg font-bold mb-2">Task List</h2>
        <ul className="list-disc space-y-2">
          {tasks.map((task, index) => (
            <button
            key={index}
            onClick={() => handleClick(task)}
            className="w-full text-left bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {task}
            </button>
          ))}
        </ul>
        {sentiFlag && <SentimentAnalysis messages={posts.map((post) => post.Message)} />}
      </div>
    </div>
  );
};
export default Home;
