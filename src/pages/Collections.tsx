import { useState, useEffect } from 'react';
import { FiFolder, FiCode, FiChevronRight, FiLoader, FiShare2, FiTrash2 } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { snippetService, type Collection, type Snippet } from '../services/snippetService';
import { Modal } from '../components/Modal';
import { CreateCollectionForm } from '../components/CreateCollectionForm';
import { CreateSnippetForm } from '../components/CreateSnippetForm';
import { SnippetCard } from '../components/SnippetCard';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

function Collections() {
  const { user } = useAuth();
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showSnippetModal, setShowSnippetModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCollection, setShareCollection] = useState<Collection | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [snippetCounts, setSnippetCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { id: sharedCollectionId } = useParams();
  const [isTogglingPublic, setIsTogglingPublic] = useState(false);

  useEffect(() => {
    if (sharedCollectionId) {
      loadSharedCollection(sharedCollectionId);
    } else {
      loadCollections();
    }
  }, [sharedCollectionId, user]);

  const loadSharedCollection = async (id: string) => {
    try {
      setLoading(true);
      console.log('Loading shared collection:', id, 'User:', user?.uid);

      // First, try to get the collection
      const collection = await snippetService.getCollectionById(id);
      console.log('Found collection:', collection);

      if (!collection) {
        console.log('Collection not found');
        toast.error('Collection not found');
        navigate('/collections');
        return;
      }

      // Check access permissions
      if (!collection.isPublic && (!user || collection.userId !== user.uid)) {
        console.log('Collection is private and user does not have access');
        if (!user) {
          toast.error('Please log in to view this collection');
          navigate('/login');
        } else {
          toast.error('You do not have access to this collection');
          navigate('/collections');
        }
        return;
      }

      // Load the collection and its snippets
      console.log('Loading collection snippets');
      setSelectedCollection(collection);
      const collectionSnippets = await snippetService.getSnippetsByCollectionId(id);
      console.log('Loaded snippets:', collectionSnippets);
      setSnippets(collectionSnippets);
      setSnippetCounts({ [id]: collectionSnippets.length });
    } catch (error) {
      console.error('Error loading shared collection:', error);
      toast.error('Failed to load collection');
      navigate('/collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === '/collections/create') {
      setShowCollectionModal(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (selectedCollection) {
      loadSnippets(selectedCollection.id);
    } else {
      setSnippets([]);
    }
  }, [selectedCollection]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const fetchedCollections = await snippetService.getAllCollections();
      setCollections(fetchedCollections);

      // Load snippet counts for each collection
      const counts: Record<string, number> = {};
      await Promise.all(
        fetchedCollections.map(async (collection) => {
          const collectionSnippets = await snippetService.getSnippetsByCollectionId(collection.id);
          counts[collection.id] = collectionSnippets.length;
        })
      );
      setSnippetCounts(counts);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSnippets = async (collectionId: string) => {
    try {
      console.log('Loading snippets for collection:', collectionId);
      const loadedSnippets = await snippetService.getSnippetsByCollectionId(collectionId);
      console.log('Loaded snippets:', loadedSnippets);

      if (!loadedSnippets || loadedSnippets.length === 0) {
        console.log('No snippets found for collection');
        setSnippets([]);
        setSnippetCounts(prev => ({
          ...prev,
          [collectionId]: 0
        }));
        return;
      }

      setSnippets(loadedSnippets);
      setSnippetCounts(prev => ({
        ...prev,
        [collectionId]: loadedSnippets.length
      }));
    } catch (error) {
      console.error('Error loading snippets:', error);
      toast.error('Failed to load snippets');
      setSnippets([]);
      setSnippetCounts(prev => ({
        ...prev,
        [collectionId]: 0
      }));
    }
  };

  const handleCreateSuccess = () => {
    setShowCollectionModal(false);
    setShowSnippetModal(false);
    loadCollections();
    if (selectedCollection) {
      loadSnippets(selectedCollection.id);
    }
    if (location.pathname === '/collections/create') {
      navigate('/collections');
    }
  };

  const handleModalClose = () => {
    setShowCollectionModal(false);
    if (location.pathname === '/collections/create') {
      navigate('/collections');
    }
  };

  const handleDeleteCollection = async (collectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this collection? All snippets in this collection will also be deleted.')) return;

    try {
      await snippetService.deleteCollection(collectionId);
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(null);
      }
      loadCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection. Please try again.');
    }
  };

  const handleShareCollection = async (collection: Collection, event: React.MouseEvent) => {
    event.stopPropagation();
    setShareCollection(collection);
    setShowShareModal(true);
  };

  const handleTogglePublic = async (collection: Collection) => {
    if (isTogglingPublic) return;

    try {
      setIsTogglingPublic(true);
      const updatedCollection = {
        ...collection,
        isPublic: !collection.isPublic
      };
      await snippetService.updateCollection(updatedCollection);

      // Update the collection in state
      setShareCollection(updatedCollection);
      setCollections(prevCollections =>
        prevCollections.map(c =>
          c.id === collection.id ? updatedCollection : c
        )
      );

      toast.success(
        updatedCollection.isPublic
          ? 'Collection is now public'
          : 'Collection is now private'
      );
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('Failed to update collection visibility');
    } finally {
      setIsTogglingPublic(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center md:justify-start w-full  min-w-[18rem] mr-auto">
      <div className="flex justify-between mb-6 mr-auto items-left">
        <h1 className="mr-auto text-3xl font-bold text-dark-100">Collections</h1>

        <div className="flex space-x-3">
          {user && (
            <>
              <Link to="/create">...</Link>
              <Link to="/collections/create">...</Link>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full gap-6">
        {/* Collections Sidebar */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden border rounded-lg shadow-xl bg-dark-800 border-dark-700">
            <div className="p-4 border-b border-dark-700 bg-dark-700/50">
              <h2 className="text-lg font-semibold text-dark-100">Your Collections</h2>
            </div>
            <div className="divide-y divide-dark-700">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className={`w-full text-left p-4 transition-smooth group relative hover:translate-x-1 cursor-pointer ${selectedCollection?.id === collection.id
                      ? 'bg-primary-900/20 text-primary-400 hover:bg-primary-900/30'
                      : 'text-dark-300 hover:bg-dark-700/50'
                    }`}
                  onClick={() => setSelectedCollection(collection)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiFolder className={`h-5 w-5 ${selectedCollection?.id === collection.id ? 'text-primary-400' : 'text-dark-400'}`} />
                      <div>
                        <span className="block font-medium">{collection.name}</span>
                        <span className="text-sm text-dark-400">
                          {snippetCounts[collection.id] || 0} snippets
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleShareCollection(collection, e)}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 text-dark-400 hover:text-primary-400 transition-smooth hover:bg-dark-600"
                      >
                        <FiShare2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCollection(collection.id, e)}
                        className="p-1 text-red-400 rounded opacity-0 group-hover:opacity-100 hover:text-red-300 transition-smooth hover:bg-dark-600"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                      <FiChevronRight className={`h-4 w-4 transition-transform ${selectedCollection?.id === collection.id ? 'rotate-90 text-primary-400' : 'text-dark-500'}`} />
                    </div>
                  </div>
                </div>
              ))}

              {collections.length === 0 && (
                <div className="p-8 text-center">
                  <FiFolder className="w-12 h-12 mx-auto mb-4 text-dark-400" />
                  <p className="mb-2 text-dark-400">No collections yet</p>
                  <button
                    onClick={() => setShowCollectionModal(true)}
                    className="text-sm text-primary-400 hover:text-primary-300 transition-smooth"
                  >
                    Create your first collection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="lg:col-span-3">
          {selectedCollection ? (
            <div className="p-6 border rounded-lg shadow-xl bg-dark-800 border-dark-700">
              <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold text-dark-100">
                  {selectedCollection.name}
                </h2>
                <p className="text-dark-300">
                  {selectedCollection.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {snippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
              </div>

              {snippets.length === 0 && (
                <div className="py-12 text-center">
                  <FiCode className="w-12 h-12 mx-auto mb-4 text-dark-400" />
                  <p className="mb-2 text-dark-400">No snippets in this collection</p>
                  <button
                    onClick={() => setShowSnippetModal(true)}
                    className="text-sm text-primary-400 hover:text-primary-300 transition-smooth"
                  >
                    Add your first snippet
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center border rounded-lg shadow-xl bg-dark-800 border-dark-700">
              <FiFolder className="w-16 h-16 mx-auto mb-4 text-dark-400" />
              <h2 className="mb-2 text-xl font-semibold text-dark-100">
                Select a Collection
              </h2>
              <p className="text-dark-400">
                Choose a collection from the sidebar to view its snippets
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      <Modal
        isOpen={showCollectionModal}
        onClose={handleModalClose}
        title="Create New Collection"
      >
        <CreateCollectionForm
          onSuccess={handleCreateSuccess}
          onCancel={handleModalClose}
        />
      </Modal>

      {/* Create Snippet Modal */}
      <Modal
        isOpen={showSnippetModal}
        onClose={() => setShowSnippetModal(false)}
        title="Create New Snippet"
      >
        <CreateSnippetForm
          collectionId={selectedCollection?.id}
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowSnippetModal(false)}
        />
      </Modal>

      {/* Share Collection Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Collection"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-medium text-dark-100">
              Share "{shareCollection?.name}"
            </h3>
            <p className="text-sm text-dark-400">
              Share this collection with others. They will be able to view and copy all snippets in this collection.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded form-checkbox bg-dark-700 border-dark-600 text-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  checked={shareCollection?.isPublic || false}
                  onChange={() => shareCollection && handleTogglePublic(shareCollection)}
                  disabled={isTogglingPublic}
                />
                <span className="text-dark-200">Make collection public</span>
              </label>
              <p className="mt-1 ml-6 text-sm text-dark-400">
                Anyone with the link can view this collection
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                readOnly
                value={shareCollection?.isPublic
                  ? `${window.location.origin}/collections/${shareCollection?.id}`
                  : 'Make the collection public to get a shareable link'}
                className="w-full px-3 py-2 pr-20 border rounded-md bg-dark-700 border-dark-600 text-dark-100"
              />
              {shareCollection?.isPublic && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/collections/${shareCollection?.id}`);
                    toast.success('Link copied to clipboard');
                  }}
                  className="absolute px-3 py-1 text-sm text-white -translate-y-1/2 rounded right-2 top-1/2 bg-primary-500 hover:bg-primary-600 transition-smooth"
                >
                  Copy
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              onClick={() => setShowShareModal(false)}
              className="px-4 py-2 text-dark-300 hover:text-dark-100 transition-smooth"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Collections;
