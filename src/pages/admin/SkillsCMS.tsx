import React, { useEffect, useState } from 'react';
import { NeuCard, NeuButton, PremiumSkillCard } from '../../components/common';
import { useDatabase } from '../../hooks/useDatabase';
import type { Skill } from '../../types';
import toast from 'react-hot-toast';
import { FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';
import { Icon } from '@iconify/react';
import { parseSkillData, stringifySkillData } from '../../lib/skillUtils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const HARDCODED_CATEGORIES = [
  'Frontend',
  'Backend',
  'Programming Languages',
  'Database',
  'Frameworks',
  'Libraries',
  'Tools',
  'Version Control',
  'Cloud',
  'Design',
  'Other Technologies',
];

// Flat form state (matches what we display in the form)
interface SkillFormState {
  id?: string;
  name: string;
  category: string;
  iconName: string;
  customIcon: string;
  level: number;
  experience: string;
  projects: number;
  description: string;
  accentColor: string;
  featured: boolean;
  isVisible: boolean;
  order: number;
}

const DEFAULT_FORM: SkillFormState = {
  name: '',
  category: HARDCODED_CATEGORIES[0],
  iconName: '',
  customIcon: '',
  level: 0,
  experience: '',
  projects: 0,
  description: '',
  accentColor: '#319795',
  featured: false,
  isVisible: true,
  order: 0,
};

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

export const SkillsCMS: React.FC = () => {
  const {
    data: skills,
    loading: skillsLoading,
    fetchCollection: fetchSkills,
    addDocument: addSkill,
    updateDocument: updateSkill,
    deleteDocument: deleteSkill,
  } = useDatabase<Skill>('skills');

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<SkillFormState>(DEFAULT_FORM);

  useEffect(() => {
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Convert DB skill → form state
  const skillToForm = (skill: Skill): SkillFormState => {
    const parsed = parseSkillData(skill.icon);
    return {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      iconName: parsed.iconName || '',
      customIcon: parsed.customIcon || '',
      level: parsed.level,
      experience: parsed.experience || '',
      projects: parsed.projects,
      description: parsed.description || '',
      accentColor: parsed.accentColor || '#319795',
      featured: parsed.featured,
      isVisible: skill.isVisible,
      order: skill.order,
    };
  };

  // Convert form state → DB fields
  const formToSkill = (f: SkillFormState): Omit<Skill, 'id' | 'created_at'> => ({
    name: f.name,
    category: f.category,
    icon: stringifySkillData({
      iconName: f.iconName,
      customIcon: f.customIcon,
      level: f.level,
      experience: f.experience,
      projects: f.projects,
      description: f.description,
      accentColor: f.accentColor,
      featured: f.featured,
    }),
    order: f.order,
    isVisible: f.isVisible,
  });

  const handleEdit = (skill: Skill) => {
    setForm(skillToForm(skill));
    setIsEditing(true);
  };

  const handleNew = () => {
    setForm({ ...DEFAULT_FORM, order: skills.length });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Skill name is required'); return; }
    if (!form.category) { toast.error('Category is required'); return; }
    try {
      const dbData = formToSkill(form);
      if (form.id) {
        await updateSkill(form.id, dbData);
        toast.success('Skill updated!');
      } else {
        await addSkill(dbData);
        toast.success('Skill added!');
      }
      setIsEditing(false);
      fetchSkills();
    } catch (err: any) {
      console.error(err);
      toast.error('Save failed: ' + (err?.message || 'Check console'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await deleteSkill(id);
      toast.success('Skill deleted');
      fetchSkills();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;
    const oldIdx = skills.findIndex(s => s.id === active.id);
    const newIdx = skills.findIndex(s => s.id === over.id);
    const reordered = arrayMove(skills, oldIdx, newIdx);
    for (let i = 0; i < reordered.length; i++) {
      if (reordered[i].order !== i) {
        await updateSkill(reordered[i].id, { order: i });
      }
    }
    fetchSkills();
  };

  // Build a preview skill from current form
  const previewSkill: Skill = {
    id: 'preview',
    name: form.name || 'Skill Name',
    category: form.category,
    icon: stringifySkillData({
      iconName: form.iconName,
      customIcon: form.customIcon,
      level: form.level,
      experience: form.experience,
      projects: form.projects,
      description: form.description,
      accentColor: form.accentColor,
      featured: form.featured,
    }),
    order: 0,
    isVisible: true,
  };

  if (skillsLoading) return <div className="p-8 text-center text-neu-muted animate-pulse">Loading skills...</div>;

  return (
    <div className="animate-fade-in space-y-10 pb-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neu-text mb-2">Skills & Technologies</h1>
          <p className="text-neu-muted">Manage your premium interactive skill cards.</p>
        </div>
        {!isEditing && (
          <NeuButton variant="primary" onClick={handleNew}>
            <FiPlus className="inline mr-2" /> Add Skill
          </NeuButton>
        )}
      </div>

      {/* Form */}
      {isEditing && (
        <NeuCard className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
            <h2 className="text-xl font-bold">{form.id ? 'Edit Skill' : 'New Skill'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neu-text ml-2 block mb-1">Skill Name *</label>
                <input
                  className="w-full bg-neu-bg text-neu-text rounded-xl p-4 shadow-neu-inset outline-none transition-shadow"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. React"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neu-text ml-2 block mb-1">Category *</label>
                <select
                  className="w-full bg-neu-bg text-neu-text rounded-xl p-4 shadow-neu-inset outline-none transition-shadow"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  {HARDCODED_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neu-text ml-2 block mb-1">Icon Name (Iconify)</label>
                <input
                  className="w-full bg-neu-bg text-neu-text rounded-xl p-4 shadow-neu-inset outline-none"
                  value={form.iconName}
                  onChange={e => setForm(f => ({ ...f, iconName: e.target.value }))}
                  placeholder="e.g. devicon:react"
                />
                <p className="text-xs text-neu-muted ml-2 mt-1">Find icons at <span className="text-primary">icon-sets.iconify.design</span></p>
              </div>
              <div>
                <label className="text-sm font-medium text-neu-text ml-2 block mb-1">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    className="h-12 w-16 rounded-lg cursor-pointer bg-neu-bg shadow-neu-inset border-none"
                    value={form.accentColor}
                    onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
                  />
                  <input
                    className="flex-1 bg-neu-bg text-neu-text rounded-xl p-4 shadow-neu-inset outline-none"
                    value={form.accentColor}
                    onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-neu-text ml-2 block mb-1">Proficiency (0-100)</label>
                <input
                  type="number" min={0} max={100}
                  className="w-full bg-neu-bg text-neu-text rounded-xl p-4 shadow-neu-inset outline-none"
                  value={form.level}
                  onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neu-text ml-2 block mb-1">Experience</label>
                <input
                  className="w-full bg-neu-bg text-neu-text rounded-xl p-4 shadow-neu-inset outline-none"
                  value={form.experience}
                  onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                  placeholder="e.g. 2 Yrs"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neu-text ml-2 block mb-1">Projects</label>
                <input
                  type="number" min={0}
                  className="w-full bg-neu-bg text-neu-text rounded-xl p-4 shadow-neu-inset outline-none"
                  value={form.projects}
                  onChange={e => setForm(f => ({ ...f, projects: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-neu-text ml-2 block mb-1">Short Description</label>
              <textarea
                className="w-full bg-neu-bg text-neu-text rounded-xl p-4 shadow-neu-inset outline-none h-20"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of this skill..."
              />
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isVisible} onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))} />
                <span>Visible on Portfolio</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                <span>Featured</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-neu-text">Order</label>
                <input
                  type="number" min={0}
                  className="w-20 bg-neu-bg text-neu-text rounded-xl p-2 shadow-neu-inset outline-none text-center"
                  value={form.order}
                  onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neu-muted/20">
              <NeuButton type="button" onClick={() => setIsEditing(false)}>Cancel</NeuButton>
              <NeuButton type="submit" variant="primary">Save Skill</NeuButton>
            </div>
          </form>

          {/* Live Preview */}
          <div>
            <p className="text-sm font-bold text-neu-muted mb-4">Live Preview</p>
            <PremiumSkillCard skill={previewSkill} categoryName={form.category} />
          </div>
        </NeuCard>
      )}

      {/* Skills List grouped by category */}
      {skills.length === 0 && !isEditing ? (
        <div className="p-12 text-center text-neu-muted bg-neu-bg rounded-2xl shadow-neu-inset">
          No skills added yet. Click "Add Skill" to get started.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={skills.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {HARDCODED_CATEGORIES.map(cat => {
              const catSkills = skills
                .filter(s => s.category === cat)
                .sort((a, b) => a.order - b.order);
              if (catSkills.length === 0) return null;
              return (
                <div key={cat} className="space-y-3">
                  <h3 className="text-xl font-bold pl-3 border-l-4 border-primary">{cat}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catSkills.map(skill => {
                      const parsed = parseSkillData(skill.icon);
                      return (
                        <SortableItem key={skill.id} id={skill.id}>
                          <NeuCard className="flex justify-between items-center cursor-grab active:cursor-grabbing p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg bg-neu-bg shadow-neu-inset flex items-center justify-center"
                                style={{ color: parsed.accentColor || '#319795' }}
                              >
                                {parsed.iconName
                                  ? <Icon icon={parsed.iconName} className="text-2xl" />
                                  : <Icon icon="lucide:code" className="text-2xl text-neu-muted" />
                                }
                              </div>
                              <div>
                                <span className="font-bold block">{skill.name}</span>
                                <span className="text-xs text-neu-muted">{parsed.level}% proficiency</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => handleEdit(skill)}
                                className="p-2 text-primary hover:opacity-70"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                type="button"
                                onPointerDown={e => e.stopPropagation()}
                                onClick={() => handleDelete(skill.id)}
                                className="p-2 text-red-500 hover:opacity-70"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </NeuCard>
                        </SortableItem>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
