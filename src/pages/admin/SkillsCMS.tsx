import React, { useEffect, useState } from 'react';
import { NeuCard, NeuInput, NeuButton } from '../../components/common';
import { useDatabase } from '../../hooks/useDatabase';
import type { Skill } from '../../types';
import toast from 'react-hot-toast';
import { FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';

export const SkillsCMS: React.FC = () => {
  const { data: skills, loading, fetchCollection, addDocument, updateDocument, deleteDocument } = useDatabase<Skill>('skills');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>({
    name: '', category: 'Frontend', icon: '', order: 0, isVisible: true
  });

  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Programming Languages'];

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentSkill({ name: '', category: 'Frontend', icon: '', order: skills.length, isVisible: true });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await deleteDocument(id);
      toast.success('Skill deleted');
      fetchCollection();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete skill');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentSkill.id) {
        await updateDocument(currentSkill.id, currentSkill);
        toast.success('Skill updated');
      } else {
        await addDocument(currentSkill as Omit<Skill, 'id'>);
        toast.success('Skill added');
      }
      setIsEditing(false);
      fetchCollection();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save skill');
    }
  };

  if (loading && !isEditing) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neu-text mb-2">Skills</h1>
          <p className="text-neu-muted">Manage your technical skills and expertise.</p>
        </div>
        {!isEditing && (
          <NeuButton variant="primary" onClick={handleAddNew} className="gap-2">
            <FiPlus /> Add Skill
          </NeuButton>
        )}
      </div>

      {isEditing ? (
        <NeuCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center border-b border-neu-muted/20 pb-4">
              <h2 className="text-xl font-bold">{currentSkill.id ? 'Edit Skill' : 'New Skill'}</h2>
              <NeuButton type="button" onClick={() => setIsEditing(false)} size="sm">Cancel</NeuButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeuInput label="Skill Name" value={currentSkill.name} onChange={e => setCurrentSkill({...currentSkill, name: e.target.value})} required />
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neu-text ml-2">Category</label>
                <select 
                  className="w-full bg-neu-bg text-neu-text rounded-xl p-4 shadow-neu-inset outline-none transition-shadow duration-300 focus:shadow-[inset_4px_4px_8px_#C3C9D6,inset_-4px_-4px_8px_#FFFFFF,0_0_0_2px_rgba(49,151,149,0.3)]"
                  value={currentSkill.category} 
                  onChange={e => setCurrentSkill({...currentSkill, category: e.target.value as any})}
                  required
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeuInput label="Icon (React Icons Name, e.g. FaReact)" value={currentSkill.icon} onChange={e => setCurrentSkill({...currentSkill, icon: e.target.value})} />
              <NeuInput label="Display Order" type="number" value={currentSkill.order} onChange={e => setCurrentSkill({...currentSkill, order: parseInt(e.target.value)})} />
            </div>
            
            <div className="flex justify-end pt-4">
              <NeuButton type="submit" variant="primary">Save Skill</NeuButton>
            </div>
          </form>
        </NeuCard>
      ) : (
        <div className="space-y-8">
          {categories.map(category => {
            const categorySkills = skills.filter(s => s.category === category).sort((a, b) => a.order - b.order);
            if (categorySkills.length === 0) return null;
            
            return (
              <div key={category}>
                <h2 className="text-xl font-bold mb-4 ml-2">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {categorySkills.map(skill => (
                    <NeuCard key={skill.id} className="flex justify-between items-center" padding="p-4">
                      <div>
                        <h3 className="font-bold">{skill.name}</h3>
                        <p className="text-xs text-neu-muted mt-1">{skill.icon || 'No icon'} | Order: {skill.order}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(skill)} className="text-primary hover:text-primary-hover p-2"><FiEdit2 /></button>
                        <button onClick={() => handleDelete(skill.id)} className="text-red-500 hover:text-red-600 p-2"><FiTrash2 /></button>
                      </div>
                    </NeuCard>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
