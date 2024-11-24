import React from "react";
import Sentiment from "sentiment";

interface MsgDetails {
  messages: string[];
}

interface sentiment{
    score: number;
    comparative: number
}




const SentimentAnalysis: React.FC<MsgDetails> = ({ messages }) => {
  const extractHashtags = (messages: string[]): string[] => {
    const hashtags = messages.flatMap((message) => {
      const matches = message.match(/#[\w]+/g);
      return matches || []; // Return matches or an empty array if none
    });

    return Array.from(new Set(hashtags));
  };

  // Get the unique hashtags
  const hashtags = extractHashtags(messages);

  const sentiment = (messages: string[]) => {

    const hashtagToSentiment :Record<string, sentiment[]> = {};
    const sentiment = new Sentiment();

    messages.map((message) => {

        const result = sentiment.analyze(message);

        hashtags.map((hashtag) => {
            if (hashtagToSentiment[hashtag]) {
                hashtagToSentiment[hashtag].push(result);
            } 
            else {
                hashtagToSentiment[hashtag] = [result];
            }});
    });

    return hashtagToSentiment;

  }


  const avgSentiment = (sentiments: sentiment[]) => {
    const total = sentiments.reduce((acc, sentiment) => acc + sentiment.score, 0);
    return total / sentiments.length
  }

  const avgComparative = (sentiments: sentiment[]) => {
    const total = sentiments.reduce((acc, sentiment) => acc + sentiment.comparative, 0);
    return total / sentiments.length
  }

  return (
    <div className="bg-blue-400 w-min h-min">
        <ul>
        {Object.entries(sentiment(messages)).map(([key, value]) => (
          <li key={key}>
            <div>
                <p>average sentiment per msg: {avgSentiment(value)}</p>
            </div>
            <div>
                <p>average comparative per msg: {avgComparative(value)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SentimentAnalysis;
