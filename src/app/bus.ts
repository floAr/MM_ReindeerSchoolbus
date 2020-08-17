import { BoxGeometry, Color, Mesh, MeshBasicMaterial, SpotLight, MeshPhongMaterial, CameraHelper } from 'three';

export class Bus extends Mesh {


  constructor(sizeX: number, sizeY: number, sizeZ: number, color: Color) {
    super();
    this.geometry = new BoxGeometry(sizeX, sizeY, sizeZ);
    this.material = new MeshPhongMaterial({ color });
    this.castShadow = true;
    this.receiveShadow = true
    this.createHeadlights()
  }

  createHeadlights() {
    // white spotlight shining from the side, casting a shadow

    var spotLight = new SpotLight(0xffffff);
    spotLight.position.set(10, 10, 10);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    var helper = new CameraHelper(spotLight.shadow.camera);
    this.add(spotLight);
    this.add(helper);
  }
}
