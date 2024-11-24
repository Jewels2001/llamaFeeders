import React, { useState } from "react";

interface PostProps {
  name: string;
  age: number;
  occupation: string;
  interests: string[];
  comments: string;
  personality: Personality;
  education: string;
  profilePicture: string;
  id: string;
}

interface Personality{
    oe: number ,
    co: number ,
    ex: number ,
    ag: number ,
    ne: number 
}

const Post: React.FC<PostProps> = ({ name, age, occupation, interests, comments, personality, education, profilePicture, id}) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className="flex justify-center items-center">
            <div className={`border p-4 rounded-lg shadow-md ${name == "LLAMANEWS" ? "bg-blue-300" : "bg-white"} max-w-[50%] w-full`}>
                {/* Profile Picture and Name Container */}
                <div className="flex items-center">
                    {/* Profile Picture */}
                <img
                src={profilePicture}
                alt={`${name}'s profile`}
                className="w-16 h-16 rounded-full object-cover"
                />
                {/* Name with hover effect */}
                <div className="inline-block pl-4">
                    <h2
                    className="text-xl font-bold relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    >
                    {name}
                    {/* Tooltip */}
                    {isHovered && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 text-white text-sm p-2 rounded shadow-md z-10">
                        <p>
                            <strong>Age:</strong> {age}
                        </p>
                        <p>
                            <strong>Education</strong> {education}
                        </p>
                        <p>
                            <strong>Occupation:</strong> {occupation}
                        </p>
                        <p>
                            <strong>Interests:</strong> {interests.join(", ")}
                        </p>
                        <p>
                            <strong>Personality</strong> 
                            <p>Openness {personality.oe}</p>
                            <p>Conscientiousness{personality.co}</p>
                            <p>Extraversion{personality.ex}</p>
                            <p>Agreeableness{personality.ag}</p>
                            <p>Neuroticism{personality.ne}</p>
                        </p>
                        </div>
                    )}

                    </h2>
                    </div>
                </div>
                <h3 className="font-semibold">Comments:</h3>
                <ul className="list-disc list-inside text-gray-600">
                    
                    <li>{comments}</li>
                </ul>
                
            </div>
        </div>

    );
  
};

export default Post;