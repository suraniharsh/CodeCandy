import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { snippetService, type Snippet } from '../services/snippetService';
import toast from 'react-hot-toast';
import { EditSnippetForm } from '../components/EditSnippetForm';

function EditSnippet() {
  const navigate = useNavigate();
  const {id}=useParams<{ id: string }>();
  const [snippet,setSnippet]=useState<Snippet | null>(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    if(!id) return;
    loadSnippet();
  },[id])


  const loadSnippet = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const loadedSnippet = await snippetService.getSnippetById(id);
      if (!loadedSnippet) {
        toast.error('Snippet not found');
        navigate('/');
        return;
      }
      setSnippet(loadedSnippet);
    } catch (error) {
      console.error('Error loading snippet:', error);
      toast.error('Failed to load snippet');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate(`/snippet/${id}`);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-dark-100 mb-6">Edit Snippet</h1>
      <div className="bg-dark-800 rounded-lg border border-dark-700 shadow-xl p-6">
        {snippet && <EditSnippetForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          snippet={snippet}
        />}
        {
           !snippet &&  <p>Something went wrong</p>
        }
      </div>
    </div>
  );
}

export default EditSnippet; 