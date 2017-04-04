// Original code by
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Plinko
// Video 1: https://youtu.be/KakpnfDv_f0
// Video 2: https://youtu.be/6s4MJcUyaUE
// Video 3: https://youtu.be/jN-sW-SxNzk
// Video 4: https://youtu.be/CdBXmsrkaPs
//
// Code adapted for Machine Learning by
// Chase Mitchusson
// http://chasemitchusson.wordpress.com

// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies;

var engine;
var world;
var particles = [];
var plinkos = [];
var bounds = [];
var cols = 11;
var rows = 10;
var hitList = [];
var socket;
var sub1 = [0, 0, 0, 0, 0];
var fmSynth;

function preload() {
    //ding = loadSound('ding.mp3');
}

function setup(msg) {
    createCanvas(600, 700);
    colorMode(HSB);
    engine = Engine.create();
    world = engine.world;
    //world.gravity.y = 2;
    socket = io.connect('http://localhost:8008')
    socket.on('pegs', soundDesign);
    fmSynth = new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        detune: 0
    }).toMaster();

    socket.on('wekTrained', function(data) {
        sub1 = subset(data, 1, 5);
        console.log('wekTrained: ' + sub1);
    })

    function collision(event) {
      soundDesign();
        //fmSynth.triggerAttackRelease("C4", '32n');
        //console.log(plinkos);
        var pairs = event.pairs;
        for (var i = 0; i < pairs.length; i++) {
            //var labelA = pairs[i].bodyA.label;
            //var labelB = pairs[i].bodyB.label;
            if (pairs[i].bodyA.label == 'plinko' && pairs[i].bodyA.id <= 119) {
                //ding.play();
                hitOn(plinkos.length, pairs[i].bodyA.id);
                console.log("BodyA: " + pairs[i].bodyA.id);
            }
            if (pairs[i].bodyB.label == 'plinko' && pairs[i].bodyB.id <= 119) {
                //ding.play();
                hitOn(plinkos.length, pairs[i].bodyB.id);
                console.log("BodyB: " + pairs[i].bodyB.id);
            }
        }
    }

    Events.on(engine, 'collisionStart', collision);

    //newParticle(); //this initiates a particle at x:0, y:0 upon page load
    var spacing = width / cols;
    for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols + 1; i++) {
            var x = i * spacing;
            if (j % 2 == 0) {
                x += spacing / 2;
            }
            var y = spacing + j * spacing;
            var p = new Plinko(x, y, 16);
            plinkos.push(p);
        }
    }

    //var b = new Boundary(width / 2, height + 50, width, 100);
    bounds.push(b);

    for (var i = 0; i < cols + 2; i++) {
        var x = i * spacing;
        var h = 100;
        var w = 10;
        var y = height - h / 2;
        var b = new Boundary(x, y, w, h);
        bounds.push(b);

    }


}

function newParticle() {
    var p = new Particle(mouseX, mouseY, 10);
    particles.push(p);
}

function draw() {
    background(0, 0, 0);
    /*if (frameCount % 20 == 0) {
        newParticle();
    }*/
    if (mouseIsPressed) {
        newParticle();
        for (var i = 0; i <= 119; i++) {
            hitList[i] = 0.1;
        }
    }
    Engine.update(engine, 1000 / 30);
    for (var i = 0; i < particles.length; i++) {
        particles[i].show();
        if (particles[i].isOffScreen()) {
            World.remove(world, particles[i].body);
            particles.splice(i, 1);
            i--;
        }
    }
    for (var i = 0; i < plinkos.length; i++) {
        plinkos[i].show();
        //console.log(plinkos.length);
    }
    for (var i = 0; i < bounds.length; i++) {
        //bounds[i].show();
    }
}

function hitOn(len, e) {
    var x = e;
    for (var i = 0; i < len; i++) {
        //hitList[i] = 0.1;
        hitList[x] = 0.9;
    }
    //splice(list,value,position)
    console.log(hitList);
    socket.emit('pegs', hitList);
}

function soundDesign(msg) {
    //add var to update dsp params
    //use this function in collision?
    console.log("sub1[0] " + sub1[0]);
    console.log("sub1[1] " + sub1[1]);
    console.log("sub1[2] " + sub1[2]);
    fmSynth.triggerAttackRelease("C4", '32n');
    //harmonicity
    fmSynth.harmonicity.value = Math.round(sub1[0]);
    //modulation index
    fmSynth.modulationIndex.value = Math.round(sub1[1]);
    //detune
    fmSynth.detune.value = Math.round(sub1[2]);
}
