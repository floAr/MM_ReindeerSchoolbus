import loader from './loader';
import { PhysicalMesh } from './physicalMesh';

export class Stage extends PhysicalMesh {
  constructor() {
    super();

    loader.load('content/slope.glb', (gtlfLoaded => {
      gtlfLoaded.rotateY(-1.570796)
      this.add(gtlfLoaded)
    }))
  }
}
