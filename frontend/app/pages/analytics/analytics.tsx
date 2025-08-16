import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "~/components/searchBar";

type AnalyticsProps = {
  loaderData: {
    url?: string;
  };
};

const Analytics: React.FC<AnalyticsProps> = ({ loaderData }) => {
  const [url, setURL] = useState(loaderData.url || "");

  return (
    <div className="min-h-screen py-3">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut", type: "spring" }}
      >
        <SearchBar url={url} setURL={setURL} />
      </motion.div>
    </div>
  );
};

export default Analytics;
