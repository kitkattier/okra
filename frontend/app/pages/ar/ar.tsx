import { useEffect } from "react";
import NavBar from "~/components/navBar";
import * as THREE from "three";
import * as LocAR from "locar";
import DeviceOrientationControls from "./meowl";
//import { Canvas } from '@react-three/fiber'

const Ar: React.FC = () => {
  // logic
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    );
    //const camera = <PerspectiveCamera makeDefault {...props} />

    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("glscene") as HTMLElement,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    //document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const locar = new LocAR.LocationBased(scene, camera);

    window.addEventListener("resize", (e) => {
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

    let deviceOrientationControls = new DeviceOrientationControls(camera);

    type Position = {
      coords: {
        latitude: number;
        longitude: number;
      };
    };

    locar.on("gpsupdate", (pos: Position, distMoved: any) => {
      if (firstLocation) {
        const boxProps = [
          {
            latDis: 0.0005,
            lonDis: 0,
            colour: 0xff0000,
          },
          {
            latDis: -0.0005,
            lonDis: 0,
            colour: 0xffff00,
          },
          {
            latDis: 0,
            lonDis: -0.0005,
            colour: 0x00ffff,
          },
          {
            latDis: 0,
            lonDis: 0.0005,
            colour: 0x00ff00,
          },
        ];

        const geom = new THREE.BoxGeometry(10, 10, 10);

        for (const boxProp of boxProps) {
          const mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: boxProp.colour }));

          console.log(
            `adding at ${pos.coords.longitude + boxProp.lonDis},${pos.coords.latitude + boxProp.latDis}`,
          );
          locar.add(
            mesh,
            pos.coords.longitude + boxProp.lonDis,
            pos.coords.latitude + boxProp.latDis,
          );
        }

        firstLocation = false;
      }
    });

    locar.startGps();

    renderer.setAnimationLoop(animate);

    function animate() {
      // @ts-ignore
      deviceOrientationControls?.update();
      renderer.render(scene, camera);
    }
  }, []);
  return (
    <div className="min-h-screen py-3">
      <canvas id="glscene"></canvas>
      <NavBar />
    </div>
  );
};

export default Ar;
