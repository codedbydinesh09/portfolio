import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function useDatabase<T>(tableName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const channelRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  const fetchData = async () => {
    let query = supabase.from(tableName).select('*');
    
    // Sort logic based on common portfolio tables
    if (['skills', 'projects', 'certificates'].includes(tableName)) {
      query = query.order('order', { ascending: true });
    } else if (['contact', 'contactMessages'].includes(tableName)) {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data: fetchedData, error: fetchError } = await query;
    if (fetchError) throw fetchError;
    return fetchedData;
  };

  const fetchCollection = async () => {
    setLoading(true);
    
    try {
      const fetchedData = await fetchData();
      setData(fetchedData as unknown as T[]);
      setError(null);
      
      // Realtime subscription
      if (!channelRef.current) {
        channelRef.current = supabase
          .channel(`public:${tableName}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, async () => {
            try {
              const newData = await fetchData();
              setData(newData as unknown as T[]);
            } catch (e) {
              console.error("Realtime fetch error:", e);
            }
          })
          .subscribe();
      }
    } catch (err: any) {
      console.error(`Error fetching ${tableName}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getDocument = async (id: string): Promise<T | null> => {
    try {
      const { data: docData, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      return docData as unknown as T;
    } catch (err: any) {
      console.error(`Error fetching document ${id} from ${tableName}:`, err);
      return null;
    }
  };

  const addDocument = async (documentData: Omit<T, 'id'>) => {
    try {
      const { data: newDoc, error: insertError } = await supabase
        .from(tableName)
        .insert([documentData as any])
        .select()
        .single();
        
      if (insertError) throw insertError;
      return newDoc.id;
    } catch (err: any) {
      console.error(`Error adding document to ${tableName}:`, err);
      throw err;
    }
  };

  const updateDocument = async (id: string, updateData: Partial<T>) => {
    try {
      const { error: updateError } = await supabase
        .from(tableName)
        .update(updateData as any)
        .eq('id', id);
        
      if (updateError) throw updateError;
    } catch (err: any) {
      console.error(`Error updating document ${id} in ${tableName}:`, err);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
    } catch (err: any) {
      console.error(`Error deleting document ${id} from ${tableName}:`, err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    fetchCollection,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument
  };
}
