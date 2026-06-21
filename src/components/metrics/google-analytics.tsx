import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

const GoogleAnalytics = () => (
  <NextGoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!} />
);

export default GoogleAnalytics;
