import React, { useEffect } from 'react';
import { NeuCard, NeuInput, NeuButton, FileUpload } from '../../components/common';
import { useDatabase } from '../../hooks/useDatabase';
import type { HeroContent } from '../../types';
import toast from 'react-hot-toast';

export const HeroCMS: React.FC = () => {
  const { data, loading, updateDocument, addDocument, fetchCollection } = useDatabase<HeroContent>('profile');
  
  const [formData, setFormData] = React.useState<HeroContent>({
    greeting: '',
    name: '',
    subtitle: '',
    shortIntro: '',
    typingWords: [],
    resumeUrl: '',
    profilePhotoUrl: ''
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypingWordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const words = e.target.value.split(',').map(w => w.trim());
    setFormData(prev => ({ ...prev, typingWords: words }));
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
      toast.success('Hero section updated successfully');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to update hero section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neu-text mb-2">Hero Section</h1>
        <p className="text-neu-muted">Manage the landing page content and appearance.</p>
      </div>

      <NeuCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NeuInput
              label="Greeting (e.g. Hello, I am)"
              name="greeting"
              value={formData.greeting}
              onChange={handleChange}
              required
            />
            <NeuInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <NeuInput
            label="Subtitle (e.g. Full Stack Developer)"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            required
          />
          
          <NeuInput
            label="Short Introduction"
            name="shortIntro"
            value={formData.shortIntro}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />

          <NeuInput
            label="Typing Words (comma separated)"
            value={formData.typingWords.join(', ')}
            onChange={handleTypingWordsChange}
            placeholder="React Developer, UI/UX Designer, Freelancer"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              label="Profile Photo (Upload from local)"
              currentUrl={formData.profilePhotoUrl}
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, profilePhotoUrl: url }))}
              accept="image/*"
              folder="profile"
            />
            <FileUpload
              label="Resume PDF (Upload from local)"
              currentUrl={formData.resumeUrl}
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, resumeUrl: url }))}
              accept="application/pdf"
              folder="resumes"
            />
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
