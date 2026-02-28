export const getDomainAuthority = (url: string): number => {
  // Mock random authority between 10-90
  return Math.floor(Math.random() * 80) + 10;
};