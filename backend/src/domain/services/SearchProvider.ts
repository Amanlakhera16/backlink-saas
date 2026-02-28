export interface SearchProvider {
  search(query: string): Promise<string[]>;
}