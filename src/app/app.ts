import { Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer, Clock, ShadowMapType, PCFSoftShadowMap, SpotLight, SphereBufferGeometry, MeshStandardMaterial, Mesh, PlaneBufferGeometry, CameraHelper, DirectionalLight } from 'three';
import { Brick } from './brick';
import { Bus } from './bus';
import { loader } from './loader';
import * as planck from 'planck-js'


export class App {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 10000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });
  private readonly time = new Clock(true);
  private readonly loader = new loader();


  private ground: Brick;
  private bus: Bus



  constructor() {


    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(0,0,0)'));
    this.renderer.shadowMap.enabled = true;

    this.ground = new Brick(300, 10, 20, new Color('rgb(255,0,0)'));
    this.bus = new Bus(20, 10, 10, new Color('#FFD800'))
    this.bus.translateY(10)
    this.scene.add(this.ground);
    this.scene.add(this.bus);

    this.time.start();

    this.camera.position.set(0, 100, 200);
    this.camera.lookAt(new Vector3(0, 0, 0));

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    this.scene.add(light);
    this.scene.add(light.target);


    this.loader.load('content/schoolbus.glb',this.scene)

    this.render();
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
    this.bus.translateX((Math.sin(this.time.getElapsedTime())))


    this.camera.lookAt(this.bus.position);
    this.adjustCanvasSize();
  }


}
