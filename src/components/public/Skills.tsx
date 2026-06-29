import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDatabase } from "../../hooks/useDatabase";
import type { Skill } from "../../types";
import { PremiumSkillCard } from "../common";

export const Skills: React.FC = () => {
  const { data: skillsData, loading: skillsLoading, fetchCollection: fetchSkills } = useDatabase<Skill>("skills");

  useEffect(() => {
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (skillsLoading) {
    return (
      <section id="skills" style={{ padding: "3.5rem 1.5rem", maxWidth: "80rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">My Skills</h2>
          <p className="text-neu-muted">Technologies and tools I work with.</p>
        </div>
        <div style={{ padding: "3rem", textAlign: "center", borderRadius: "1.5rem" }}>Loading skills...</div>
      </section>
    );
  }

  if (!skillsData || skillsData.length === 0) {
    return null;
  }

  const visibleSkills = skillsData
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="skills" style={{ padding: "3.5rem 1.5rem", maxWidth: "80rem", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">My Skills</h2>
        <p className="text-neu-muted" style={{ maxWidth: "42rem", margin: "0 auto" }}>
          Technologies, frameworks, and tools I use to build digital experiences.
        </p>
      </motion.div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        {visibleSkills.map((skill, index) => (
          <div
            key={skill.id}
            style={{ width: "280px", flexShrink: 0, flexGrow: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{ height: "100%" }}
            >
              <PremiumSkillCard
                skill={skill}
                categoryName={skill.category}
                className="h-full"
              />
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};
