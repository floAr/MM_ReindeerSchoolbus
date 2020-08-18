import { Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer, Clock, Mesh, CameraHelper, DirectionalLight, Euler, ReinhardToneMapping, Quaternion, BoxHelper, BoxGeometry } from 'three';
import { Brick } from './brick';
import { Bus } from './bus';
import * as C from 'cannon'
import { Stage } from './stage';
import { PhysicalMesh } from './physicalMesh';
import { CannonDebugRenderer } from './CannonDebugRenderer';

export class App {

  private canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
  private scene: Scene
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: this.canvas
  });
  private readonly time = new Clock(true);

  private camera! : PerspectiveCamera
  private readonly cameraOffset: Vector3 = new Vector3(0, 50, 100)
  private readonly lightOffset: Vector3 = new Vector3(10, 20, 20)

  private bus: Bus
  private light!: DirectionalLight
  private box: BoxHelper

  private world: C.World
  private busMat: C.Material
  private stageMat: C.Material
  cdr: CannonDebugRenderer;
  onDocumentKeyDown: (event: KeyboardEvent) => void;

  setCamera() {
    this.camera = new PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 10000);
    this.camera.position.set(this.cameraOffset.x, this.cameraOffset.y, this.cameraOffset.z);
    this.camera.lookAt(new Vector3(0, 0, 0));
  }

  setRenderer() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(112,112,112)'));
    this.renderer.shadowMap.enabled = true;


    this.renderer.toneMapping = ReinhardToneMapping
    this.renderer.toneMappingExposure = 1.0
  }

  addObjects() {
    this.busMat = new C.Material("busMat")
    this.stageMat = new C.Material("stageMat")

    // Bus
    this.bus = new Bus(this.addBusPhysics)

    // Slope
    // this.stage = new Stage()
    // this.scene.add(this.stage)

    // Test
    // var geo = new BoxGeometry(2,2,2)
    // var mat = new MeshBasicMaterial({color: 0x00ff00})
    // this.cube = new PhysicalMesh();
    // this.cube.geometry = geo;
    // this.cube.material = mat;
    // this.cube.translateY(10)
    // this.scene.add(this.cube)
    // var testBody = new C.Body({
    //   mass: 1
    // })
    // testBody.addShape(new C.Box(new C.Vec3(2,2,2).scale(0.5)), new C.Vec3(0,10,0))
    // this.cube.body = testBody;
    // this.world.addBody(testBody)

    // Ground
    var ground = new Brick(40, 2, 20, new Color('rgb(255,255,255)'));
    ground.translateY(-5)
    ground.setRotationFromEuler(new Euler(0,0,0.3))
    this.scene.add(ground);

    var ground2 = new Brick(40, 2, 20, new Color('rgb(255,255,255)'));
    ground2.translateX(30)
    ground2.translateY(-12)
    ground2.setRotationFromEuler(new Euler(0,0,2.8))
    this.scene.add(ground2)

    var ground3 = new Brick(60, 2, 20, new Color('rgb(255,255,255)'));
    ground3.translateX(95)
    ground3.translateY(-18)
    ground3.setRotationFromEuler(new Euler(0,0,0))
    this.scene.add(ground3)

    var groundBody = new C.Body({
      mass: 0,
      material: this.stageMat
    })
    groundBody.addShape(new C.Box(new C.Vec3(40,2,20).scale(0.5)), new C.Vec3(0,-5,0), new C.Quaternion().setFromEuler(0,0,0.3))
    groundBody.addShape(new C.Box(new C.Vec3(40,2,20).scale(0.5)), new C.Vec3(30,-12,0), new C.Quaternion().setFromEuler(0,0,2.8))
    groundBody.addShape(new C.Box(new C.Vec3(60,2,20).scale(0.5)), new C.Vec3(95,-18,0), new C.Quaternion().setFromEuler(0,0,0))

    this.world.addBody(groundBody)


    // Contact
    const contactMat = new C.ContactMaterial(this.busMat,this.stageMat,{
      friction: 0.1,
      restitution: 0.5
    })
    this.world.addContactMaterial(contactMat)
  }

  addBusPhysics = () => {
    this.bus.geometry.computeBoundingBox()
    this.bus.geometry.computeBoundingSphere()
    var pos = this.bus.position
    this.bus.initPosition = new C.Vec3(pos.x, pos.y, pos.z)

    this.scene.add(this.bus)
    var testBody = new C.Body({
      mass: 1,
      position: this.bus.initPosition,
      material: this.busMat
    })
    const busFront = 2.79
    const busBack = 2.5
    var center = ((busBack + this.bus.segmentLength) - busFront) / 2
    var busLength = busFront + busBack + this.bus.segmentLength

    testBody.addShape(new C.Box(new C.Vec3(busLength, 2, 3.93).scale(0.5)), new C.Vec3(center , 2 ,1).scale(0.5))
    this.box = new BoxHelper(new Mesh(new BoxGeometry(busLength,2,3.93)))
    this.scene.add(this.box)
    this.bus.body = testBody;
    this.world.addBody(testBody)
  }

  setLight() {
    this.light = new DirectionalLight('#ffffff', 15);
    this.light.position.set(this.lightOffset.x, this.lightOffset.y, this.lightOffset.z);

    this.light.castShadow = true;
    this.light.shadow.camera.right = 50;
    this.light.shadow.camera.left = -50;
    this.light.shadow.camera.top = 50;
    this.light.shadow.camera.bottom = -50;

    this.light.shadow.bias = 0.0001;
    this.light.shadow.radius = 10;
    this.light.shadow.mapSize.width = 1024 * 4;
    this.light.shadow.mapSize.height = 1024 * 4;
    this.scene.add(this.light);
    this.scene.add(this.light.target)
    var helper = new CameraHelper(this.light.shadow.camera)
    this.scene.add(helper)
  }

  constructor() {
    this.world = new C.World();
    this.world.gravity.set(0,-5,0);
    this.world.broadphase = new C.NaiveBroadphase();
    this.world.solver.iterations = 5;

    this.scene = new Scene()

    this.setCamera();
    this.setRenderer();
    this.addObjects()
    this.setLight();

   // this.cdr = new CannonDebugRenderer(this.scene, this.world)
    this.time.start();

    // const color = '#ffffff';
    // const intensity = 5;
    // const light = new DirectionalLight(color, intensity);
    // light.castShadow=true;
    // light.position.set(0, 100, 0);
    // light.target.position.set(0,0,0)
    // this.scene.add(light);
    // //   this.scene.add(light.target);
    //this.scene.add(hemiLight);

    // var light2 = new DirectionalLight(0xffffff,4);
    // light2.position.set(10, 150, 25);


    // this.bus.add(light2);


    const elem = document.querySelector('#button');
    elem?.addEventListener('click', () => {
      // canvas.toBlob((blob) => {
      //   saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
      // });
      this.bus.setSegmentCount()
    });

    this.onDocumentKeyDown=(event: KeyboardEvent) =>{
        var keyCode = event.key;
        console.log(keyCode)
        if (keyCode == '+') {
          console.log('plus' + this)
          this.bus.setSegmentCount()
        }
      }

    document.addEventListener("keydown", this.onDocumentKeyDown, false);
    this.render();
  }




  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render() {
    this.world.step(1 / 60)
    // this.cdr.update()
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());

    // const cubeBodyPos = this.cube.body.position
    // const cubeBodyQuat = this.cube.body.quaternion
    // this.cube.position.copy(new Vector3(cubeBodyPos.x,cubeBodyPos.y,cubeBodyPos.z))
    // this.cube.quaternion.copy(new Quaternion(cubeBodyQuat.x,cubeBodyQuat.y,cubeBodyQuat.z, cubeBodyQuat.w))
    // Move bus here
    this.bus.body.velocity.x = 4
    const busBodyPos = this.bus.body.position
    const busBodyQuat = this.bus.body.quaternion
    this.bus.position.copy(new Vector3(busBodyPos.x,busBodyPos.y,busBodyPos.z))
    this.box.position.copy(this.bus.position)
    this.bus.quaternion.copy(new Quaternion(busBodyQuat.x,busBodyQuat.y,busBodyQuat.z, busBodyQuat.w))

    // Move camera and Light here
    this.lerpCamera()

    var lightTargetPos = new Vector3(this.bus.position.x + this.lightOffset.x, this.bus.position.y + this.lightOffset.y, this.bus.position.z + this.lightOffset.z)
    this.light.position.set(lightTargetPos.x, lightTargetPos.y, lightTargetPos.z)
    this.light.target.position.set(this.bus.position.x, this.bus.position.y, this.bus.position.z)

    this.adjustCanvasSize();
  }

  private lerpCamera(){
    var cameraTargetPos = new Vector3(this.bus.position.x + this.cameraOffset.x, this.bus.position.y + this.cameraOffset.y, this.bus.position.z + this.cameraOffset.z)
    cameraTargetPos = cameraTargetPos.lerp(this.camera.position,0.975)
    this.camera.position.set(cameraTargetPos.x, cameraTargetPos.y, cameraTargetPos.z)
    this.camera.lookAt(this.bus.position);
  }


}
