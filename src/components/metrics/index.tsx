import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import GoogleAnalytics from "./google-analytics";
import MicrosoftClarity from "./clarity";

const Metrics = () => {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <GoogleAnalytics />
      <MicrosoftClarity />
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
};

export default Metrics;
