import externalLibraries from "../assets/jsons/externalLibraries.json";
import * as base64toArrayBuffer from "base64-arraybuffer";
import { BrotliDecompressBuffer } from "brotli/dec/decode";

export default class LibraryLoader {
  static load(callback) {
    let total = externalLibraries.length;
    let loaded = 0;
    let time = performance.now();
    if (total === 0) {
      callback();
      return;
    }
    // eslint-disable-next-line no-unused-vars
    let onLoaded = (error, instance) => {
      loaded++;
      if (error) {
        console.error(error);
      }
      if (loaded === total) {
        time = performance.now() - time;
        console.log(`Loaded ${total} libraries in ${time}ms`);
        callback();
      }
    };
    externalLibraries.forEach((library) => {
      LibraryLoader._loadScript(library, onLoaded);
    });
  }

  static _loadScript(data, callback) {
    let source;
    if (data.type === "base64") {
      let arrayBuffer = base64toArrayBuffer.decode(data.source);
      if (data.compressed) {
        let dataBuffer = Buffer.from(arrayBuffer);
        let decompress = BrotliDecompressBuffer(dataBuffer);
        source = new TextDecoder("utf-8").decode(decompress);
      }
      else {
        source = new TextDecoder("utf-8").decode(arrayBuffer);
      }
    }
    else if (data.type === "url" || data.type === "script") {
      source = data.source;
    }
    else {
      throw new Error(`Unknown type ${data.type}`);
    }
    const script = document.createElement("script");

    let cb = (error) => {
      if (error) {
        callback(error);
        return;
      }
      let module = window[data.name];
      window[data.name] = undefined;
      module({
        onAbort: () => {
          callback(`Aborted loading ${data.name}`);
        },
      }).then((instance) => {
        callback(null, instance);
      });
    };

    if (data.type === "url") {
      script.setAttribute("src", source);
      script.onload = cb;
      script.onerror = () => cb(`Error loading ${source}`, data.name);
      document.body.appendChild(script);
    }
    else {
      script.innerHTML = source;
      document.body.appendChild(script);
      cb(null);
    }
  }
}
