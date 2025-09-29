import { useState } from 'react';
import { snippetService } from '../services/snippetService';
import { toast } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';

interface CreateCollectionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateCollectionForm({ onSuccess, onCancel }: CreateCollectionFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await snippetService.createCollection({
        name: name.trim(),
        description: description.trim(),
        snippetIds: [],
      });
      toast.success('Collection created successfully');
      onSuccess();
    } catch (error) {
      console.error('Failed to create collection:', error);
      toast.error('Failed to create collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-dark-200 mb-1">
          Collection Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth"
          placeholder="e.g., React Hooks"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-dark-200 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth"
          placeholder="A brief description of your collection"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-dark-300 hover:text-dark-100 transition-smooth"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <FiLoader className="animate-spin" />
              Creating...
            </>
          ) : (
            'Create Collection'
          )}
        </button>
      </div>
    </form>
  );
} 