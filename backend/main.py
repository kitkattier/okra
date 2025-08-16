from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import os
import uvicorn
import ssl

app = FastAPI()

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain('./cert.pem', keyfile='./key.pem')

origins = [
    "http://localhost.tiangolo.com", "https://localhost.tiangolo.com",
    "http://localhost", "http://localhost:8080", "https://localhost:5173", "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PixelChange(BaseModel):
    pixel: tuple[int, int]
    tile: tuple[int, int]
    color: tuple[int, int, int]


@app.post("/pixel-change")
def pixel_change(pixel: PixelChange):
    print(pixel)
    x, y = pixel.tile
    try:
        im = Image.open(f"static/tiles/{x}/{y}.png")
    except FileNotFoundError:
        im = Image.new("RGBA", (1000, 1000), (0, 0, 0, 0))
    for i in range(100):
        for j in range(100):
            im.putpixel((i, j), (0, 0, 0, 255))
    im.putpixel(pixel.pixel, pixel.color)
    if not os.path.exists(f"static/tiles/{x}"):
        os.makedirs(f"static/tiles/{x}")
    im.save(f"static/tiles/{x}/{y}.png")


app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    uvicorn.run("main:app", host="10.89.70.23", port=8000, ssl_keyfile="./key.pem", ssl_certfile="./cert.pem")
