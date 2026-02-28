import { ProspectModel } from "../../infrastructure/database/ProspectModel";
import { MockSearchProvider } from "../../infrastructure/search/MockSearchProvider";
import { getDomainAuthority } from "./AuthorityService";
import { calculateSpamScore } from "./SpamFilter";

export const discoverProspects = async (
  campaignId: string,
  userId: string,
  niche: string
) => {
  const provider = new MockSearchProvider();
  const urls = await provider.search(`${niche} guest post`);

  const prospects = urls.map(url => ({
    userId,
    campaignId,
    website: url,
    domainAuthority: getDomainAuthority(url),
    spamScore: calculateSpamScore(url),
    status: "discovered"
  }));

  return ProspectModel.insertMany(prospects);
};
