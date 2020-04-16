<template>
  <div class="index">

    <div id="overlay">
      <div>
        <button id="startButton" @click="start">Click to Play</button>
      </div>
    </div>
    <div id="container"></div>

    <video id="videoElement" loop crossOrigin="anonymous" playsinline  autoplay></video>
  </div>
</template>


<script type="module">
  import * as THREE from 'three';
  import flvjs from 'flv.js/dist/flv.js';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
  import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
  import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
export default {
  name: 'index',
  props: {
    msg: String
  },
  data() {
    return {
      container: {},
      camera: {},
      scene: {},
      renderer: {},
      video: {},
      texture: {},
      material: {},
      mesh: {},
      composer: {},
      mouseX: 0,
      mouseY: 0,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      cube_count: {},
      //创建网格模型对象
      meshes: [],
      //创建材质对象
      materials: [],
      xgrid: 20,
      ygrid: 10,
      h:0,
      counter:1,
    }
  },
  methods:{

    start:function(){
      this.init();
      this.animate();
    },
    init:function(){

    var overlay = document.getElementById( 'overlay' );
    overlay.remove();

    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );

    //创建相机
    this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 500;

    //创建场景
    this.scene = new THREE.Scene();

    //创建灯光
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0.5, 1, 1 ).normalize();
    this.scene.add( light );

    //场景渲染
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container.appendChild( this.renderer.domElement );


    // http-flv demo实现直播shader视频的播放 ,绑定video
    this.video = document.getElementById( 'videoElement' );
    // video.play();
    if (flvjs.isSupported()) {
      var flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: './static/video/test.flv'//添加路由
      });
      flvPlayer.attachMediaElement(this.video);
      flvPlayer.load(); //加载
    }
    //创建纹理视频
    this.texture = new THREE.VideoTexture( this.video );


    var i, j, ux, uy, ox, oy,
            geometry,
            xsize, ysize;

    ux = 1 / this.xgrid;
    uy = 1 / this.ygrid;

    xsize = 480 / this.xgrid;
    ysize = 204 / this.ygrid;

    var parameters = { color: 0xffffff, map: this.texture };

      this.cube_count = 0;

    for ( i = 0; i < this.xgrid; i ++ )
      for ( j = 0; j < this.ygrid; j ++ ) {

        ox = i;
        oy = j;

        geometry = new THREE.BoxBufferGeometry( xsize, ysize, xsize );

        this.change_uvs( geometry, ux, uy, ox, oy );

        this.materials[ this.cube_count ] = new THREE.MeshLambertMaterial( parameters );

        this.material = this.materials[ this.cube_count ];

        this.material.hue = i / this.xgrid;
        this.material.saturation = 1 - j / this.ygrid;

        this.material.color.setHSL( this.material.hue, this.material.saturation, 0.5 );

        this.mesh = new THREE.Mesh( geometry, this.material );

        this.mesh.position.x = ( i - this.xgrid / 2 ) * xsize;
        this.mesh.position.y = ( j - this.ygrid / 2 ) * ysize;
        this.mesh.position.z = 0;

        this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = 1;

        this.scene.add( this.mesh );

        this.mesh.dx = 0.001 * ( 0.5 - Math.random() );
        this.mesh.dy = 0.001 * ( 0.5 - Math.random() );

        this.meshes[ this.cube_count ] = this.mesh;

        this.cube_count += 1;

      }

    this.renderer.autoClear = false;

    //todo
    document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );

    // postprocessing

    var renderModel = new RenderPass( this.scene, this.camera );
    var effectBloom = new BloomPass( 1.3 );
    var effectCopy = new ShaderPass( CopyShader );

      this.composer = new EffectComposer( this.renderer );

      this.composer.addPass( renderModel );
      this.composer.addPass( effectBloom );
      this.composer.addPass( effectCopy );


    //todo
    //window.addEventListener( 'resize', onWindowResize, false );

  },

    onWindowResize:function () {

      this.windowHalfX = window.innerWidth / 2;
      this.windowHalfY = window.innerHeight / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
      this.composer.setSize( window.innerWidth, window.innerHeight );

  },

   change_uvs:function( geometry, unitx, unity, offsetx, offsety ) {

    var uvs = geometry.attributes.uv.array;

    for ( var i = 0; i < uvs.length; i += 2 ) {

      uvs[ i ] = ( uvs[ i ] + offsetx ) * unitx;
      uvs[ i + 1 ] = ( uvs[ i + 1 ] + offsety ) * unity;

    }

  },


   onDocumentMouseMove:function( event ) {

     this.mouseX = ( event.clientX - this.windowHalfX );
     this.mouseY = ( event.clientY - this.windowHalfY ) * 0.3;

  },

  //

   animate:function() {

    requestAnimationFrame( this.animate );

     this.render();

  },



   render:function() {

    var time = Date.now() * 0.00005;

    this.camera.position.x += ( this.mouseX - this.camera.position.x ) * 0.05;
    this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * 0.05;

    this.camera.lookAt( this.scene.position );

    for ( var i = 0; i < this.cube_count; i ++ ) {

      this.material = this.materials[ i ];

      this.h = ( 360 * ( this.material.hue + time ) % 360 ) / 360;
      this.material.color.setHSL( this.h, this.material.saturation, 0.5 );

    }

    if ( this.counter % 1000 > 200 ) {

      for (  i = 0; i < this.cube_count; i ++ ) {

        this.mesh = this.meshes[ i ];

        this.mesh.rotation.x += 10 * this.mesh.dx;
        this.mesh.rotation.y += 10 * this.mesh.dy;

        this.mesh.position.x += 200 * this.mesh.dx;
        this.mesh.position.y += 200 * this.mesh.dy;
        this.mesh.position.z += 400 * this.mesh.dx;

      }

    }

    if ( this.counter % 1000 === 0 ) {

      for (  i = 0; i < this.cube_count; i ++ ) {

        this.mesh = this.meshes[ i ];

        this.mesh.dx *= - 1;
        this.mesh.dy *= - 1;

      }

    }

     this.counter ++;

    this.renderer.clear();
     this.composer.render();

  }
  }
}
</script>

<style scoped>

</style>
