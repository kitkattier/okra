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
      const geom = new THREE.PlaneGeometry(11, 12.5);
      const colours = [
        0x00ff00, 0xff0000, 0xffff00, 0x00ffff, 0x0000ff, 0xff00ff, 0xffffff, 0x000000, 0xff8800,
        0x0088ff,
      ];

      let N = 20;
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const mesh = new THREE.Mesh(
            geom,
            new THREE.MeshBasicMaterial({
              color: colours[(i + j) % 10],
              transparent: true,
              opacity: 1.0 - (Math.abs(i - 10) + Math.abs(j - 10)) * 0.05,
            }),
          );
          mesh.rotateX(1.57);
          mesh.translateY(200000);
          locar.add(
            mesh,
            position.coords.longitude + 0.0001 * (i - 10),
            position.coords.latitude + 0.0001 * (j - 10),
          );
        }
      }
    };

    locar.on("gpsupdate", (pos: Position, distMoved: any) => {
      if (firstLocation) {
        createImagePlane(pos);
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
