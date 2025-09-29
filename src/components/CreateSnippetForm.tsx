import { useState, useEffect, FormEvent, useRef } from 'react';
import { snippetService } from '../services/snippetService';
import { toast } from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { CodePreview } from '.';

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

  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Refs to focus or scroll to the error fields
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    const loadCollections = async () => {
      const allCollections = await snippetService.getAllCollections();
      setCollections(allCollections || []);
    };
    loadCollections();
  }, []);

  useEffect(() => {
    if (formSubmitted) {
      if (titleError && titleRef.current) {
        titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (descriptionError && descriptionRef.current) {
        descriptionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setFormSubmitted(false); // Reset submission flag
    }
  }, [formSubmitted, titleError, descriptionError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!title.trim()){
      setTitleError('Title is required.');
      hasError = true;
    } else {
      setTitleError('');
    }
    if (!description.trim()){
      setDescriptionError('Description is required.');
      hasError = true;
    } else {
      setDescriptionError('');
    }

    if (hasError) {
      setFormSubmitted(true);
      return;
    }

    if (!title.trim() || !description.trim() || isSubmitting) return;

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) setTitleError(''); // Clear error when user starts typing
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (descriptionError) setDescriptionError(''); // Clear error when user starts typing
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
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-dark-200 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          ref={titleRef}
          onChange={handleTitleChange}
          className={`w-full px-3 py-2 bg-dark-700 border ${titleError ? 'border-red-500' : 'border-dark-600'} rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 ${titleError ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary-500 focus:border-primary-500'} transition-smooth`}
          placeholder="Enter snippet title"
          required
        />
        {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-dark-200 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          ref={descriptionRef}
          onChange={handleDescriptionChange}
          className={`w-full px-3 py-2 bg-dark-700 border ${descriptionError ? 'border-red-500' : 'border-dark-600'} rounded-md text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 ${descriptionError ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary-500 focus:border-primary-500'} transition-smooth`}
          placeholder="Describe your snippet"
          rows={3}
          required
        />
        {descriptionError && <p className="text-red-500 text-sm mt-1">{descriptionError}</p>}
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-dark-200 mb-1">
          Code
        </label>
        <div className="relative">
          <CodePreview
            initialCode={code}
            language={language}
            onChange={setCode}
            readOnly={false}
            showSaveButton={false}
          />
        </div>
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