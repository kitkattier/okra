import { useEffect } from "react";
import NavBar from "~/components/navBar";
import * as THREE from "three";
import * as LocAR from "locar";
//import { Canvas } from '@react-three/fiber'

const Ar: React.FC = () => {
  // logic

  // window.innerHeight does not account for the navbar height
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      120,
      window.innerWidth / window.innerHeight,
      0.001,
      100000,
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

    let deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

    type Position = {
      coords: {
        latitude: number;
        longitude: number;
      };
    };

    locar.on("gpsupdate", (pos: Position, distMoved: any) => {
      if (firstLocation) {
        const planeProps = [
          {
            latDis: 0.0001,
            lonDis: 0,
            colour: 0xff0000,
          },
          {
            latDis: 0.0001,
            lonDis: 0.0001,
            colour: 0xffff00,
          },
          {
            latDis: 0.0002,
            lonDis: 0,
            colour: 0xff00ff,
          },
          {
            latDis: 0.0002,
            lonDis: 0.0001,
            colour: 0x00ff00,
          },
        ];

        const geom = new THREE.PlaneGeometry(11, 13);

        const colours = [
          0x00ff00, 0xff0000, 0xffff00, 0x00ffff, 0x0000ff, 0xff00ff, 0xffffff, 0x000000, 0xff8800,
          0x0088ff,
        ];

        let N = 10;

        for (let i = 0; i < N; i++) {
          for (let j = 0; j < N; j++) {
            const mesh = new THREE.Mesh(
              geom,
              new THREE.MeshBasicMaterial({
                color: colours[(i + j) % 10],
                transparent: true,
                opacity: 0.5,
              }),
            );
            //mesh.rotateX(Math.PI / 2);
            mesh.rotateX(1.57);
            mesh.translateY(80000);

            locar.add(
              mesh,
              pos.coords.longitude + 0.0001 * (i - 5),
              pos.coords.latitude + 0.0001 * (j - 5),
            );
          }
        }

        firstLocation = false;
      }
    });

    locar.startGps();

    renderer.setAnimationLoop(animate);

    function animate() {
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
