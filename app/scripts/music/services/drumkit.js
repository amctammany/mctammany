'use strict';

angular.module('mctApp')
  .factory('Drumkit', function (Rhythm) {
    // Service logic
    // ...
    var Drumkit = function () {
      this.context = new window.webkitAudioContext();
      this.effectDryMix = 1.0;
      this.effectWetMix = 1.0;
      this.timerId = 1;
      this.startTime = 0.0; // Context Start Time
      this.currentNote = 0; // Beat Number
      this.tempo = 120.0;
      this.lookahead = 25.0; // Context Interval Length
      this.scheduleAheadTime = 0.1; // Timeout Length
      this.nextNoteTime = 0.0; // Context Time of Next Note
      this.noteLength = 0.05; // Length of Note
      this.noteQueue = [];

      // Setup Final Mix
      if (this.context.createDynamicsCompressor) {
        this.compressor = this.context.createDynamicsCompressor();
        this.compressor.connect(this.context.destination);
        this.finalMixNode = this.compressor;

      } else {
        this.finalMixNode = this.context.destination;
      }

      this.masterGainNode = this.context.createGain();
      this.masterGainNode.gain.value = 0.7;
      this.masterGainNode.connect(this.finalMixNode);

      this.effectLevelNode = this.context.createGain();
      this.effectLevelNode.gain.value = 1.0;
      this.effectLevelNode.connect(this.masterGainNode);

      this.convolver = this.context.createConvolver();
      this.convolver.connect(this.effectLevelNode);

      this.sounds = {};

      this.rhythm = new Rhythm();
      this.scheduler = this.schedule.bind(this);
    };

    Drumkit.prototype.loadSound = function (url, name) {
      var self = this,
        context = this.context,
        request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
          self.sounds[name] = buffer;
        }, function (err) {
          if (err) {console.log(err);}
        });
      };
      request.send();
    };

    Drumkit.prototype.playSound = function (name) {
      var source = this.context.createBufferSource();
      source.buffer = this.sounds[name];
      source.connect(this.context.destination);
      source.start(0);
    };

    Drumkit.prototype.advanceNote = function () {
      var secondsPerBeat = 60.0 / this.tempo;
      this.currentNote++;
      this.currentNote = this.currentNote % 16;
      this.nextNoteTime += 0.25 * secondsPerBeat;
      console.log(this.currentNote);
    };

    Drumkit.prototype.playNote = function (ch, time) {
      var finalNode;
      var voice = this.context.createBufferSource();
      voice.buffer = this.sounds[ch.buffer];
      if (ch.pan) {
        var panner = this.context.createPanner();
        panner.setPosition(ch.x, ch.y, ch.z);
        voice.connect(panner);
        finalNode = panner;
      } else {
        finalNode = voice;
      }

      var dryGainNode = this.context.createGain();
      dryGainNode.gain.value = ch.mainGain * this.effectDryMix;

      finalNode.connect(dryGainNode);
      dryGainNode.connect(this.masterGainNode);

      var wetGainNode = this.context.createGain();
      wetGainNode.gain.value = ch.sendGain * this.effectWetMix;

      finalNode.connect(wetGainNode);
      wetGainNode.connect(this.convolver);
      return voice.start(time);
    };

    Drumkit.prototype.scheduleChannel = function (channel, time) {
      var ch = this.rhythm[channel];
      if (ch.beat[this.currentNote]) {
        this.playNote(ch, time);
      }
    };

    Drumkit.prototype.schedule = function () {
      var currentTime = this.context.currentTime - this.startTime;
      while (this.nextNoteTime < currentTime + this.scheduleAheadTime) {
        var time = this.nextNoteTime + this.startTime;
        this.rhythm.channels.forEach( function (channel) {
          var ch = this.rhythm[channel];
          if (ch.beat[this.currentNote]) {
            this.playNote(ch, time);
          }
        }, this);
        this.advanceNote();
      }
      this.timerId = setTimeout(this.scheduler, this.lookahead);
      return this.timerId;
    };
    Drumkit.prototype.handlePlay = function () {
      this.nextNoteTime = 0.0;
      this.startTime = this.context.currentTime + this.noteLength;
      return this.schedule();
    };
    Drumkit.prototype.handleStop = function () {
      return clearTimeout(this.timerId);
    };


    // Public API here
    return Drumkit;
  });
