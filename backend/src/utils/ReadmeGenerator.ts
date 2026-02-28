export const generateReadmeMarkdown = (summary: any, roi: any) => {
  return `
# Backlink Campaign Report

## Campaign Info
Website: ${summary.campaign.websiteUrl}
Niche: ${summary.campaign.niche}
Region: ${summary.campaign.region}
Backlink Type: ${summary.campaign.backlinkType}

## Opportunities Found
${summary.totalProspects}

## Scored Opportunities
${summary.scored}

## Emails Generated
${summary.emailsGenerated}

## Outreach Sent
${summary.sent}

## Responses Received
${summary.responded}

## Backlinks Secured
${summary.backlinks}

## Response Rate
${summary.responseRate}%

## Estimated ROI
Estimated Value: $${roi.estimatedValue}
ROI Percentage: ${roi.roiPercentage}%

## Next Action Plan
- Follow up non-responders
- Improve personalization
- Target higher authority sites
`;
};