import { SearchProvider } from "../../domain/services/SearchProvider";

export class MockSearchProvider implements SearchProvider {
  async search(query: string): Promise<string[]> {
    // Simulated search results
    return [
      "https://exampleblog.com/write-for-us",
      "https://techsite.com/guest-post",
      "https://marketinghub.org/contribute",
      "https://spammy-site.biz/free-links"
    ];
  }
}