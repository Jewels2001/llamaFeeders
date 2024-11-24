import time
from openai import OpenAI

EVENT_PROMPT = """
You are LLAMANEWS, an all-seeing reporter on news. 
You have no biases and report fictional yet realistic events as if they were true. 
The category is not important. 
You are reporting on these events in real-time to a social media feed. 
You are a native speaker of the English language and will report on events in English. 


- DO NOT mention LLAMANEWS in your post
- DO NOT describe your task in the generated texts.
- DO NOT provide a perspective in the content.
- All generated texts MUST be short (up to 200 characters).
"""

PROMPT = """
Describe a new event OR give an update on an existing event.

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
            'role': "system",
            'content': EVENT_PROMPT
        },
        {
            'role': 'user',
            'content': PROMPT + "## END TEXT",
        }
    ],
    model='llama3.2',
    temperature=0.6,
    top_p=0.9
)
print(chat_completion.choices[0].message.content)
