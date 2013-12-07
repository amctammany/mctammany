'use strict';

angular.module('mctApp')
  .factory('Rhythm', function () {
    // Service logic
    // ...
    var Rhythm = function () {
      this.channels = ['Kick1', 'Snare1', 'ClHat1', 'OpHat1', 'Tom1', 'Tom2', 'Tom3', 'Cymbal'];
      this.reset();
    };
    Rhythm.prototype.demos = [
      {
        channels: [ 'Kick1', 'Snare1', 'ClHat1', 'OpHat1', 'Tom1', 'Tom2', 'Tom3', 'Cymbal'],
        'Tom1': {
          beat: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: true,
          x: -100,
          y: 0,
          z: 0,
          buffer: 'Tom1'
        },
        'Tom2': {
          beat: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: true,
          x: 100,
          y: 0,
          z: 0,
          buffer: 'Tom2'
        },
        'Tom3': {
          beat: [1,1,0,0,1,1,0,0,1,0,1,0,1,0,1,1],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'Tom3'
        },
        'ClHat1': {
          beat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'ClHat1'
        },
        'OpHat1': {
          beat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'OpHat1'
        },
        'Kick1': {
          beat: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'Kick1'
        },
        'Snare1': {
          beat: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'Snare1'
        },
        'Cymbal': {
          beat: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          pitch: 1,
          mainGain: 0.8,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'Cymbal'
        }
      },
      {
        channels: [ 'Kick1', 'Snare1', 'ClHat1', 'OpHat1', 'Tom1', 'Tom2', 'Tom3', 'Cymbal'],
        'Tom1': {
          beat: [1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: true,
          x: -100,
          y: 0,
          z: 0,
          buffer: 'Tom1'
        },
        'Tom2': {
          beat: [1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: true,
          x: 100,
          y: 0,
          z: 0,
          buffer: 'Tom2'
        },
        'Tom3': {
          beat: [1,1,0,0,1,1,0,0,1,0,1,0,1,0,1,1],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'Tom3'
        },
        'ClHat1': {
          beat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'ClHat1'
        },
        'OpHat1': {
          beat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'OpHat1'
        },
        'Kick1': {
          beat: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'Kick1'
        },
        'Snare1': {
          beat: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'Snare1'
        },
        'Cymbal': {
          beat: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          pitch: 1,
          mainGain: 0.8,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: 'Cymbal'
        }
      }
    ];
    Rhythm.prototype.playNote = function (note) {
      this.channels.forEach( function (channel) {
        var ch = this[channel];
        if (channel.beat[note]) {
          this.playSound(ch.buffer);
        }
      }, this);
    };
    Rhythm.prototype.reset = function () {
      this.channels.forEach( function (channel) {
        this[channel] = {
          beat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          pitch: 1,
          mainGain: 1,
          sendGain: 1,
          pan: false,
          x: 0,
          y: 0,
          z: 0,
          buffer: channel
        };
      }, this);
    };

    Rhythm.prototype.load = function (rhythm) {
      this.channels = rhythm.channels;
      this.channels.forEach( function (channel) {
        this[channel] = {
          beat: rhythm[channel].beat,
          pitch: rhythm[channel].pitch,
          mainGain: rhythm[channel].mainGain,
          sendGain: rhythm[channel].sendGain,
          buffer: rhythm[channel].buffer
        };
      }, this);
    };


    return Rhythm;
  });
