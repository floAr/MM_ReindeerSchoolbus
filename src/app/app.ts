import { Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer, Clock, ShadowMapType, PCFSoftShadowMap, SpotLight, SphereBufferGeometry, MeshStandardMaterial, Mesh, PlaneBufferGeometry, CameraHelper, DirectionalLight, Group, Euler, HemisphereLight, AmbientLight, ShaderLib, DirectionalLightHelper, ReinhardToneMapping, Quaternion } from 'three';
import { Brick } from './brick';
import { Bus } from './bus';
import loader from './loader';
import * as C from 'cannon'




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

  private world: C.World
  private movement = 0
  private busMat: C.Material
  private groundMat: C.Material
  private pressed: any

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
    this.groundMat = new C.Material("groundMat")
    this.bus = new Bus(20, 10, 10, new Color('#FFFFFF'), this.addPhysics)
    
    this.bus.translateY(10)

    var ground = new Brick(200, 2, 20, new Color('rgb(80,120,120)'));
    var groundBody = new C.Body({
      mass: 0,
      material: this.groundMat
    })
    groundBody.addShape(new C.Box(new C.Vec3(200,2,20).scale(0.5)))

    this.world.addBody(groundBody)
    this.scene.add(ground);

    const contactMat = new C.ContactMaterial(this.busMat,this.groundMat,{
      friction: 0.2,
      restitution: 0.1
    })
    this.world.addContactMaterial(contactMat)
  }

  addPhysics = () => {
    this.bus.geometry.computeBoundingBox()
    this.bus.geometry.computeBoundingSphere()
    
    this.bus.size = this.bus.geometry.boundingBox.getSize(new Vector3())
    var pos = this.bus.position
    this.bus.initPosition = new C.Vec3(pos.x, pos.y, pos.z)

    const box = new C.Box(new C.Vec3(this.bus.size.x, this.bus.size.y, this.bus.size.z))
    
    this.bus.body = new C.Body( {
      mass: 10,
      position: this.bus.initPosition,
      material: this.busMat
    })
    
    const sphere = this.bus.geometry.boundingSphere
    
    this.bus.body.addShape(box, new C.Vec3(sphere.center.x,sphere.center.y,sphere.center.z))

    this.world.addBody(this.bus.body)
    this.scene.add(this.bus)
    console.log(this.bus)
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

    this.canvas.addEventListener('keydown',this.onDocumentKeyDown)

    this.render();
  }

  private onDocumentKeyDown(event: KeyboardEvent) {
    console.log('keyevent');
    var func = (event: KeyboardEvent) => {
      var keyCode = event.key;
      console.log(keyCode)
      if (keyCode == '+') {
        console.log('plus' + this)
        this.bus.setSegmentCount()

      }
    }
    func(event)
  };

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render() {
    this.world.step(1 / 60)
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());

    // Move bus here
    this.bus.body.velocity.x = 8
    const busBodyPos = this.bus.body.position
    const busBodyQuat = this.bus.body.quaternion
    this.bus.position.copy(new Vector3(busBodyPos.x,busBodyPos.y,busBodyPos.z))
    this.bus.quaternion.copy(new Quaternion(busBodyQuat.x,busBodyQuat.y,busBodyQuat.z,busBodyQuat.w))

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
