import React, { useEffect } from 'react';
import { NeuCard, NeuInput, NeuButton } from '../../components/common';
import { useDatabase } from '../../hooks/useDatabase';
import type { AboutContent } from '../../types';
import toast from 'react-hot-toast';

export const AboutCMS: React.FC = () => {
  const { data, loading, updateDocument, addDocument, fetchCollection } = useDatabase<AboutContent>('profile');
  
  const [formData, setFormData] = React.useState<AboutContent>({
    description: '',
    education: '',
    careerGoal: '',
    email: '',
    phone: '',
    location: ''
  });
  
  const [docId, setDocId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setFormData(data[0]);
      setDocId((data[0] as any).id);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Not needed anymore since we flattened the state, but kept for safety if other nested fields arise
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaving(true);
    try {
      if (docId) {
        await updateDocument(docId, formData);
      } else {
        const newId = await addDocument(formData);
        setDocId(newId);
      }
      toast.success('About section updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update about section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neu-text mb-2">About Section</h1>
        <p className="text-neu-muted">Manage your personal information, education, and goals.</p>
      </div>

      <NeuCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <NeuInput
            label="Detailed Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={5}
            required
          />
          
          <NeuInput
            label="Education Journey"
            name="education"
            value={formData.education}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />

          <NeuInput
            label="Career Goals"
            name="careerGoal"
            value={formData.careerGoal}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />

          <div className="pt-4 mt-6 border-t border-neu-muted/20">
            <h3 className="text-lg font-bold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeuInput
                label="Public Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
              <NeuInput
                label="Public Phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
              />
              <NeuInput
                label="Location (City, Country)"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <NeuButton type="submit" variant="primary" isLoading={saving}>
              Save Changes
            </NeuButton>
          </div>
        </form>
      </NeuCard>
    </div>
  );
};
