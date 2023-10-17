import { Asset } from "playcanvas";
import { Game } from "../src/game";

export class AssetDecoder {
    static async decodeModelAsync(value, name) {
        const base64Response = await fetch(value);
        const modelBlob = await base64Response.blob();
        let fileModel = {
            url: URL.createObjectURL(modelBlob),
            filename: name
        };

        return new Promise((resolve, reject) => {
            Game.app.assets.loadFromUrlAndFilename(fileModel.url, fileModel.filename, 'container', (err, asset) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(asset);
                }
            });
        });
    }


    static async decodeTextureAsync(value, name) {
        const base64Response = await fetch(value);
        const modelBlob = await base64Response.blob();
        let fileModel = {
            url: URL.createObjectURL(modelBlob),
            filename: name
        };

        return new Promise((resolve, reject) => {

            Game.app.assets.loadFromUrlAndFilename(fileModel.url, fileModel.filename, 'texture', (err, asset) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(asset);
                }
            });
        });
    }
    static async decodeAudioAsync(value, name) {
        const base64Response = await fetch(value);
        const audioBlob = await base64Response.blob();
        let fileAudio = {
            url: URL.createObjectURL(audioBlob),
            filename: name
        };
        return new Promise((resolve, reject) => {
            Game.app.assets.loadFromUrlAndFilename(fileAudio.url, fileAudio.filename, 'audio', (err, asset) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(asset);
                }
            });
        });
    }
    static async decodeAnimationAsync(value, name) {
        const base64Response = await fetch(value);
        const animationBlob = await base64Response.blob();
        let fileAnimation = {
            url: URL.createObjectURL(animationBlob),
            filename: name
        };

        return new Promise((resolve, reject) => {
            Game.app.assets.loadFromUrlAndFilename(fileAnimation.url, fileAnimation.filename, 'container', (err, asset) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(asset);
                }
            });
        });
    }
}