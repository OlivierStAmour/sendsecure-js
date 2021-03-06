import _all from 'lodash/every';
import BaseHelper from './BaseHelper.js';
import * as Utils from '../Utils/platform.js';
import * as Exception from '../sendSecureException.js';

export default class Attachment extends BaseHelper {
  /**
  * Create a new instance of Attachment
  * @since 0.0.1
  * @param {String|Object|File} In NodeJS: either the path to a file on disk or an object , in browser a File object (cf. https://developer.mozilla.org/en/docs/Web/API/File).
  * @returns {Attachment} Returns a new instance of Attachment,
  *  else `false`.
  * @example
  *
  * // In browser
  * var inputElement = document.getElementById("input");
  * inputElement.addEventListener("change", function(){
  *  var file = this.files[0];
  *  var attachments = new Attachment(file);
  * });
  *
  * //In NodeJS
  * var attachment = new Attachments('/tmp/foobar.txt');
  * or  var attachment = new Atatchment({filename: 'foobar.txt', stream: fs.readFileSync('/tmp/foobar.txt'), contentType: 'text/plain'});
  */
  constructor(arg) {
    super();
    if (Utils.isNode){
      if (typeof arg == 'string'){
        this.filename = Utils.path.basename(arg);
        this.contentType = Utils.lookup(arg);
        this.stream = Utils.fs.readFileSync(arg);
      }
      else {
        if(_all(['filename', 'stream', 'contentType'], e => e in arg)){
          this.filename = arg.filename;
          this.contentType = arg.contentType;
          this.stream = arg.stream;
        }
        else {
          throw new Exception.SendSecureException(0, 'Missing');
        }
      }
    } else {
      this.file = arg;
    }
    this.guid = null;
    Object.seal(this);
  }
}
