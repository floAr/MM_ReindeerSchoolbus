import { Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer, Clock, ShadowMapType, PCFSoftShadowMap, SpotLight, SphereBufferGeometry, MeshStandardMaterial, Mesh, PlaneBufferGeometry, CameraHelper, DirectionalLight, Group, Euler, HemisphereLight, AmbientLight, ShaderLib, DirectionalLightHelper, ReinhardToneMapping } from 'three';
import { Brick } from './brick';
import { Bus } from './bus';
import loader from './loader';
import * as planck from 'planck-js'




export class App {

  private canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 10000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: this.canvas
  });
  private readonly time = new Clock(true);

  private readonly cameraOffset: Vector3 = new Vector3(0, 50, 100)
  private readonly lightOffset: Vector3 = new Vector3(10, 20, 20)

  private ground: Brick;
  private bus: Bus

  private light: DirectionalLight


  constructor() {


    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(112,112,112)'));
    this.renderer.shadowMap.enabled = true;


    this.renderer.toneMapping = ReinhardToneMapping
    this.renderer.toneMappingExposure = 1.0

    this.ground = new Brick(300, 10, 50, new Color('rgb(80,120,120)'));
    this.bus = new Bus(20, 10, 10, new Color('#FFFFFF'))

    this.bus.translateY(5)
    this.scene.add(this.ground);
    this.scene.add(this.bus);

    this.time.start();

    this.camera.position.set(this.cameraOffset.x, this.cameraOffset.y, this.cameraOffset.z);
    this.camera.lookAt(new Vector3(0, 0, 0));

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
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());

    // Move bus here
    this.bus.translateX((Math.sin(this.time.getElapsedTime())))

    // Move camera and Light here
    var cameraTargetPos = new Vector3(this.bus.position.x + this.cameraOffset.x, this.bus.position.y + this.cameraOffset.y, this.bus.position.z + this.cameraOffset.z)
    this.camera.position.set(cameraTargetPos.x, cameraTargetPos.y, cameraTargetPos.z)
    this.camera.lookAt(this.bus.position);

    var lightTargetPos = new Vector3(this.bus.position.x + this.lightOffset.x, this.bus.position.y + this.lightOffset.y, this.bus.position.z + this.lightOffset.z)
    this.light.position.set(lightTargetPos.x, lightTargetPos.y, lightTargetPos.z)
    this.light.target.position.set(this.bus.position.x, this.bus.position.y, this.bus.position.z)

    this.adjustCanvasSize();
  }


}
