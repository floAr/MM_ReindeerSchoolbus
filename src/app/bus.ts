import { BoxGeometry, Color, Mesh, MeshBasicMaterial, SpotLight, MeshPhongMaterial, CameraHelper, MeshLambertMaterial, SpotLightHelper, Group } from 'three';
import loader from './loader';

export class Bus extends Mesh {

  private gtlfNode: Group = new Group()

  constructor(sizeX: number, sizeY: number, sizeZ: number, color: Color) {
    super();

    this.castShadow = true;
    this.receiveShadow = true
    loader.load('content/schoolbus.glb', (gtlfLoaded => {
      this.add(gtlfLoaded)
      this.gtlfNode = gtlfLoaded
      // this.gtlfNode.position.set(0,0,0)
      this.gtlfNode.scale.set(5, 5, 5)
      this.gtlfNode.rotateY(-1.570796)

    }))
  }

  createHeadlights() {
    // white spotlight shining from the side, casting a shadow

    var spotLight = new SpotLight('#FFD800');
    var spotLightHelper = new SpotLightHelper(spotLight);
    spotLight.add(spotLightHelper)
    spotLight.matrixAutoUpdate = false

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    this.add(spotLight);
  }
}
