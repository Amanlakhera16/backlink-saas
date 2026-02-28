export const calculateSpamScore = (url: string): number => {
  let score = 0;

  const spamKeywords = ["casino", "bet", "adult", "free-links", ".biz"];

  spamKeywords.forEach(keyword => {
    if (url.includes(keyword)) score += 30;
  });

  return score;
};