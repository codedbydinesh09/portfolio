import React, { useEffect, useState } from 'react';
import { NeuCard, NeuInput, NeuButton } from '../../components/common';
import { useDatabase } from '../../hooks/useDatabase';
import { useStorage } from '../../hooks/useStorage';
import type { Project } from '../../types';
import toast from 'react-hot-toast';
import { FiTrash2, FiUploadCloud, FiPlus, FiEdit2 } from 'react-icons/fi';

export const ProjectsCMS: React.FC = () => {
  const { data: projects, loading, fetchCollection, addDocument, updateDocument, deleteDocument } = useDatabase<Project>('projects');
  const { uploadFile, deleteFile, isUploading } = useStorage();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: '', description: '', featuredImage: '', images: [], techStack: [], category: '', status: 'Completed', order: 0, isVisible: true
  });

  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProject({ title: '', description: '', featuredImage: '', images: [], techStack: [], category: '', status: 'Completed', order: projects.length, isVisible: true });
    setIsEditing(true);
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      if (project.featuredImage) await deleteFile(project.featuredImage);
      for (const img of project.images) {
        const url = typeof img === 'string' ? img : img.url;
        await deleteFile(url);
      }
      await deleteDocument(project.id);
      toast.success('Project deleted successfully');
      fetchCollection();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete project');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProject.id) {
        await updateDocument(currentProject.id, currentProject);
        toast.success('Project updated successfully');
      } else {
        await addDocument(currentProject as Omit<Project, 'id'>);
        toast.success('Project added successfully');
      }
      setIsEditing(false);
      fetchCollection();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save project');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFeatured: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const url = await uploadFile(file, 'projects');
      if (isFeatured) {
        setCurrentProject(prev => ({ ...prev, featuredImage: url }));
      } else {
        setCurrentProject(prev => ({ ...prev, images: [...(prev.images || []), { url, description: '' }] }));
      }
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    }
  };

  const removeImage = async (url: string, isFeatured: boolean) => {
    try {
      await deleteFile(url);
      if (isFeatured) {
        setCurrentProject(prev => ({ ...prev, featuredImage: '' }));
      } else {
        setCurrentProject(prev => ({
          ...prev,
          images: (prev.images || []).filter(img => {
            const imgUrl = typeof img === 'string' ? img : img.url;
            return imgUrl !== url;
          })
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && !isEditing) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neu-text mb-2">Projects</h1>
          <p className="text-neu-muted">Manage your portfolio projects.</p>
        </div>
        {!isEditing && (
          <NeuButton variant="primary" onClick={handleAddNew} className="gap-2">
            <FiPlus /> Add Project
          </NeuButton>
        )}
      </div>

      {isEditing ? (
        <NeuCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center border-b border-neu-muted/20 pb-4">
              <h2 className="text-xl font-bold">{currentProject.id ? 'Edit Project' : 'New Project'}</h2>
              <NeuButton type="button" onClick={() => setIsEditing(false)} size="sm">Cancel</NeuButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeuInput label="Title" value={currentProject.title} onChange={e => setCurrentProject({...currentProject, title: e.target.value})} required />
              <NeuInput label="Category" value={currentProject.category} onChange={e => setCurrentProject({...currentProject, category: e.target.value})} required />
            </div>
            
            <NeuInput label="Description" value={currentProject.description} onChange={e => setCurrentProject({...currentProject, description: e.target.value})} multiline rows={4} required />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeuInput label="GitHub URL" value={currentProject.githubUrl || ''} onChange={e => setCurrentProject({...currentProject, githubUrl: e.target.value})} />
              <NeuInput label="Live Demo URL" value={currentProject.liveUrl || ''} onChange={e => setCurrentProject({...currentProject, liveUrl: e.target.value})} />
            </div>

            <NeuInput 
              label="Tech Stack (comma separated)" 
              value={(currentProject.techStack || []).join(', ')} 
              onChange={e => setCurrentProject({...currentProject, techStack: e.target.value.split(',').map(s => s.trim())})} 
            />

            <div className="space-y-4">
              <label className="text-sm font-medium ml-2">Featured Image</label>
              {currentProject.featuredImage ? (
                <div className="relative w-64 h-40 rounded-xl overflow-hidden shadow-neu">
                  <img src={currentProject.featuredImage} alt="Featured" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(currentProject.featuredImage!, true)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"><FiTrash2 /></button>
                </div>
              ) : (
                <div className="relative">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <NeuButton type="button" className="w-full h-32 border-2 border-dashed border-neu-muted/50 flex-col gap-2">
                    <FiUploadCloud className="text-3xl" />
                    <span>{isUploading ? 'Uploading...' : 'Click to Upload Featured Image'}</span>
                  </NeuButton>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium ml-2">Gallery Images</label>
              <div className="flex flex-col gap-4">
                {(currentProject.images || []).map((img, idx) => {
                  const imgUrl = typeof img === 'string' ? img : img.url;
                  const imgDesc = typeof img === 'string' ? '' : (img.description || '');
                  return (
                    <div key={idx} className="flex gap-4 items-center bg-neu-bg p-4 rounded-xl shadow-neu-inset">
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-neu shrink-0">
                        <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(imgUrl, false)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full text-xs"><FiTrash2 /></button>
                      </div>
                      <div className="flex-1">
                        <NeuInput
                          label="Image Description"
                          value={imgDesc}
                          onChange={(e) => {
                            const newImages = [...(currentProject.images || [])];
                            newImages[idx] = { url: imgUrl, description: e.target.value };
                            setCurrentProject(prev => ({ ...prev, images: newImages }));
                          }}
                          placeholder="Describe this image..."
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="relative w-32 h-32">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <NeuButton type="button" className="w-full h-full flex-col gap-2 border-2 border-dashed border-neu-muted/50">
                    <FiPlus className="text-xl" />
                  </NeuButton>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <NeuButton type="submit" variant="primary" isLoading={isUploading}>Save Project</NeuButton>
            </div>
          </form>
        </NeuCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(project => (
            <NeuCard key={project.id} className="flex flex-col">
              <div className="h-48 rounded-xl overflow-hidden shadow-neu-inset mb-4">
                <img src={project.featuredImage || 'https://via.placeholder.com/400x300?text=No+Image'} alt={project.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-neu-muted line-clamp-2 mb-4 flex-1">{project.description}</p>
              
              <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-neu-muted/20">
                <NeuButton variant="icon" size="sm" onClick={() => handleEdit(project)}><FiEdit2 /></NeuButton>
                <NeuButton variant="icon" size="sm" onClick={() => handleDelete(project)} className="text-red-500 hover:text-red-600"><FiTrash2 /></NeuButton>
              </div>
            </NeuCard>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-12 text-center text-neu-muted">No projects found. Add your first project!</div>
          )}
        </div>
      )}
    </div>
  );
};
