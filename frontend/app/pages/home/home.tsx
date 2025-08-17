import { motion } from "framer-motion";
import meowl from "~/meowl.png";
import NavBar from "~/components/navBar";

const Home: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="flex min-h-screen flex-col items-center justify-center">
        <motion.img
          src={meowl}
          alt="meowl"
          className="w-48"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
        <div className="flex flex-col items-center justify-center">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-semibold text-zinc-800 md:text-7xl dark:text-zinc-200">
              Welcome to{" "}
              <motion.span
                whileTap={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 8 }}
                className="inline-block cursor-pointer bg-gradient-to-b from-orange-400 to-red-500 bg-clip-text py-1.5 text-transparent italic select-none"
              >
                MeowlPlace
              </motion.span>
            </h1>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400">Agentic AR</p>
          </header>
        </div>
      </div>
    </>
  );
};

export default Home;
