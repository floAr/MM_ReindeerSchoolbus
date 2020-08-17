import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three/src/animation/AnimationMixer';
import { Scene, Group, Mesh, MeshToonMaterial, Material, Color, MeshStandardMaterial, NearestFilter, TextureLoader, Texture, MeshLambertMaterial } from 'three';



export class loaderClass {
  // Instantiate a loader
  readonly loader = new GLTFLoader()

   public readonly gradientMaps: { none: null; threeTone: Texture; fiveTone: Texture; } ;


  constructor() {

      var  textureLoader = new TextureLoader();
      var threeTone = textureLoader.load( 'content/threeTone.jpg' );
      threeTone.minFilter = NearestFilter;
      threeTone.magFilter = NearestFilter;

      var fiveTone = textureLoader.load( 'content/fiveTone.jpg' );
      fiveTone.minFilter = NearestFilter;
      fiveTone.magFilter = NearestFilter;

      this.gradientMaps= {
        none: null,
        threeTone: threeTone,
        fiveTone: fiveTone
      };



  }
  // // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  // var dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
  // loader.setDRACOLoader( dracoLoader );
  public load(path: string, onLoadedCB: (loaded: Group) => void) {

    this.loader.load(
      // resource URL
      path,
      // called when the resource is loaded
      function (gltf) {

        gltf.scene.traverse(function (child) {
          if (child instanceof Mesh) {
          //    let mesh = (child as Mesh)
          //   //  mesh.castShadow=true
          //   //  mesh.receiveShadow=true
          //    let mat = mesh.material as MeshStandardMaterial
          //   let toonMat = new MeshLambertMaterial();

          //   toonMat.color.set((mat as MeshStandardMaterial).color);
          // //  toonMat.gradientMap = loader.gradientMaps.fiveTone;
          //  // mesh.material = toonMat;
          }
        })

        onLoadedCB(gltf.scene)
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

        console.log('An error happened: '+error);

      }
    );
  }
}

const loader = new loaderClass();

export default loader
