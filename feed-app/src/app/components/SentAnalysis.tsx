// import React from "react";
// //import Sentiment from "sentiment";

// interface MsgDetails {
//   messages: string[];
// }

// interface sentiment{
//     score: number;
//     comparative: number
// }




// const SentimentAnalysis: React.FC<MsgDetails> = ({ messages }) => {
//     function extractUniqueHashtags(strings: string[]): string[] {
//         const hashtagPattern = /#\w+/g;  // Regex to match hashtags
//         const hashtags = new Set<string>();
    
//         strings.forEach(str => {
//             const matches = str.match(hashtagPattern);
//             if (matches) {
//                 matches.forEach(hashtag => hashtags.add(hashtag.toLowerCase()));  // Adds to set ensuring uniqueness and case-insensitivity
//             }
//         });
    
//         return Array.from(hashtags);  // Convert set to array and return
//     }



//   const sentiment = (messages: string[]) => {
//   // Get the unique hashtags
//     const hashtags = extractUniqueHashtags(messages);
//     const hashtagToSentiment :Record<string, sentiment[]> = {};
//     const sentiment = new Sentiment();
//     console.log(hashtags)
//     messages.map((message) => {
//         const result = sentiment.analyze(message);

//         hashtags.map((hashtag) => {
//             if (hashtagToSentiment[hashtag]) {
//                 hashtagToSentiment[hashtag].push(result);
//             } 
//             else {
//                 hashtagToSentiment[hashtag] = [result];
//             }});
//     });
//     console.log(hashtagToSentiment.value);
//     return hashtagToSentiment;

//   }


//   const avgSentiment = (sentiments: sentiment[]) => {
//     const total = sentiments.reduce((acc, sentiment) => acc + sentiment.score, 0);
//     return total / sentiments.length
//   }

//   const avgComparative = (sentiments: sentiment[]) => {
//     const total = sentiments.reduce((acc, sentiment) => acc + sentiment.comparative, 0);
//     return total / sentiments.length
//   }

//   return (
//     <div className=" w-max h-max">
//         <ul>
//         {Object.entries(sentiment(messages)).map(([key, value]) => (
//           <li key={key} className="mb-3">
//             <h2>{key}</h2>
//             <div>
//                 <p>average sentiment per msg: {avgSentiment(value)}</p>
//             </div>
//             <div>
//                 <p>average comparative per msg: {avgComparative(value)}</p>
//             </div>
            
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SentimentAnalysis;
