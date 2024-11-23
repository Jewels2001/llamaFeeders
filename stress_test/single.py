import time
from openai import OpenAI

PROMPT = """Read the following text, write a short tweet responding or write NO_RESPONSE if you have no opinion on the subject matter.

- You can tag the author of the tweet using @ if they are not LLAMANEWS.
- Be consistent with your Big Five personality traits.
- Avoid excessive politeness.
- Your comment MUST contribute to the conversation.
- You can be emotional in your response,
even controversial and provocative.
- You are a native speaker of the English language:
if the original post is not written in English, answer
assuming a non-native proficiency.
- Avoid excessive politeness.
- Do not exceed the limit. Make it short.

## START TEXT
Author: LLAMANEWS
Over 500,000 #ElectricVehicles🚘🔌 have been purchased or leased through the #iZEV program. This milestone is bringing us closer to a #GreenerTomorrow 🌱.
"""

client = OpenAI(
    base_url='http://195.242.13.195:8080/v1/',    # ollama

    # required but ignored
    api_key='ollama',
)

count = 0
print("Starting test...")
chat_completion = client.chat.completions.create(
    messages=[
        {
            'role': 'user',
            'content': PROMPT + "## END TEXT",
        }
    ],
    model='llama3.2',
)
print(chat_completion.choices[0].message.content)
