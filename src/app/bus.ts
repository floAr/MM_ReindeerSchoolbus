import { BoxGeometry, Color, Mesh, MeshBasicMaterial, SpotLight, MeshPhongMaterial, CameraHelper, MeshLambertMaterial, SpotLightHelper, Group, Vector3 } from 'three';
import loader from './loader';
import { PhysicalMesh } from './physicalMesh';

export class Bus extends PhysicalMesh {

  public segmentLength: number = 5

  private gtlfCentralPart: Group = new Group()
  private gtlfBackPart: Group = new Group()
  private updatePhysics: () => void

  constructor(updatePhysics: () => void) {
    super();
    this.updatePhysics = updatePhysics

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

    this.updatePhysics()
  }
}
