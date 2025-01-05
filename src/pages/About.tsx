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
  const [error, setError] = useState<string>('');

  const aboutRef = React.useRef(null);
  const openSourceRef = React.useRef(null);
  const supportRef = React.useRef(null);

  const isAboutInView = useInView(aboutRef, { once: true, margin: "-20%" });
  const isOpenSourceInView = useInView(openSourceRef, { once: true, margin: "-20%" });
  const isSupportInView = useInView(supportRef, { once: true, margin: "-20%" });

  useEffect(() => {
    const fetchGitHubData = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch repository data
        const repoResponse = await fetch('https://api.github.com/repos/suraniharsh/CodeCandy', {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!repoResponse.ok) {
          throw new Error('Failed to fetch repository data');
        }

        const repoData = await repoResponse.json();
        setStarCount(repoData.stargazers_count);

        // Fetch contributors
        const contributorsResponse = await fetch('https://api.github.com/repos/suraniharsh/CodeCandy/contributors', {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!contributorsResponse.ok) {
          throw new Error('Failed to fetch contributors');
        }

        const contributorsData = await contributorsResponse.json();
        setContributors(contributorsData);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub data');
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
      className="max-w-7xl mx-auto"
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl font-bold mb-6"
      >
        About CodeCandy
      </motion.h1>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            ref={aboutRef}
            variants={containerVariants}
            initial="hidden"
            animate={isAboutInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <div className="bg-dark-800 rounded-lg p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 shadow-lg border border-dark-700/50">
              <motion.section variants={sectionVariants}>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 lg:gap-8">
                  <div className="flex-1 w-full md:w-auto order-2 md:order-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-primary-400 tracking-tight">
                      Our Mission
                    </h2>
                    <p className="text-dark-200 leading-relaxed text-sm sm:text-base">
                      CodeCandy is your personal code snippet manager, designed to help developers organize and share their most useful code snippets.
                      We believe in making code reusability simple and efficient.
                    </p>
                  </div>
                  <div className="order-1 md:order-2 flex-shrink-0">
                    <img
                      src="/images/mission.svg"
                      alt="Mission illustration"
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                    />
                  </div>
                </div>
              </motion.section>

              <motion.section variants={sectionVariants}>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 lg:gap-8">
                  <div className="flex-1 w-full md:w-auto order-2 md:order-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-primary-400 tracking-tight">
                      Features
                    </h2>
                    <motion.ul className="list-none space-y-2 sm:space-y-3 text-sm sm:text-base">
                      {[
                        "Organize code snippets into collections",
                        "Syntax highlighting for multiple languages",
                        "Quick search and filtering",
                        "Share snippets with other developers",
                        "Keyboard shortcuts for power users"
                      ].map((feature, index) => (
                        <motion.li
                          key={index}
                          variants={listItemVariants}
                          custom={index}
                          className="flex items-start gap-2"
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0"></span>
                          <span className="text-dark-200 leading-relaxed">{feature}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                  <div className="order-1 md:order-2 flex-shrink-0">
                    <img
                      src="/images/features.svg"
                      alt="Features illustration"
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                    />
                  </div>
                </div>
              </motion.section>

              <motion.section variants={sectionVariants} className="border-t border-dark-700/50 pt-4 sm:pt-6 lg:pt-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-primary-400 tracking-tight">
                  Contact
                </h2>
                <p className="text-dark-200 leading-relaxed text-sm sm:text-base">
                  Have questions or suggestions? Feel free to reach out to our team at{' '}
                  <a
                    href="mailto:hello@suraniharsh.codes"
                    className="text-primary-400 hover:text-primary-300 transition-colors duration-200 underline decoration-primary-400/30 hover:decoration-primary-300"
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
            <div className="bg-dark-800 rounded-lg p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 shadow-lg border border-dark-700/50">
              <motion.section variants={sectionVariants}>
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 lg:gap-8">
                  <div className="flex-1 w-full">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-primary-400 tracking-tight">
                      Open Source
                    </h2>
                    <p className="text-dark-200 leading-relaxed text-sm sm:text-base mb-4 sm:mb-0">
                      CodeCandy is proudly open source and built by the community. We believe in transparency and collaboration,
                      making our codebase accessible to everyone who wants to contribute or learn.
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 w-full sm:w-auto"
                  >
                    <a
                      href="https://github.com/harshhhdev/codecandy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2.5 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors shadow-sm"
                    >
                      <FiStar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                      {loading ? (
                        <span className="text-sm text-dark-300">Loading...</span>
                      ) : error ? (
                        <span className="text-sm text-red-400">Error loading stars</span>
                      ) : (
                        <>
                          <span className="font-medium text-sm sm:text-base">{starCount}</span>
                          <span className="text-xs sm:text-sm text-dark-300">stars</span>
                        </>
                      )}
                    </a>
                  </motion.div>
                </div>
              </motion.section>

              <motion.section variants={sectionVariants} className="border-t border-dark-700/50 pt-4 sm:pt-6 lg:pt-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-6 text-primary-400 tracking-tight">
                  Contributors
                </h2>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {loading ? (
                    <div className="flex items-center gap-2 text-dark-200 text-sm sm:text-base">
                      <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                      Loading contributors...
                    </div>
                  ) : error ? (
                    <div className="text-red-400 text-sm sm:text-base">{error}</div>
                  ) : contributors.length > 0 ? (
                    contributors.map((contributor, index) => (
                      <motion.div
                        key={contributor.login}
                        className="group"
                        variants={contributorVariants}
                        custom={index}
                      >
                        <motion.a
                          href={contributor.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={contributor.avatar_url}
                            alt={`${contributor.login}'s profile`}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-primary-400/50 hover:ring-primary-400 transition-all duration-200"
                          />
                          <motion.div
                            className="absolute opacity-0 group-hover:opacity-100 bg-dark-900/90 text-white text-xs rounded-md px-2.5 py-1.5 -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10 shadow-lg backdrop-blur-sm"
                            initial={{ y: 5, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {contributor.login}
                          </motion.div>
                        </motion.a>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-dark-200 text-sm sm:text-base">No contributors found</div>
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
          className="bg-dark-800 rounded-lg p-8 sm:p-10 lg:p-12 shadow-xl"
        >
          <motion.section
            variants={sectionVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-primary-400">
              Support CodeCandy
            </h2>
            <p className="text-dark-200 leading-relaxed text-sm sm:text-base lg:text-lg mb-8">
              Help us make CodeCandy better for everyone. Join our community and
              contribute to the future of code sharing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                { text: "Star our repository", icon: <FiStar /> },
                { text: "Report bugs and features", icon: <FiCode /> },
                { text: "Share with developers", icon: <FiShare2 /> },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={listItemVariants}
                  className="bg-dark-700/50 rounded-lg p-5 sm:p-6 lg:p-8 flex items-center justify-center gap-3 hover:bg-dark-600 transition-all duration-300"
                >
                  <div className="text-primary-400 w-6 h-6">{item.icon}</div>
                  <span className="text-dark-100 font-medium text-sm sm:text-base">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="https://github.com/suraniharsh/CodeCandy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-primary-500 text-white rounded-lg shadow-lg hover:bg-primary-600 transition-all text-sm sm:text-base lg:text-lg font-medium"
                >
                  <FiGithub className="w-5 h-5" />
                  Support on GitHub
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="https://www.buymeacoffee.com/suraniharsh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-[#FFDD00] text-dark-900 rounded-lg shadow-lg hover:bg-[#FFDD00]/90 transition-all text-sm sm:text-base lg:text-lg font-medium"
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