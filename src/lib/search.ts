export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return dp[m][n];
}

export function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return 1;
  if (q.length < 3) return 0;
  // Check each word in the target
  const words = t.split(/\s+/);
  for (const word of words) {
    const dist = levenshtein(q, word.substring(0, q.length + 2));
    if (dist <= 2) return 0.5;
  }
  return 0;
}

export function bestMatch(query: string, items: { name: string; slug: string }[]): string | null {
  if (!query || query.length < 2) return null;
  let best = { score: 0, name: "" };
  for (const item of items) {
    const score = Math.max(
      fuzzyScore(query, item.name),
      fuzzyScore(query, item.slug)
    );
    if (score > best.score) {
      best = { score, name: item.name };
    }
  }
  return best.score > 0 ? best.name : null;
}
