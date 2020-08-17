import { BoxGeometry, Color, Mesh, MeshBasicMaterial, SpotLight, MeshPhongMaterial, CameraHelper, MeshLambertMaterial, SpotLightHelper } from 'three';

export class Bus extends Mesh {


  constructor(sizeX: number, sizeY: number, sizeZ: number, color: Color) {
    super();
    this.geometry = new BoxGeometry(sizeX, sizeY, sizeZ);
    this.material = new MeshLambertMaterial({ color });
    this.castShadow = true;
    this.receiveShadow = true
    this.createHeadlights()
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
