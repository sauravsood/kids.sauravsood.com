"""Finds every animal in a photo and cuts each one out, for My Animals.

Grounded SAM 2 (IDEA-Research/Grounded-SAM-2, Apache-2.0), run through
Hugging Face transformers:

1. Grounding DINO tiny (IDEA-Research/grounding-dino-tiny, Apache-2.0) is
   asked for "animal." and gives one box per animal, so a herd comes back as
   separate animals instead of one blob.
2. SAM 2.1 small (facebook/sam2.1-hiera-small, Apache-2.0) cuts out each box
   with a clean edge, which fixes the boxy outlines on close-up faces.
3. If nothing is found (a face filling the whole frame, a toy), SAM is asked
   for the thing in the middle of the photo instead.

Returns masks at the photo's size as 1-bit PNGs; Trace's photo.js turns them
into outlines, the same way it does for the on-device model.
"""

import base64
import io
import os

import numpy as np
import torch
from PIL import Image

DINO = os.environ.get("OUTLINE_DETECTOR", "IDEA-Research/grounding-dino-tiny")
SAM = os.environ.get("OUTLINE_SAM", "facebook/sam2.1-hiera-small")
PROMPT = "animal."
MAX_ANIMALS = 6
torch.set_num_threads(max(1, os.cpu_count() or 1))


def png(mask):
    buf = io.BytesIO()
    Image.fromarray((mask * 255).astype(np.uint8)).convert("1").save(buf, "PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode()


def iou(a, b):
    x1, y1 = max(a[0], b[0]), max(a[1], b[1])
    x2, y2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    area = lambda r: (r[2] - r[0]) * (r[3] - r[1])  # noqa: E731
    return inter / max(1e-6, area(a) + area(b) - inter)


class Outliner:
    def __init__(self):
        from transformers import (AutoModelForZeroShotObjectDetection, AutoProcessor, Sam2Model,
                                  Sam2Processor)
        self.dp = AutoProcessor.from_pretrained(DINO)
        self.dm = AutoModelForZeroShotObjectDetection.from_pretrained(DINO).eval()
        self.sp = Sam2Processor.from_pretrained(SAM)
        self.sm = Sam2Model.from_pretrained(SAM).eval()

    @torch.inference_mode()
    def boxes(self, img):
        inputs = self.dp(images=img, text=PROMPT, return_tensors="pt")
        out = self.dm(**inputs)
        res = self.dp.post_process_grounded_object_detection(
            out, inputs.input_ids, threshold=0.3, text_threshold=0.25, target_sizes=[img.size[::-1]])[0]
        found = sorted(zip(res["scores"].tolist(), res["boxes"].tolist()), reverse=True)
        W, H = img.size
        kept = []
        for score, box in found:
            # A box around the whole photo is the background, not an animal, when others exist.
            if any(iou(box, k) > 0.6 for _, k in kept):
                continue
            kept.append((score, box))
        if len(kept) > 1:
            kept = [k for k in kept if (k[1][2] - k[1][0]) * (k[1][3] - k[1][1]) < 0.97 * W * H] or kept
        return kept[:MAX_ANIMALS]

    @torch.inference_mode()
    def cut(self, img, boxes=None, point=None):
        if boxes:
            inputs = self.sp(images=img, input_boxes=[boxes], return_tensors="pt")
        else:
            inputs = self.sp(images=img, input_points=[[[point]]], input_labels=[[[1]]], return_tensors="pt")
        out = self.sm(**inputs, multimask_output=False)
        masks = self.sp.post_process_masks(out.pred_masks, inputs["original_sizes"])[0]
        return masks[:, 0].numpy().astype(bool)  # [n, H, W]

    def masks(self, jpeg):
        img = Image.open(io.BytesIO(jpeg)).convert("RGB")
        W, H = img.size
        found = self.boxes(img)
        if found:
            masks = self.cut(img, boxes=[b for _, b in found])
            scores = [s for s, _ in found]
        else:
            masks = self.cut(img, point=[W / 2, H / 2])
            scores = [0.0]
        animals = []
        for m, s in zip(masks, scores):
            area = int(m.sum())
            if area < 0.004 * W * H:
                continue
            ys, xs = np.nonzero(m)
            animals.append({"score": round(float(s), 3), "area": area,
                            "box": [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1],
                            "mask": png(m)})
        animals.sort(key=lambda a: -a["area"])
        return {"width": W, "height": H, "found": bool(found), "animals": animals,
                "model": "grounding-dino-tiny + sam2.1-hiera-small"}
