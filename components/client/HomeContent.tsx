'use client';

import { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import React from 'react';
import { NowPlaying } from "@/components/ui/spotify/NowPlaying";
import { ProjectType } from "@/types/Project";
import { Project } from "@/components/ui/projects/Project";
import WorkExperience from "@/components/ui/experience/WorkExperience";
import BlogSection from '@/components/blog/BlogSection';
import { BlogPost } from '@/lib/blog';

// Extract photos array to a constant for better management
const photos = [
  "/freya-at-daycare.jpg",
  "/running.jpg",
  "/freya-on-pillow.jpg",
  "/nintendo-world.jpg",
  "https://images.unsplash.com/photo-1550376026-7375b92bb318?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8WUFSTnxlbnwwfHwwfHx8Mg%3D%3D",
  "https://images.unsplash.com/photo-1557868363-e58c250144cf?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

const projects: ProjectType[] = [
  {
    img: "https://images.unsplash.com/photo-1569230919100-d3fd5e1132f4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFiaXRzfGVufDB8fDB8fHwy",
    title: "Wellness Tracker",
    desc: "A self-care dashboard that visualizes mood, energy, and habits.",
    details: "Built with React, Chart.js, and Firebase. Helps users reflect on well-being trends and set goals."
  },
  {
    img: "https://images.unsplash.com/photo-1600284536251-8bb98db53468?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Trail Mapper",
    desc: "A hiking and running route planner powered by OpenStreetMap.",
    details: "Maps trails with GPX import/export, elevation profiles, and offline caching support."
  }
];

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => (
  <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200" {...props}>
    {children}
  </button>
);

const Input = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300" {...props} />
);

export default function HomeContent({posts }: { posts: BlogPost[] }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Shared function to navigate photos in both lightbox and carousel
  const navigatePhotos = useCallback((direction: 'left' | 'right') => {
    // Only update lightbox if it's open
    if (activePhoto) {
      const newIndex = direction === 'right'
        ? (activePhotoIndex + 1) % photos.length
        : (activePhotoIndex - 1 + photos.length) % photos.length;

      setActivePhotoIndex(newIndex);
      setActivePhoto(photos[newIndex]);
    }

    // Always update the carousel
    if (direction === 'right') {
      setSlideIndex((prev) => Math.min(prev + 1, Math.floor(photos.length - 3)));
    } else {
      setSlideIndex((prev) => Math.max(prev - 1, 0));
    }
  }, [activePhoto, activePhotoIndex]);

  // Handle escape key press to close lightboxes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePhoto(null);
        setActiveProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle arrow key navigation for projects lightbox
  useEffect(() => {
    const handleProjectNavigation = (e: KeyboardEvent) => {
      if (!activeProject) return;

      if (e.key === 'ArrowRight') {
        const nextIndex = (activeProjectIndex + 1) % projects.length;
        setActiveProjectIndex(nextIndex);
        setActiveProject(projects[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (activeProjectIndex - 1 + projects.length) % projects.length;
        setActiveProjectIndex(prevIndex);
        setActiveProject(projects[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleProjectNavigation);
    return () => {
      window.removeEventListener('keydown', handleProjectNavigation);
    };
  }, [activeProject, activeProjectIndex]);

  // Handle arrow key navigation for photos lightbox
  useEffect(() => {
    const handlePhotoNavigation = (e: KeyboardEvent) => {
      if (!activePhoto) return;

      if (e.key === 'ArrowRight') {
        navigatePhotos('right');
      } else if (e.key === 'ArrowLeft') {
        navigatePhotos('left');
      }
    };

    window.addEventListener('keydown', handlePhotoNavigation);
    return () => {
      window.removeEventListener('keydown', handlePhotoNavigation);
    };
  }, [activePhoto, activePhotoIndex, navigatePhotos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50 text-gray-800 font-sans">
      <header className="py-16 bg-gradient-to-r from-pink-100 to-indigo-100 shadow-md relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-5xl font-black font-sans text-pink-600 tracking-wide">Kelly King</h1>
            <p className="text-lg mt-3 text-gray-700">Front End / Full Stack Engineer | Previously at Twitter and Tumblr</p>
          </div>
            <Image
              src="/bae.jpg"
              alt="Kelly and Freya in Wales"
              width={300}
              height={200}
              className='rounded-lg shadow-md'
            />
        </div>
        <motion.div
          className="absolute -bottom-4 left-0 right-0 h-4 bg-[url('https://www.transparenttextures.com/patterns/knitted-netting.png')] opacity-10"
        />
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 grid gap-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-pink-700 mb-4">About Me</h2>
          <div className="leading-relaxed text-lg">
            <p className="my-8">👋 Hey there! I&#39;m Kelly King — a front end (occasionally full stack) engineer with 13 years of experience. I&#39;ve helped scale platforms like Tumblr and Twitter, shipping features that reach millions while mentoring engineers and championing inclusive, user-focused experiences.</p>
            <p className="my-8">I love turning ideas into polished, high-impact products — whether it&apos;s building a better notification system, launching paid features, or reimagining community tools from the ground up. I&#39;ve worn many hats: IC, tech lead, hack week ringleader, and conference organizer. Whatever the role, I&#39;m here for the collaboration, curiosity, and a little chaos.</p>
            <p className="my-8">When I&#39;m not coding, you&#39;ll find me running the streets of London, crocheting something colorful, or spending time with my dogs.</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <WorkExperience />
      </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-pink-700 mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <Project
                key={i}
                project={project}
                onClick={() => {
                  setActiveProjectIndex(i);
                  setActiveProject(project);
                }}
              />
            ))}
          </div>

          <AnimatePresence>
            {activeProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-white rounded-xl shadow-lg max-w-md p-6 relative"
                >
                  <button
                    onClick={() => setActiveProject(null)}
                    className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                  <Image
                    src={activeProject.img}
                    alt={activeProject.title}
                    width={400}
                    height={300}
                      className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-2xl font-bold text-indigo-700 mb-2">{activeProject.title}</h3>
                  <p className="text-gray-700 mb-2">{activeProject.desc}</p>
                  <p className="text-sm text-gray-500">{activeProject.details}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-pink-700 mb-4">Blog</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-bold text-indigo-700">Running and Flow State</h3>
            <p className="text-gray-700 mt-2">
              Thoughts on how long-distance running parallels deep work in engineering. Discover the harmony between mind and motion.
            </p>
          </div>
        </motion.section> */}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <BlogSection posts={posts} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-pink-700 mb-4">More About Me</h2>
          <p className="mb-6 text-lg">
            Outside of tech, I&apos;m always in motion or making something with my hands. You can follow along on{' '}
            <a href="https://instagram.com/freya.the.boston" target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline">Freya the Boston</a>,{' '}
            <a href="https://instagram.com/kelly.makes.things" target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline">Kelly Makes Things</a>,{' '}
            or <a href="https://www.strava.com/athletes/13003172" target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline">my Strava profile</a>.
          </p>
          <div className="relative overflow-hidden">
            <button
              onClick={() => navigatePhotos('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow px-2 py-1 z-10"
            >
              ◀
            </button>
            <div className="flex gap-4 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${slideIndex * 25}%)` }}>
              {photos.map((src, i) => (
                 <Image
                  key={i}
                  src={src}
                  alt="Personal"
                  width={400}
                  height={300}
                  onClick={() => {
                    setActivePhotoIndex(i);
                    setActivePhoto(src);
                  }}
                  className="rounded-lg shadow-md object-cover w-full h-48 max-w-[33%] cursor-pointer hover:opacity-90 transition"
                />
              ))}
            </div>
            <button
              onClick={() => navigatePhotos('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow px-2 py-1 z-10"
            >
              ▶
            </button>
          </div>
          <AnimatePresence>
            {activePhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="relative max-w-3xl w-full p-4"
                >
                  <button
                    onClick={() => setActivePhoto(null)}
                    className="absolute top-2 right-4 text-white text-2xl hover:text-gray-300"
                  >
                    ×
                  </button>
                   {activePhoto ? (<Image
                    src={activePhoto}
                    alt="Zoomed"
                    width={1200}
                    height={900}
                    className="rounded-lg shadow-lg w-full max-h-[90vh] object-contain"
                  />): null}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-pink-700 mb-4">Contact</h2>
          <form className="flex flex-col gap-4 max-w-md">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit">Get in touch</Button>
          </form>
        </motion.section>
      </main>
      <footer className="text-center mt-16 py-6 bg-gradient-to-r from-indigo-100 to-pink-100 text-sm text-gray-600">
        <NowPlaying />
        &copy; {new Date().getFullYear()} Kelly King. Made with 💖 and curiosity.
      </footer>
    </div>
  );
}

