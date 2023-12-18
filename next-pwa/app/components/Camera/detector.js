import {
  env,
  AutoProcessor,
  RawImage,
  CLIPVisionModelWithProjection,
} from "@xenova/transformers";

// Skip local model check
env.allowLocalModels = false;

const model_id = "Xenova/clip-vit-base-patch32"; // vector(512)
const processor = await AutoProcessor.from_pretrained(model_id);
const vision_model = await CLIPVisionModelWithProjection.from_pretrained(
  model_id,
  {
    quantized: false,
  },
);

import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
  runtime: "tfjs",
};

const detector = await faceLandmarksDetection.createDetector(
  model,
  detectorConfig,
);

const createScreenshot = (video) => {
  let canvas = document.createElement("canvas");
  canvas.width = video.width;
  canvas.height = video.height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
};

export const runDetector = async (video, { onFaceDetected } = {}) => {
  const detect = async (net) => {
    const estimationConfig = { flipHorizontal: false };
    const [face] = await net.estimateFaces(video, estimationConfig);

    if (face?.box) {
      const {
        box: { xMin, yMin, width, height },
      } = face;
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      // grayscale
      ctx.filter = "grayscale(1)";
      ctx.drawImage(video, -xMin, -yMin, video.width, video.height);

      let image = await RawImage.read(canvas.toDataURL());

      // Read image and run processor
      let image_inputs = await processor(image);

      // Compute embeddings
      const { image_embeds } = await vision_model(image_inputs);
      const embed_as_list = image_embeds.tolist()[0];

      const ret = {
        image: createScreenshot(video),
        embedding: embed_as_list,
      };
      onFaceDetected && onFaceDetected(ret);

      return ret; // img
    }

    // repeat
    return detect(detector);
  };
  return detect(detector);
};
