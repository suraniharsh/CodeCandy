import { useState, useEffect, FormEvent } from 'react';
import { snippetService } from '../services/snippetService';
import { toast } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';

const LANGUAGES = ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'markdown'];

interface CreateSnippetFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  collectionId?: string;
}

export function CreateSnippetForm({ onSuccess, onCancel, collectionId: initialCollectionId }: CreateSnippetFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [collections, setCollections] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(initialCollectionId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCollections = async () => {
      const allCollections = await snippetService.getAllCollections();
      setCollections(allCollections || []);
    };
    loadCollections();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log('Creating snippet with collection:', selectedCollectionId);
      const snippetData = {
        title,
        description,
        code,
        language,
        tags,
        collectionId: selectedCollectionId || undefined,
        isFavorite: false
      };

      await snippetService.createSnippet(snippetData);
      toast.success('Snippet created successfully');
      onSuccess();
    } catch (error) {
      console.error('Failed to create snippet:', error);
      toast.error('Failed to create snippet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value.replace(/\s/g, ''));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      e.preventDefault();
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-dark-200 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth"
          placeholder="Enter snippet title"
          required
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
          placeholder="Describe your snippet"
          rows={3}
          required
        />
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-dark-200 mb-1">
          Code
        </label>
        <textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-dark-100 font-mono placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth code-font"
          placeholder="Paste your code here"
          rows={8}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-dark-200 mb-1">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="collection" className="block text-sm font-medium text-dark-200 mb-1">
            Collection
          </label>
          <select
            id="collection"
            value={selectedCollectionId}
            onChange={(e) => setSelectedCollectionId(e.target.value)}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth"
            disabled={!!initialCollectionId}
          >
            <option value="">None</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-dark-200 mb-1">
          Tags
        </label>
        <div className="relative">
          <div className="flex flex-wrap gap-2 p-2 bg-dark-700 border border-dark-600 rounded-md min-h-[42px] overflow-x-auto whitespace-nowrap scrollbar-hidden transition-smooth">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-primary-500/20 text-primary-400 whitespace-nowrap hover-fade"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((_, i) => i !== index))}
                  className="ml-1.5 text-primary-400 hover:text-primary-300 transition-smooth"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-dark-100 placeholder-dark-400 transition-smooth"
              placeholder={tags.length === 0 ? "Add tags (press Enter or comma to add)" : ""}
            />
          </div>
        </div>
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
            'Create Snippet'
          )}
        </button>
      </div>
    </form>
  );
} 