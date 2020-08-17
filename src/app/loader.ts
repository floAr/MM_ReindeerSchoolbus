import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three/src/animation/AnimationMixer';
import { Scene } from 'three';


export class loader {
  // Instantiate a loader
  readonly loader = new GLTFLoader()



  constructor() {

  }
  // // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  // var dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
  // loader.setDRACOLoader( dracoLoader );
  public load(path: string, scene: Scene) {

    this.loader.load(
      // resource URL
      'models/gltf/duck/duck.gltf',
      // called when the resource is loaded
      function (gltf) {

        scene.add(gltf.scene)
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
      },
      // called while loading is progressing
      function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      },
      // called when loading has errors
      function (error) {

        console.log('An error happened');

      }
    );
  }
}
