import { useEffect, useState } from "react";
import NavBar from "~/components/navBar";
import * as THREE from "three";
import * as LocAR from "locar";
import DeviceOrientationControls from "./meowl";
import { latLonToTilePixel } from "~/utils";
import { TILE_PATH } from "~/api";

const Ar: React.FC = () => {
  const [log, setLog] = useState("loading");

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      120,
      window.innerWidth / window.innerHeight,
      0.001,
      100000,
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("glscene") as HTMLElement,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const locar = new LocAR.LocationBased(scene, camera);

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    const cam = new LocAR.Webcam(
      {
        idealWidth: 1024,
        idealHeight: 768,
        onVideoStarted: (texture: any) => {
          scene.background = texture;
        },
      },
      null,
    );

    let firstLocation = true;
    let deviceOrientationControls: any = null;

    type Position = {
      coords: {
        latitude: number;
        longitude: number;
      };
    };

    // Function to create image-based AR object
    const createImagePlane = (position: Position) => {
      const { tile } = latLonToTilePixel(position.coords.latitude, position.coords.longitude);
      const imagePath = TILE_PATH.replace("{x}", tile[0].toString()).replace(
        "{y}",
        tile[1].toString(),
      );

      // Load texture from image path
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        imagePath,
        (texture) => {
          // Get image dimensions to maintain aspect ratio
          const image = texture.image;
          const aspectRatio = image.width / image.height;

          // Create geometry based on aspect ratio
          const width = 50000; // Base width
          const height = width / aspectRatio;
          const geom = new THREE.PlaneGeometry(width, height);

          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1,
          });

          const mesh = new THREE.Mesh(geom, material);
          mesh.rotateX(1.57); // Rotate to lay flat
          mesh.translateY(1500000); // Elevate

          // Add to AR scene at GPS location
          locar.add(mesh, position.coords.longitude, position.coords.latitude);
          setLog("");
        },
        undefined,
        (error) => {
          console.error(error);
          setLog("");
        },
      );
    };

    // Original pixel grid function as fallback
    const createPixelGrid = (position: Position) => {
      const { tile, pixel } = latLonToTilePixel(
        position.coords.latitude,
        position.coords.longitude,
      );
      //console.log(pixel);
      //setLog(pixel[1].toString());
      const imagePath = TILE_PATH.replace("{x}", tile[0].toString()).replace(
        "{y}",
        tile[1].toString(),
      );

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get 2D rendering context");
      }
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Important for images loaded from different origins
      img.src = imagePath; // Replace with your image path
      //img.src = "~/meowl.png";
      //setLog(img.src);

      //let thisPixel: any = 0;

      let pixelData: Uint8ClampedArray = new Uint8ClampedArray();
      let imageData: ImageData;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        pixelData = imageData.data; // This is the raw pixel array
        // Each pixel is represented by 4 consecutive values: Red, Green, Blue, Alpha (RGBA)
        // Values range from 0 to 255
        const geom = new THREE.PlaneGeometry(11, 12.5);

        // for (let i = -N; i <= N; i++) {
        // for (let j = -(10 - Math.abs(i)); j <= 10 - Math.abs(i); j++) {

        let N = 50;
        for (let i = -N; i <= N; i++) {
          for (let j = -N; j <= N; j++) {
            const x = pixel[0] + i;
            const y = pixel[1] - j;
            //const index = (y * imageData.width + x) * 4;
            const index = (y * 1000 + x) * 4;
            const red = pixelData[index];
            //const red = 255;
            const green = pixelData[index + 1];
            const blue = pixelData[index + 2];
            const alpha = pixelData[index + 3];

            if (alpha == 0) {
              continue;
            }

            const color = new THREE.Color().setRGB(red / 255, green / 255, blue / 255);

            const mesh = new THREE.Mesh(
              geom,
              new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 1.0 - Math.sqrt(i * i + j * j) * 0.02,
              }),
            );
            mesh.rotateX(1.57);
            mesh.translateY(200000);
            locar.add(
              mesh,
              position.coords.longitude + 0.0001 * i,
              position.coords.latitude + 0.0001 * j,
            );
          }
        }
        setLog("");
      };

      //pixelData = new Uint8ClampedArray(arr);

      //thisPixel = pixelData[pixel[0]][pixel[1]];
    };

    locar.on("gpsupdate", (pos: Position, distMoved: any) => {
      if (firstLocation) {
        //createImagePlane(pos);
        createPixelGrid(pos);
        firstLocation = false;
      }
    });

    locar.startGps();

    // Permission request for iOS 13+ and some Android browsers
    function requestOrientationPermission() {
      // @ts-ignore
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        // iOS 13+
        DeviceOrientationEvent.requestPermission()
          .then((response: string) => {
            if (response === "granted") {
              deviceOrientationControls = new DeviceOrientationControls(camera);
              renderer.setAnimationLoop(animate);
            }
          })
          .catch(console.error);
      } else {
        // Non-iOS
        deviceOrientationControls = new DeviceOrientationControls(camera);
        renderer.setAnimationLoop(animate);
      }
    }

    // Add a button to request permission if needed
    const permissionButton = document.createElement("button");
    permissionButton.innerText = "Enable AR Sensors";
    permissionButton.style.position = "absolute";
    permissionButton.style.top = "10px";
    permissionButton.style.left = "10px";
    permissionButton.style.zIndex = "1000";
    document.body.appendChild(permissionButton);

    permissionButton.onclick = () => {
      requestOrientationPermission();
      permissionButton.remove();
    };

    function animate() {
      deviceOrientationControls?.update();
      renderer.render(scene, camera);
    }
  }, []);

  return (
    <div className="min-h-screen py-3">
      <canvas id="glscene"></canvas>
      <NavBar />
      <div className="absolute top-1 right-1 overflow-hidden">{log}</div>
    </div>
  );
};

export default Ar;
