import os
import requests

download_folder = "feed-app\public\imgs\picsum_images"


# Create a directory to store the images
os.makedirs(download_folder, exist_ok=True)

# Download 100 images
for i in range(1, 101):
    url = f"https://picsum.photos/300/300?random={i}"
    response = requests.get(url)
    if response.status_code == 200:
        with open(f"{download_folder}/image_{i}.jpg", "wb") as f:
            f.write(response.content)
    print(f"Downloaded image {i}")

