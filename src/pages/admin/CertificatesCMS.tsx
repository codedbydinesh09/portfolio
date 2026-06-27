import React, { useEffect, useState } from 'react';
import { NeuCard, NeuInput, NeuButton, FileUpload } from '../../components/common';
import { useDatabase } from '../../hooks/useDatabase';
import type { Certificate } from '../../types';
import toast from 'react-hot-toast';
import { FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';

export const CertificatesCMS: React.FC = () => {
  const { data: certificates, loading, fetchCollection, addDocument, updateDocument, deleteDocument } = useDatabase<Certificate>('certificates');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentCert, setCurrentCert] = useState<Partial<Certificate>>({
    name: '', issuer: '', date: '', imageUrl: '', credentialUrl: '', order: 0
  });

  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (cert: Certificate) => {
    setCurrentCert(cert);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentCert({ name: '', issuer: '', date: '', imageUrl: '', credentialUrl: '', order: certificates.length });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      await deleteDocument(id);
      toast.success('Certificate deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete certificate');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCert.id) {
        await updateDocument(currentCert.id, currentCert);
        toast.success('Certificate updated');
      } else {
        await addDocument(currentCert as Omit<Certificate, 'id'>);
        toast.success('Certificate added');
      }
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save certificate');
    }
  };

  if (loading && !isEditing) return <div>Loading...</div>;

  const sortedCerts = [...certificates].sort((a, b) => a.order - b.order);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neu-text mb-2">Certificates Manager</h1>
          <p className="text-neu-muted">Manage your certificates and achievements.</p>
        </div>
        {!isEditing && (
          <NeuButton variant="primary" onClick={handleAddNew} className="gap-2">
            <FiPlus /> Add Certificate
          </NeuButton>
        )}
      </div>

      {isEditing ? (
        <NeuCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center border-b border-[rgba(11,43,38,0.08)] pb-4">
              <h2 className="text-xl font-bold">{currentCert.id ? 'Edit Certificate' : 'New Certificate'}</h2>
              <NeuButton type="button" onClick={() => setIsEditing(false)} size="sm">Cancel</NeuButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeuInput label="Certificate Name" value={currentCert.name} onChange={e => setCurrentCert({...currentCert, name: e.target.value})} required />
              <NeuInput label="Issuer Organization" value={currentCert.issuer} onChange={e => setCurrentCert({...currentCert, issuer: e.target.value})} required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeuInput label="Date (e.g. June 2024)" value={currentCert.date} onChange={e => setCurrentCert({...currentCert, date: e.target.value})} required />
              <NeuInput label="Display Order" type="number" value={currentCert.order} onChange={e => setCurrentCert({...currentCert, order: parseInt(e.target.value)})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload 
                label="Certificate Image" 
                currentUrl={currentCert.imageUrl} 
                onUploadSuccess={url => setCurrentCert({...currentCert, imageUrl: url})} 
                accept="image/*"
                folder="certificates"
              />
              <NeuInput label="Credential URL (Optional)" value={currentCert.credentialUrl} onChange={e => setCurrentCert({...currentCert, credentialUrl: e.target.value})} />
            </div>
            
            <div className="flex justify-end pt-4">
              <NeuButton type="submit" variant="primary">Save Certificate</NeuButton>
            </div>
          </form>
        </NeuCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedCerts.length === 0 && (
            <div className="col-span-full py-12 text-center text-neu-muted">
              No certificates found. Add your first certificate!
            </div>
          )}
          {sortedCerts.map(cert => (
            <NeuCard key={cert.id} className="flex flex-col gap-4">
              <div className="w-full h-40 bg-[rgba(11,43,38,0.08)] rounded-xl overflow-hidden">
                {cert.imageUrl ? (
                  <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neu-muted">No Image</div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{cert.name}</h3>
                <p className="text-sm text-neu-muted mt-1">{cert.issuer} • {cert.date}</p>
                <p className="text-xs text-neu-muted mt-1">Order: {cert.order}</p>
              </div>
              <div className="flex gap-2 mt-auto pt-4 border-t border-[rgba(11,43,38,0.08)]">
                <NeuButton type="button" variant="icon" onClick={() => handleEdit(cert)} className="flex-1"><FiEdit2 /></NeuButton>
                <NeuButton type="button" variant="icon" onClick={() => handleDelete(cert.id)} className="flex-1 !text-[var(--error)]"><FiTrash2 /></NeuButton>
              </div>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  );
};
