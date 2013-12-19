var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DictionarySchema = new Schema({
	name: {type: String, required: true},
  urlString: String,
  words: [String]
});
DictionarySchema.pre('save', function (next) {
  if (this.name) { this.urlString = this.name.toLocaleLowerCase().replace(/\s+/g, '-'); }
  next();
});

mongoose.model('Dictionary', DictionarySchema);
