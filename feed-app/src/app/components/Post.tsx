import React from "react";

interface PostProps {
  name: string;
  age: number;
  occupation: string;
  interests: string[];
  text: string;
  comments: string[];
}

const Post: React.FC<PostProps> = ({ name, age, occupation, interests, text, comments }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-gray-500 text-sm">
        {age} years old, {occupation}
      </p>
      <p className="text-sm text-gray-700">Interests: {interests.join(", ")}</p>
      <p className="mt-4">{text}</p>
      <div className="mt-4">
        <h3 className="font-semibold">Comments:</h3>
        <ul className="list-disc list-inside text-gray-600">
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Post;