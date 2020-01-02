export type MeasureFn = (text: string, size: number) => number;

export function wrapParagraph(
  para: string,
  maxWidth: number,
  fontSize: number,
  options: { hyphenateLongWords?: boolean } = {},
  measure: MeasureFn,
): string[] {
  const { hyphenateLongWords } = options;
  const out: string[] = [];
  const words = para.split(/\s+/);
  let line = "";
  for (const word of words) {
    const candidate = line ? line + " " + word : word;
    const candidateWidth = measure(candidate, fontSize);
    if (candidateWidth <= maxWidth) {
      line = candidate;
    } else {
      if (line) out.push(line);
      // Hard-break overlong word
      if (measure(word, fontSize) > maxWidth) {
        if (hyphenateLongWords) {
          // naive hyphenation: break word into chunks that fit with a trailing '-'
          let remaining = word;
          while (measure(remaining, fontSize) > maxWidth && remaining.length > 2) {
            let cut = remaining.length - 1;
            while (cut > 2 && measure(remaining.slice(0, cut) + "-", fontSize) > maxWidth) {
              cut--;
            }
            if (cut <= 2) break;
            out.push(remaining.slice(0, cut) + "-");
            remaining = remaining.slice(cut);
          }
          line = remaining;
        } else {
          let chunk = "";
          for (const ch of word) {
            const testChunk = chunk + ch;
            if (measure(testChunk, fontSize) <= maxWidth) {
              chunk = testChunk;
            } else {
              if (chunk) out.push(chunk);
              chunk = ch;
            }
          }
          line = chunk;
        }
      } else {
        line = word;
      }
    }
  }
  if (line) out.push(line);
  return out;
}
