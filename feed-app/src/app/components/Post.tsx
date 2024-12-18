import React, { useState } from "react";

interface PostProps {
  author: string;
  commentContent: string;
  profilePicture: string;
}

import config from "../../config.json";
interface userInfo{
    Author: string;
    Age: number;
    Occupation: string;
    Interests: string[];
    Personality: Personality;
    Education: string;
    ProfilePicture: string;
}

interface Personality{
    oe: number ,
    co: number ,
    ex: number ,
    ag: number ,
    ne: number 
}



const Post: React.FC<PostProps> = ({ author, commentContent, profilePicture}) => {
    // const imagePaths = Array.from({ length: 100 }, (_, i) => `/images/image_${i + 1}.jpg`);

    const [isHovered, setIsHovered] = useState(false);
    const [userData, setUserData] = useState<userInfo | null>(null);
    const getUserData = async (Author: string)=> {
        const response = await fetch(`${config.getUserDataEndpoint}?Author=${Author}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
      
        const data: userInfo = await response.json();
        setUserData(data);
        return true
      }
    
    return (
        <div className="flex justify-center items-center">
            <div className={`border p-4 rounded-lg shadow-md ${author == "LLAMANEWS" ? "bg-blue-300" : "bg-white"} max-w-[90%] w-full`}>
                {/* Profile Picture and Name Container */}
                <div className="flex items-center">
                {/* Profile Picture */}
                
                 <img
                src={`imgs/picsum_images/${profilePicture}`}
                alt={`${author}'s profile located at imgs/picsum_images/${profilePicture}`}
                className="w-16 h-16 rounded-full object-cover"
                />
                {/* Name with hover effect */}
                <div className="inline-block pl-4">
                    <h2
                    className="text-xl font-bold relative"
                    onMouseEnter={() => {setIsHovered(true); getUserData(author)}}
                    onMouseLeave={() => setIsHovered(false)}
                    >
                    {author}
                    {/* Tooltip */}
                    {isHovered && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 text-white text-sm p-2 rounded shadow-md z-10">
                        <p>
                            <strong>Age:</strong> {userData?.Age ?? "N/A"}
                        </p>
                        <p>
                            <strong>Education</strong> {userData?.Education?? "N/A"}
                        </p>
                        <p>
                            <strong>Occupation:</strong> {userData?.Occupation?? "N/A"}
                        </p>
                        <p>
                            <strong>Interests:</strong> {(userData?.Interests?? []).join(", ")}
                        </p>
                        {/* <div> 
                            <strong>Personality</strong> 
                            <p>Openness {userData?.Personality.oe?? "N/A"}</p>
                            <p>Conscientiousness{userData?.Personality.co?? "N/A"}</p>
                            <p>Extraversion{userData?.Personality.ex?? "N/A"}</p>
                            <p>Agreeableness{userData?.Personality.ag?? "N/A"}</p>
                            <p>Neuroticism{userData?.Personality.ne?? "N/A"}</p>
                        </div> */}
                        </div>
                    )}

                    </h2>
                    </div>
                </div>
                <h3 className="font-semibold">Comments:</h3>
                <ul className="list-disc list-inside text-gray-600">
                    
                    <li>{commentContent}</li>
                </ul>
                
            </div>
        </div>

    );
  
};

export default Post;