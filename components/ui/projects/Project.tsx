import { motion } from "framer-motion";
import Image from 'next/image'
import { ProjectType } from "@/types/Project";

export const Project = ({project, onClick}: {project: ProjectType, key: number, onClick: (project: ProjectType) => void}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={() => onClick(project)}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
    >
      <Image
        src={project.img}
        alt={project.title}
        width={400}
        height={300}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-indigo-700">{project.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{project.desc}</p>
      </div>
    </motion.div>
  );
}
