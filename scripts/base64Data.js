const fs = require("fs");
const datauri = require("datauri/sync");

// Tạo thư mục 'dist' nếu chưa tồn tại
if (!fs.existsSync("./dist")) {
    fs.mkdirSync("./dist");
}

// Liệt kê tất cả các thư mục trong thư mục 'assets'
const ASSET_DIR = "./assets";
const dirs = fs.readdirSync(ASSET_DIR);

let assetData = {
    textures: {},
    audios: {},
    models: {},
    animations: {},
    sprites: {}, // Đã thêm mục sprites vào assetData
};

// build texture
const TEXTURE_DIR = "textures";

if (dirs.includes(TEXTURE_DIR)) {
    const textureFiles = fs.readdirSync(`${ASSET_DIR}/${TEXTURE_DIR}`);
    textureFiles.forEach((tex) => {
        if (tex === ".DS_Store") {
            return;
        }
        const basename = tex.split(".")[0];
        assetData.textures[basename] = datauri(`${ASSET_DIR}/${TEXTURE_DIR}/${tex}`).content;
    });
}

// build audios
const AUDIO_DIR = "audios";

if (dirs.includes(AUDIO_DIR)) {
    const audioFiles = fs.readdirSync(`${ASSET_DIR}/${AUDIO_DIR}`);
    audioFiles.forEach((audio) => {
        if (audio === ".DS_Store") {
            return;
        }
        const basename = audio.split(".")[0];
        assetData.audios[basename] = datauri(`${ASSET_DIR}/${AUDIO_DIR}/${audio}`).content;
    });
}

// build models
const MODEL_DIR = "models";

if (dirs.includes(MODEL_DIR)) {
    const modelFiles = fs.readdirSync(`${ASSET_DIR}/${MODEL_DIR}`);
    modelFiles.forEach((model) => {
        if (model === ".DS_Store") {
            return;
        }
        const basename = model.split(".")[0];
        assetData.models[basename] = datauri(`${ASSET_DIR}/${MODEL_DIR}/${model}`).content;
    });
}

// build animations
const ANIMATION_DIR = "animations";

if (dirs.includes(ANIMATION_DIR)) {
    const animationFiles = fs.readdirSync(`${ASSET_DIR}/${ANIMATION_DIR}`);
    animationFiles.forEach((animation) => {
        if (animation === ".DS_Store") {
            return;
        }
        const basename = animation.split(".")[0];
        assetData.animations[basename] = datauri(`${ASSET_DIR}/${ANIMATION_DIR}/${animation}`).content;
    });
}

// build sprites
const SPRITE_DIR = "sprites";

if (dirs.includes(SPRITE_DIR)) {
    const spriteFiles = fs.readdirSync(`${ASSET_DIR}/${SPRITE_DIR}`);
    spriteFiles.forEach((sprite) => {
        if (sprite === ".DS_Store") {
            return;
        }
        const basename = sprite.split(".")[0];
        assetData.sprites[basename] = datauri(`${ASSET_DIR}/${SPRITE_DIR}/${sprite}`).content;
    });
}

fs.writeFileSync("./assets/jsons/assetB64.json", JSON.stringify(assetData, null, 1));
let allTextureSize = 0;
Object.keys(assetData.textures).forEach((key) => {
    allTextureSize += assetData.textures[key].length;
});
console.log(`Tổng số texture: ${allTextureSize / 1024}`);

let allAudioSize = 0;
Object.keys(assetData.audios).forEach((key) => {
    allAudioSize += assetData.audios[key].length;
});
console.log(`Tổng số âm thanh: ${allAudioSize / 1024}`);

let allModelSize = 0;
Object.keys(assetData.models).forEach((key) => {
    allModelSize += assetData.models[key].length;
});
console.log(`Tổng số models: ${allModelSize / 1024}`);

let allAnimationSize = 0;
Object.keys(assetData.animations).forEach((key) => {
    allAnimationSize += assetData.animations[key].length;
});
console.log(`Tổng số animation: ${allAnimationSize / 1024}`);

let allSpriteSize = 0;
Object.keys(assetData.sprites).forEach((key) => {
    allSpriteSize += assetData.sprites[key].length;
});
console.log(`Tổng số sprites: ${allSpriteSize / 1024}`);
