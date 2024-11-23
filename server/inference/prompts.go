package inference

const PROMPT_AGENT_CREATION = `Create properties of ONE person using the big 5 personality traits, an age, and occupation, an education, provide a list of 7 interests. Based on their personality give them a likelihood to respond to any given post. Also provide a probability range that this person will respond to a post related to their interests. Ensure that the probability range for topics of interest are higher than the standard probability.

DO NOT respond with any text other than the person requested.
DO NOT create more than 1 person.

Respond in JSON of the form:
{
"username": Username,
"personality": {"oe": OeScore, "co": CoScore, "ex": ExScore, "ag": AgScore, "ne": NeScore},
"age": Age,
"politicalLeaning": PoliticalLeaning,
"occupation": Occupation,
"education": Education,
"interests": InterestsList,
"likelihood_gen": LikelihoodGeneral,
"likelihood_bot": LikelihoodBottom, 
"likelihood_top": LikelihoodTop
}`
