"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Plus, Trash2, Edit3 } from "lucide-react"
import { usePortfolio } from "@/contexts/portfolio-context"

interface Skill {
  id: string
  name: string
  level: number
  icon: string
  category: string
}

interface SkillsSectionProps {
  onDataChange: () => void
}

const categories = ["Programming", "Framework", "Frontend", "Backend", "Database", "Tools", "AI Tools"]

export default function SkillsSection({ onDataChange }: SkillsSectionProps) {
  const { data, updateSkills } = usePortfolio()
  const [skills, setSkills] = useState<Skill[]>(data.skills)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 50,
    icon: "",
    category: "Programming",
  })

  const filteredSkills =
    selectedCategory === "All" ? skills : skills.filter((skill) => skill.category === selectedCategory)

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      const skill: Skill = {
        id: Date.now().toString(),
        ...newSkill,
      }
      const updatedSkills = [...skills, skill]
      setSkills(updatedSkills)
      updateSkills(updatedSkills)
      setNewSkill({ name: "", level: 50, icon: "", category: "Programming" })
      onDataChange()
    }
  }

  const handleDeleteSkill = (id: string) => {
    const updatedSkills = skills.filter((skill) => skill.id !== id)
    setSkills(updatedSkills)
    updateSkills(updatedSkills)
    onDataChange()
  }

  const handleUpdateSkill = (id: string, field: keyof Skill, value: string | number) => {
    const updatedSkills = skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill))
    setSkills(updatedSkills)
    updateSkills(updatedSkills)
    onDataChange()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-8">
        <Settings className="text-blue-400 mr-3" size={28} />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Skills Management
        </h2>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedCategory === "All"
              ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
              : "bg-gray-700 text-gray-300 hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                : "bg-gray-700 text-gray-300 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Add New Skill */}
      <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Add New Skill</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Skill name"
            value={newSkill.name}
            onChange={(e) => setNewSkill((prev) => ({ ...prev, name: e.target.value }))}
            className="bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
          />
          <input
            type="text"
            placeholder="Icon (emoji)"
            value={newSkill.icon}
            onChange={(e) => setNewSkill((prev) => ({ ...prev, icon: e.target.value }))}
            className="bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
          />
          <select
            value={newSkill.category}
            onChange={(e) => setNewSkill((prev) => ({ ...prev, category: e.target.value }))}
            className="bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="range"
            min="0"
            max="100"
            value={newSkill.level}
            onChange={(e) => setNewSkill((prev) => ({ ...prev, level: Number.parseInt(e.target.value) }))}
            className="bg-gray-700/50 rounded-lg"
          />
          <motion.button
            onClick={handleAddSkill}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} className="mr-1" />
            Add
          </motion.button>
        </div>
        <div className="mt-2 text-gray-400 text-sm">Level: {newSkill.level}%</div>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Current Skills ({filteredSkills.length})</h3>

        <div className="space-y-3">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.id}
              className="bg-gray-700/30 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-all duration-300"
              layout
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {editingSkill === skill.id ? (
                    <>
                      <input
                        type="text"
                        value={skill.icon}
                        onChange={(e) => handleUpdateSkill(skill.id, "icon", e.target.value)}
                        className="w-12 bg-gray-700/50 text-white px-2 py-1 rounded text-center"
                        placeholder="🎯"
                      />
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => handleUpdateSkill(skill.id, "name", e.target.value)}
                        className="flex-1 bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={skill.category}
                        onChange={(e) => handleUpdateSkill(skill.id, "category", e.target.value)}
                        className="bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => handleUpdateSkill(skill.id, "level", Number.parseInt(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-blue-300 font-medium w-12 text-right">{skill.level}%</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl w-8 text-center">{skill.icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{skill.name}</div>
                        <div className="text-gray-400 text-sm">{skill.category}</div>
                      </div>
                      <div className="w-32 bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-blue-300 font-medium w-12 text-right">{skill.level}%</span>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <motion.button
                    onClick={() => setEditingSkill(editingSkill === skill.id ? null : skill.id)}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit3 size={16} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
