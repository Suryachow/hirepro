export interface FormattedAIResponse {
  title: string | null;
  points: string[];
  raw: string;
}

// Parse simple AI responses formatted by the assistant (title + bullets or numbered lines)
export function parseFormattedResponse(text: string): FormattedAIResponse {
  const raw = text || '';
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  if (lines.length === 0) return { title: null, points: [], raw };

  // Detect title: prefer a line starting with ✨ or an all-caps short line or the first short line
  let title: string | null = null;
  if (lines[0].startsWith('✨')) {
    title = lines[0].replace(/^✨\s*/, '');
    lines.shift();
  } else if (/^[A-Z0-9 \-]{3,60}$/.test(lines[0]) && lines[0].length < 80) {
    title = lines[0];
    lines.shift();
  } else if (lines[0].length < 60 && !lines[0].includes(':')) {
    // treat first short line as title
    title = lines[0];
    lines.shift();
  }

  // Extract points: lines starting with -, •, or numbered (1.), or treat remaining lines as points
  const points: string[] = [];
  lines.forEach(line => {
    // remove common bullet characters
    const bulletMatch = line.match(/^([-•\u2022\*]\s*)(.*)$/);
    if (bulletMatch) {
      points.push(bulletMatch[2].trim());
      return;
    }

    const numberedMatch = line.match(/^\d+\.\s*(.*)$/);
    if (numberedMatch) {
      points.push(numberedMatch[1].trim());
      return;
    }

    // split on ' - ' pattern (sometimes models put "Title - detail")
    if (line.includes(' - ')) {
      const parts = line.split(/\s-\s/).map(p => p.trim()).filter(Boolean);
      parts.forEach(p => points.push(p));
      return;
    }

    // fallback: push the line as a point but keep it short by truncating long lines
    const short = line.length > 180 ? line.slice(0, 177) + '...' : line;
    points.push(short);
  });

  return { title, points, raw };
}

export default parseFormattedResponse;
