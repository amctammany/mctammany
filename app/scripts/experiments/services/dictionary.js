'use strict';

angular.module('mctApp')
  .factory('Dictionary', function () {
    // Configure bit writing to BASE-64
    var BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    // Width per encoding unit
    var W = 6;

    // returns character unit that represents given value
    function CHR(id) {
      return BASE64[id];
    }

    // Returns decimal value of given character
    var BASE64_CACHE = {
      'A': 0,
      'B': 1,
      'C': 2,
      'D': 3,
      'E': 4,
      'F': 5,
      'G': 6,
      'H': 7,
      'I': 8,
      'J': 9,
      'K': 10,
      'L': 11,
      'M': 12,
      'N': 13,
      'O': 14,
      'P': 15,
      'Q': 16,
      'R': 17,
      'S': 18,
      'T': 19,
      'U': 20,
      'V': 21,
      'W': 22,
      'X': 23,
      'Y': 24,
      'Z': 25,
      'a': 26,
      'b': 27,
      'c': 28,
      'd': 29,
      'e': 30,
      'f': 31,
      'g': 32,
      'h': 33,
      'i': 34,
      'j': 35,
      'k': 36,
      'l': 37,
      'm': 38,
      'n': 39,
      'o': 40,
      'p': 41,
      'q': 42,
      'r': 43,
      's': 44,
      't': 45,
      'u': 46,
      'v': 47,
      'w': 48,
      'x': 49,
      'y': 50,
      'z': 51,
      '0': 52,
      '1': 53,
      '2': 54,
      '3': 55,
      '4': 56,
      '5': 57,
      '6': 58,
      '7': 59,
      '8': 60,
      '9': 61,
      '-': 62,
      '_': 63
    };


    function ORD(ch) {
      return BASE64_CACHE[ch];
    }

    var L1 = 32 * 32;
    var L2 = 32;

    // BitWriter 
    function BitWriter() {
      this.init();
    }
    BitWriter.prototype = {
      init: function () {
        this.bits = [];
      },

      write: function (data, numBits) {
        for (var i = numBits - 1; i >= 0; i--) {
          if (data & ( 1 << i )) {
            this.bits.push(1);
          } else {
            this.bits.push(0);
          }
        }
      },

      // Get bitstring represented by JS string of bytes
      getData: function () {
        var chars = [];
        var b = 0;
        var i = 0;

        for (var j = 0; j < this.bits.length; j++) {
          b = (b << 1) | this.bits[j];
          i += 1;
          if (i === W) {
            chars.push(CHR(b));
            i = b = 0;
          }
        }

        if (i) {
          chars.push(CHR(b << (W - i)));
        }
        return chars.join('');
      },

      // Return bits as a human readable binary string for debugging
      getDebugString: function (group) {
        var chars = [];
        var i = 0;

        for (var j = 0; j < this.bits.length; j++) {
          chars.push('' + this.bits[j]);
          i++;
          if (i === group) {
            chars.push(' ');
            i = 0;
          }
        }
        return chars.join('');
      },
    };

    function BitString(str) {
      this.init(str);
    }

    BitString.MaskTop = [0x3f, 0x1f, 0x0f, 0x07, 0x03, 0x01, 0x00];

    
    BitString.BitsInByte = [
      0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2,
      3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3,
      3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3,
      4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4,
      3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5,
      6, 6, 7, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4,
      4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5,
      6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5,
      3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3,
      4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6,
      6, 7, 6, 7, 7, 8
    ];

    BitString.prototype = {
      init: function (str) {
        this.bytes = str;
        this.length = this.bytes.length * W;
      },

      // Returns internal string of bytes
      getData: function () {
        return this.bytes;
      },

      // Returns decimal, w/ n bits starting at position p
      get: function (p, n) {
        // case 1: bits lie within given byte
        if ( (p % W) + n <= W ) {
          return ( ORD(this.bytes[ p / W | 0 ]) & BitString.MaskTop[p % W] ) >> ( W - p % W - n );
        // case 2: bits lie incompletely in given byte
        } else {
          var result = ( ORD(this.bytes[ p / W | 0 ]) & BitString.MaskTop[ p % W ]);
          var l = W - p % W;
          p += l;
          n -= l;
          while (n >= W) {
            result = (result << n) | (ORD(this.bytes[p / W | 0]));
            p += W;
            n -= W;
          }
          if (n > 0) {
            result = (result << n) | (ORD(this.bytes[p / W | 0]) >> (W-n));
          }

          return result;
        }
      },

      // Counts number of bits to 1 starting at position p and ending at p + n
      count: function (p, n) {
        var count = 0;
        while (n >= 8) {
          count += BitString.BitsInByte[this.get(p, 8)];
          p += 8;
          n -= 8;
        }
        return count + BitString.BitsInByte[this.get(p, n)];
      },

      // Returns number of bits set to 1 up to and including x
      rank: function (x) {
        var rank = 0;
        for (var i = 0; i <= x; i++) {
          if (this.get(i, 1)) {
            rank++;
          }
        }
        return rank;
      },
    };


    // Rank Directory: allows building of index to compute rank and select functions. Index can be encoded as BitString
    var RankDirectory = function RankDirectory(directoryData, bitData, numBits, l1Size, l2Size) {
      this.init(directoryData, bitData, numBits, l1Size, l2Size);
    };

    // Create a new RankDirectory from given string
    // @param data JS String with data: readable w/ BitString object
    // @param numBits Number of bits to index
    // @param l1Size Number of bits that each entry in level 1 table summarizes. Multiple of l2Size
    // @param l2Size Number of bits that each entry in level 2 table summarizes.

    RankDirectory.Create = function (data, numBits, l1Size, l2Size) {
      var bits = new BitString(data);
      var p = 0;
      var i = 0;
      var count1 = 0;
      var count2 = 0;
      var l1bits = Math.ceil(Math.log(numBits) / Math.log(2));
      var l2bits = Math.ceil(Math.log(l1Size) / Math.log(2));

      var directory = new BitWriter();

      while (p + l2Size <= numBits) {
        count2 += bits.count(p, l2Size);
        i += l2Size;
        p += l2Size;

        if (i === l1Size) {
          count1 += count2;
          directory.write(count1, l1bits);
          count2 = 0;
          i = 0;
        } else {
          directory.write(count2, l2bits);
        }
      }
      return new RankDirectory(directory.getData(), data, numBits, l1Size, l2Size);
    };

    RankDirectory.prototype = {
      init: function (directoryData, bitData, numBits, l1Size, l2Size) {
        this.directory = new BitString(directoryData);
        this.data = new BitString(bitData);
        this.l1Size = l1Size;
        this.l2Size = l2Size;
        this.l1Bits = Math.ceil(Math.log(numBits) / Math.log(2));
        this.l2Bits = Math.ceil(Math.log(l1Size) / Math.log(2));
        this.sectionBits = (l1Size / l2Size - 1) * this.l2Bits + this.l1Bits;
        this.numBits = numBits;
      },
      getData: function () {
        return this.directory.getData();
      },

      // Returns number of 1 or 0 bits (depending on which) up to and including position x;
      rank: function (which, x) {
        if (which === 0) {
          return x - this.rank(1, x) + 1;
        }
        var rank = 0;
        var o = x;
        var sectionPos = 0;
        if (o >= this.l1Size) {
          sectionPos = (o / this.l1Size | 0) * this.sectionBits;
          rank = this.directory.get(sectionPos - this.l1Bits, this.l1Bits);
          o = o % this.l1Size;
        }
        if (o >= this.l2Size) {
          sectionPos += (o / this.l2Size | 0) * this.l2Bits;
          rank += this.directory.get(sectionPos - this.l2Bits, this.l2Bits);
        }
        rank += this.data.count(x - x % this.l2Size, x % this.l2Size + 1);

        return rank;
      },
      // Returns position of y'th 0 or 1 bit, depending on which param
      select: function (which, y) {
        var high = this.numBits;
        var low = -1;
        var val = -1;

        while (high - low > 1) {
          var probe = (high + low) / 2 | 0;
          var r = this.rank(which, probe);

          if (r === y) {
            // Must continue search because we want first occurence
            val = probe;
            high = probe;
          } else if ( r < y ) {
            low = probe;
          } else {
            high = probe;
          }
        }
        return val;
      },
    };

    // TrieNode: For building the encoding trie (Not needed for decoding)
    //
    var TrieNode = function TrieNode(letter) {
      this.letter = letter;
      this.final = false;
      this.children = [];
    };

    var Trie = function Trie() {
      this.init();
    };

    Trie.prototype = {
      init: function () {
        this.previousWord = '';
        this.root = new TrieNode(' ');
        this.cache = [this.root];
        this.nodeCount = 1;
      },

      // Get nodes in trie
      getNodeCount: function () {
        return this.nodeCount;
      },

      // Inserts word into trie. Works best if words are inserted alphabetically
      insert: function (word) {
        var commonPrefix = 0;

        for (var i = 0; i < Math.min(word.length, this.previousWord.length); i++) {
          if (word[i] !== this.previousWord[i]) {break;}
          commonPrefix += 1;
        }

        this.cache.length = commonPrefix + 1;
        var node = this.cache[this.cache.length - 1];

        for (i = commonPrefix; i < word.length; i++) {
          var next = new TrieNode(word[i]);
          this.nodeCount++;
          node.children.push(next);
          this.cache.push(next);
          node = next;
        }
        node.final = true;
        this.previousWord = word;
      },

      // Apply a function to each node, traversing the trie in level order
      apply: function (fn) {
        var level = [this.root];
        while (level.length > 0) {
          var node = level.shift();
          for (var i = 0; i < node.children.length; i++) {
            level.push(node.children[i]);
          }
          fn(node);
        }
      },

      // Encode the trie and all its nodes.  Returns string representation
      encode: function () {
        // Write unary encoding of tree in level order
        var bits = new BitWriter();
        bits.write(0x02, 2);
        this.apply(function (node) {
          for (var i = 0; i < node.children.length; i++) {
            bits.write(1, 1);
          }
          bits.write(0, 1);
        });

        // Write data for each node. 6 bits per node. 1 bit stores final indicator
        // Other 5 bits store one of the 26 letters of the alphabet
        var a = ('a').charCodeAt(0);
        this.apply(function (node) {
          var value = node.letter.charCodeAt(0) - a;
          if (node.final) {
            value |= 0x20;
          }
          bits.write(value, 6);
        });
        return bits.getData();
      },

    };

    // FrozenTrieNode: Class for traversing succinctly encoded trie
    var FrozenTrieNode = function FrozenTrieNode(trie, index, letter, final, firstChild, childCount) {
      this.trie = trie;
      this.index = index;
      this.letter = letter;
      this.final = final;
      this.firstChild = firstChild;
      this.childCount = childCount;
    };

    FrozenTrieNode.prototype = {
      getChildCount: function () {
        return this.childCount;
      },

      // Returns FrozenTrieNode for given child
      getChild: function (index) {
        return this.trie.getNodeByIndex(this.firstChild + index);
      },
    };

    // FrozenTrie: used for looking up words in encoded trie
    var FrozenTrie = function FrozenTrie(data, directoryData, nodeCount) {
      this.init(data, directoryData, nodeCount);
    };

    FrozenTrie.prototype = {
      init: function (data, directoryData, nodeCount) {
        this.data = new BitString(data);
        this.directory = new RankDirectory(directoryData, data, nodeCount * 2 + 1, L1, L2);

        // Position of first bit of data in 0th node.
        this.letterStart = nodeCount * 2 + 1;
      },

      // Retrieve FrozenTrieNode by index in level order
      //
      getNodeByIndex: function (index) {
        var final = this.data.get(this.letterStart + index * 6, 1) === 1;
        var letter = String.fromCharCode(this.data.get(this.letterStart + index * 6 + 1, 5) + 'a'.charCodeAt(0));
        var firstChild = this.directory.select(0, index + 1) - index;
        var childOfNextNode = this.directory.select(0, index + 2) - index - 1;

        return new FrozenTrieNode(this, index, letter, final, firstChild, childOfNextNode - firstChild);
      },
      // Retrieve root node
      //
      getRoot: function () {
        return this.getNodeByIndex(0);
      },

      // Lookup word in true; Returns true iff word exists in trie
      lookup: function (word) {
        var node = this.getRoot();
        for (var i = 0; i < word.length; i++) {
          var child;
          var j = 0;
          for (; j < node.getChildCount(); j++) {
            child = node.getChild(j);
            if (child.letter === word[i]) {
              break;
            }
          }
          if (j === node.getChildCount()) {
            return false;
          }
          node = child;
        }
        return node.final;
      },
    };

    var Dictionary = function Dictionary(words) {
      this.words = words;
      this.trie = new Trie();

      var regex = /^[a-z]+$/;
      words.sort();
      for (var i = 0; i < words.length; i++) {
        var word = words[i].toLowerCase();
        if (word.match(/^[a-z]+$/)) {
          this.trie.insert(word);
        }
      }
      this.trieData = this.trie.encode();

      var nodeCount = this.trie.getNodeCount();
      this.directory = RankDirectory.Create(this.trieData, nodeCount * 2 + 1, L1, L2);

      this.nodeCount = nodeCount;
      this.directoryData = this.directory.getData();

    };

    Dictionary.prototype.lookUp = function (word) {
      var ftrie = new FrozenTrie(this.trieData, this.directoryData, this.nodeCount);
      console.log(ftrie);

      if (ftrie.lookup(word)) {
        return word + ' is in dictionary';
      } else {
        return word + ' is NOT in dictionary';
      }
      
    };
    Dictionary.FrozenTrie = FrozenTrie;

    return Dictionary;
  });
