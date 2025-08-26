import cv2
import os
from rembg import remove
from PIL import Image
import moviepy.video.io.ImageSequenceClip as ImageSequenceClip

def remove_bg_video(video_path):
    cap = cv2.VideoCapture(video_path)
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        img_no_bg = remove(img)
        frames.append(img_no_bg)
    cap.release()

    # Save output video
    clip = ImageSequenceClip.ImageSequenceClip([f for f in frames], fps=30)
    output_path = os.path.splitext(video_path)[0] + "_nobg.mp4"
    clip.write_videofile(output_path, codec='libx264')
    print(f"Saved: {output_path}")

remove_bg_video("C:\\Users\\admin\\OneDrive\\Desktop\\Girlsin.tech-2\\assets\\table.mp4")
