// Musical Machine Learning Plinko by
// Chase Mitchusson
// http://chasemitchusson.wordpress.com
//
// based on code by
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Plinko
// Video 1: https://youtu.be/KakpnfDv_f0
// Video 2: https://youtu.be/6s4MJcUyaUE
// Video 3: https://youtu.be/jN-sW-SxNzk
// Video 4: https://youtu.be/CdBXmsrkaPs
// CONTROL INTERPOLATE TONE.JS
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
var membrane;
var metal;
var pluck;
var fmSynth;
var feedbackDelay;
var distorted;
var polySynth1;
var amsy0;
var chorus;
var pitchy0;
var pitchy1;
var pitchy2;

function setup(msg) {
    createCanvas(600, 700);
    colorMode(HSB);
    engine = Engine.create();
    world = engine.world;
    //world.gravity.y = 2;
    socket = io.connect('http://localhost:8008')
    socket.on('pegs', soundDesign);

    feedbackDelay = new Tone.FeedbackDelay("4n", 0.9).toMaster();
    distorted = new Tone.Distortion(0.9).toMaster();
    chorus = new Tone.Chorus(4, 2.5, 0.5).toMaster();
    pitchy0 = new Tone.PitchShift(8).toMaster();
    pitchy1 = new Tone.PitchShift(8).toMaster();
    pitchy2 = new Tone.PitchShift(8).toMaster();

    membrane = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octave: 10,
        oscillator: {
            type: "sine"
        },
        envelope: {
            attack: 0.004,
            decay: 0.4,
            sustain: 0.01,
            release: 1.4,
            attackCurve: "exponential"
        }
    }).chain(pitchy0, chorus);

    polySynth1 = new Tone.PolySynth(6, Tone.PluckSynth).chain(pitchy1, distorted);

    amsy0 = new Tone.AMSynth().chain(pitchy2, feedbackDelay);


    socket.on('wekTrained', function(data) {
        sub1 = subset(data, 1, 5);
        console.log('wekTrained: ' + sub1);
    })

    function collision(event) {
      membrane.pitchDecay = sub1[0];
      feedbackDelay.feedback.value = sub1[1];
      pitchy0.pitch = sub1[2] * 6;
      pitchy1.pitch = sub1[3] * 4;
      pitchy2.pitch = sub1[4] * 2;
        var pairs = event.pairs;
        for (var i = 0; i < pairs.length; i++) {
            if (pairs[i].bodyA.label == 'plinko' && pairs[i].bodyA.id <= 119) {
                hitOn(plinkos.length, pairs[i].bodyA.id);
                console.log("BodyA: " + pairs[i].bodyA.id);
            }
            if (pairs[i].bodyB.label == 'plinko' && pairs[i].bodyB.id <= 119) {
                hitOn(plinkos.length, pairs[i].bodyB.id);
                console.log("BodyB: " + pairs[i].bodyB.id);
            }
            if (pairs[i].bodyA.label == 'plinko' && pairs[i].bodyA.id <= 119 || pairs[i].bodyB.label == 'plinko' && pairs[i].bodyB.id <= 119) {
              if (pairs[i].bodyA.label == 'plinko' && pairs[i].bodyA.id <= 23 || pairs[i].bodyB.label == 'plinko' && pairs[i].bodyB.id <= 23) {
                amsy0.triggerAttackRelease('D#5', '32n');
                polySynth1.triggerAttackRelease(['E4', 'B4'], '32n');
              } else if (pairs[i].bodyA.label == 'plinko' && pairs[i].bodyA.id <= 46 || pairs[i].bodyB.label == 'plinko' && pairs[i].bodyB.id <= 46) {
                  amsy0.triggerAttackRelease('G#5', '32n');
                  polySynth1.triggerAttackRelease(['B4', 'E5'], '32n');
              } else if (pairs[i].bodyA.label == 'plinko' && pairs[i].bodyA.id <= 69 || pairs[i].bodyB.label == 'plinko' && pairs[i].bodyB.id <= 69) {
                  amsy0.triggerAttackRelease('D#6', '32n');
                  polySynth1.triggerAttackRelease(['E5', 'B6'], '32n');
              } else if (pairs[i].bodyA.label == 'plinko' && pairs[i].bodyA.id <= 92 || pairs[i].bodyB.label == 'plinko' && pairs[i].bodyB.id <= 92) {
                  amsy0.triggerAttackRelease('G#6', '32n');
                  polySynth1.triggerAttackRelease(['A4', 'E5'], '32n');
              } else if (pairs[i].bodyA.label == 'plinko' && pairs[i].bodyA.id <= 119 || pairs[i].bodyB.label == 'plinko' && pairs[i].bodyB.id <= 119) {
                  amsy0.triggerAttackRelease('D#7', '32n');
                  polySynth1.triggerAttackRelease(['E4', 'B4'], '32n');
                  membrane.triggerAttackRelease('D#2', '32n');
              }
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
        hitList[x] = 0.9;
    }
    console.log(hitList);
    socket.emit('pegs', hitList);
}

function soundDesign(msg) {

}
