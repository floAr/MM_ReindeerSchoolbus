import { BoxGeometry, Color, Mesh, MeshBasicMaterial, MeshPhongMaterial } from 'three';

export class Brick extends Mesh {


  constructor(sizeX: number,sizeY: number,sizeZ: number, color: Color) {
    super();
    this.geometry = new BoxGeometry(sizeX, sizeY, sizeZ);
    this.material = new MeshPhongMaterial({ color });
    this.receiveShadow=true;
  }
}
