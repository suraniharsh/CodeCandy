import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiGithub, FiCoffee, FiCode, FiShare2, FiStar } from 'react-icons/fi';

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const contributorVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 0.5,
    },
  },
};

export function About(): React.ReactElement {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [starCount, setStarCount] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const aboutRef = React.useRef(null);
  const openSourceRef = React.useRef(null);
  const supportRef = React.useRef(null);

  const isAboutInView = useInView(aboutRef, { once: true, margin: "-20%" });
  const isOpenSourceInView = useInView(openSourceRef, {
    once: true,
    margin: "-20%",
  });
  const isSupportInView = useInView(supportRef, { once: true, margin: "-20%" });

  useEffect(() => {
    const fetchGitHubData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch repository data
        const repoResponse = await fetch(
          "https://api.github.com/repos/suraniharsh/CodeCandy",
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!repoResponse.ok) {
          throw new Error("Failed to fetch repository data");
        }

        const repoData = await repoResponse.json();
        setStarCount(repoData.stargazers_count);

        // Fetch contributors
        const contributorsResponse = await fetch(
          "https://api.github.com/repos/suraniharsh/CodeCandy/contributors",
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!contributorsResponse.ok) {
          throw new Error("Failed to fetch contributors");
        }

        const contributorsData = await contributorsResponse.json();
        setContributors(contributorsData);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError("Failed to load GitHub data");
        // Set fallback data
        setStarCount(0);
        setContributors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mx-auto max-w-7xl"
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 text-3xl font-bold"
      >
        About CodeCandy
      </motion.h1>

      <div className="flex flex-wrap space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            ref={aboutRef}
            variants={containerVariants}
            initial="hidden"
            animate={isAboutInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <div className="p-6 space-y-6 rounded-lg bg-dark-800">
              <motion.section variants={sectionVariants}>
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <h2 className="mb-3 text-xl font-semibold text-primary-400">
                      Our Mission
                    </h2>
                    <p className="leading-relaxed text-dark-200">
                      CodeCandy is your personal code snippet manager, designed
                      to help developers organize and share their most useful
                      code snippets. We believe in making code reusability
                      simple and efficient.
                    </p>
                  </div>
                  <img
                    src="/images/mission.svg"
                    alt="Mission illustration"
                    className="hidden object-contain w-24 h-24 md:block"
                  />
                </div>
              </motion.section>

              <motion.section variants={sectionVariants}>
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <h2 className="mb-3 text-xl font-semibold text-primary-400">
                      Features
                    </h2>
                    <motion.ul className="space-y-2 list-disc list-inside text-dark-200">
                      {[
                        "Organize code snippets into collections",
                        "Syntax highlighting for multiple languages",
                        "Quick search and filtering",
                        "Share snippets with other developers",
                        "Keyboard shortcuts for power users",
                      ].map((feature, index) => (
                        <motion.li
                          key={index}
                          variants={listItemVariants}
                          custom={index}
                        >
                          {feature}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                  <img
                    src="/images/features.svg"
                    alt="Features illustration"
                    className="hidden object-contain w-24 h-24 md:block"
                  />
                </div>
              </motion.section>

              <motion.section variants={sectionVariants}>
                <h2 className="mb-3 text-xl font-semibold text-primary-400">
                  Contact
                </h2>
                <p className="leading-relaxed text-dark-200">
                  Have questions or suggestions? Feel free to reach out to our
                  team at{" "}
                  <a
                    href="mailto:hello@suraniharsh.codes"
                    className="text-primary-400 hover:text-primary-300"
                  >
                    hello@suraniharsh.codes
                  </a>
                </p>
              </motion.section>
            </div>
          </motion.div>

          <motion.div
            ref={openSourceRef}
            variants={containerVariants}
            initial="hidden"
            animate={isOpenSourceInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <div className="p-6 space-y-6 rounded-lg bg-dark-800">
              <motion.section variants={sectionVariants}>
                <div className="flex flex-col items-start justify-between gap-6">
                  <div className="flex flex-wrap items-center justify-between w-full">
                    <h2 className="mb-3 text-xl font-semibold text-primary-400">
                      Open Source
                    </h2>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0"
                    >
                      <a
                        href="https://github.com/harshhhdev/codecandy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 transition-colors rounded-lg bg-dark-700 hover:bg-dark-600"
                      >
                        <FiStar className="w-5 h-5 text-yellow-400" />
                        {loading ? (
                          <span className="text-sm text-dark-300">
                            Loading...
                          </span>
                        ) : error ? (
                          <span className="text-sm text-red-400">
                            Error loading stars
                          </span>
                        ) : (
                          <>
                            <span className="font-medium">{starCount}</span>
                            <span className="text-sm text-dark-300">stars</span>
                          </>
                        )}
                      </a>
                    </motion.div>
                  </div>

                  <p className="leading-relaxed text-dark-200">
                    CodeCandy is proudly open source and built by the
                    community. We believe in transparency and collaboration,
                    making our codebase accessible to everyone who wants to
                    contribute or learn.
                  </p>
                </div>
              </motion.section>

              <motion.section variants={sectionVariants}>
                <h2 className="mb-3 text-xl font-semibold text-primary-400">
                  Contributors
                </h2>
                <div className="flex flex-wrap gap-4">
                  {loading ? (
                    <div className="flex items-center gap-2 text-dark-200">
                      <div className="w-4 h-4 border-2 rounded-full border-primary-400 border-t-transparent animate-spin"></div>
                      Loading contributors...
                    </div>
                  ) : error ? (
                    <div className="text-red-400">{error}</div>
                  ) : contributors.length > 0 ? (
                    contributors.map((contributor, index) => (
                      <motion.a
                        key={contributor.login}
                        variants={contributorVariants}
                        custom={index}
                        href={contributor.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={contributor.avatar_url}
                          alt={`${contributor.login}'s profile`}
                          className="w-12 h-12 rounded-full ring-2 ring-primary-400/50"
                        />
                        <motion.div
                          className="absolute px-2 py-1 text-xs text-white transform -translate-x-1/2 rounded opacity-0 group-hover:opacity-100 bg-dark-900/90 -bottom-8 left-1/2 whitespace-nowrap"
                          initial={{ y: 5, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {contributor.login}
                        </motion.div>
                      </motion.a>
                    ))
                  ) : (
                    <div className="text-dark-200">No contributors found</div>
                  )}
                </div>
              </motion.section>
            </div>
          </motion.div>
        </div>

        <motion.div
          ref={supportRef}
          variants={containerVariants}
          initial="hidden"
          animate={isSupportInView ? "visible" : "hidden"}
          className="w-full p-6 rounded-lg bg-dark-800"
        >
          <motion.section
            variants={sectionVariants}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="mb-4 text-2xl font-semibold text-primary-400">
              Support CodeCandy
            </h2>
            <p className="mb-6 leading-relaxed text-dark-200">
              Help us make CodeCandy better for everyone. Join our community and
              contribute to the future of code sharing.
            </p>
            <div className="grid gap-6 mb-8 md:grid-cols-3">
              {[
                { text: "Star our repository", icon: <FiStar /> },
                { text: "Report bugs and features", icon: <FiCode /> },
                { text: "Share with developers", icon: <FiShare2 /> },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={listItemVariants}
                  className="flex items-center justify-center gap-2 p-4 rounded-lg bg-dark-700/50"
                >
                  {item.icon}
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <a
                  href="https://github.com/suraniharsh/CodeCandy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 text-lg font-medium text-white transition-colors rounded-lg bg-primary-500 hover:bg-primary-600 min-w-[15rem]"
                >
                  <FiGithub className="w-5 h-5" />
                  Support on GitHub
                </a>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <a
                  href="https://www.buymeacoffee.com/suraniharsh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 text-lg font-medium transition-colors rounded-lg bg-[#FFDD00] text-dark-900 hover:bg-[#FFDD00]/90 min-w-[15rem]"
                >
                  <FiCoffee className="w-5 h-5" />
                  Buy me a coffee
                </a>
              </motion.div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </motion.div>
  );
}
