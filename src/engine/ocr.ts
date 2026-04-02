// ============================================================
// OCR Bridge — Camera → ML Kit Text Recognition
// ============================================================
import TextRecognition from '@react-native-ml-kit/text-recognition';

export interface OCRResult {
  rawText: string;
  blocks: Array<{
    text: string;
    frame?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
}

/**
 * Runs on-device text recognition on a local image URI.
 * Uses @react-native-ml-kit/text-recognition (fully offline).
 */
export async function recognizeTextFromImage(imageUri: string): Promise<OCRResult> {
  try {
    const result = await TextRecognition.recognize(imageUri);

    const blocks =
      result.blocks?.map((block) => ({
        text: block.text ?? '',
        frame: block.frame
          ? {
              x: block.frame.left ?? 0,
              y: block.frame.top ?? 0,
              width: block.frame.width ?? 0,
              height: block.frame.height ?? 0,
            }
          : undefined,
      })) ?? [];

    const rawText = blocks.map((b) => b.text).join('\n');

    return { rawText, blocks };
  } catch (error) {
    console.error('[OCR] Recognition failed:', error);
    throw new Error('Text recognition failed. Please try again with a clearer image.');
  }
}
