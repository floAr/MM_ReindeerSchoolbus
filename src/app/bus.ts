import { BoxGeometry, Color, Mesh, MeshBasicMaterial, SpotLight, MeshPhongMaterial, CameraHelper, MeshLambertMaterial, SpotLightHelper, Group } from 'three';
import loader from './loader';

export class Bus extends Mesh {

  public segmentLength: number = 4

  private gtlfCentralPart: Group = new Group()
  private gtlfBackPart: Group = new Group()

  constructor(sizeX: number, sizeY: number, sizeZ: number, color: Color) {
    super();


    loader.load('content/front.glb', (gtlfLoaded => {
      gtlfLoaded.rotateY(-1.570796)
      this.add(gtlfLoaded)

    }))
    loader.load('content/center.glb', (gtlfLoaded => {
      gtlfLoaded.rotateY(-1.570796)
      this.gtlfCentralPart = gtlfLoaded;
      loader.load('content/back.glb', (gtlfLoaded => {
        gtlfLoaded.rotateY(-1.570796)
        this.gtlfBackPart = gtlfLoaded;
        this.calcSegments()
      }))
    }))
  }

  public setSegmentCount() {
    // clean up old children
    this.children = this.children.slice(0, 1)
    this.gtlfBackPart.translateZ(-(this.segmentLength - 1))


    // change segment count
this.segmentLength+=1

    // rebuild bus
    this.calcSegments();
  }

  private calcSegments() {

    for (let parts = 0; parts < this.segmentLength; parts++) {
      var part = this.gtlfCentralPart.clone(true);
      part.translateZ(parts)
      this.add(part)
    }
    this.gtlfBackPart.translateZ(this.segmentLength - 1)
    this.add(this.gtlfBackPart)
  }
}
