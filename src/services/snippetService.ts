import { db, auth } from '../config/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, setDoc } from 'firebase/firestore';

export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: number;
  collectionId?: string;
  userId?: string;
  isFavorite: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  snippetIds: string[];
  createdAt: number;
  updatedAt?:number;
  userId?: string;
  isPublic?: boolean;
}

class SnippetService {
  private snippetsCollection = collection(db, 'snippets');
  private collectionsCollection = collection(db, 'collections');
  private favoritesCollection = collection(db, 'favorites');

  private getLocalCollections(): Collection[] {
    const collections = localStorage.getItem('collections');
    return collections ? JSON.parse(collections) : [];
  }

  private setLocalCollections(collections: Collection[]) {
    localStorage.setItem('collections', JSON.stringify(collections));
  }

  private getLocalSnippets(): Snippet[] {
    const snippets = localStorage.getItem('snippets');
    return snippets ? JSON.parse(snippets) : [];
  }

  private setLocalSnippets(snippets: Snippet[]) {
    localStorage.setItem('snippets', JSON.stringify(snippets));
  }

  async createSnippet(data: Omit<Snippet, 'id' | 'createdAt'>): Promise<Snippet> {
    const newSnippet = {
      ...data,
      createdAt: Date.now(),
      collectionId: data.collectionId || undefined
    };

    if (auth.currentUser) {
      console.log('Creating snippet with data:', newSnippet);
      const docRef = await addDoc(this.snippetsCollection, {
        ...newSnippet,
        userId: auth.currentUser.uid
      });
      const createdSnippet = {
        ...newSnippet,
        id: docRef.id,
        userId: auth.currentUser.uid
      } as Snippet;
      console.log('Created snippet:', createdSnippet);
      return createdSnippet;
    } else {
      const snippets = this.getLocalSnippets();
      const id = `local_${Date.now()}`;
      const snippet = { ...newSnippet, id } as Snippet;
      snippets.push(snippet);
      this.setLocalSnippets(snippets);
      return snippet;
    }
  }

  async createCollection(data: Omit<Collection, 'id' | 'createdAt'>): Promise<Collection> {
    const newCollection = {
      ...data,
      createdAt: Date.now(),
    };

    if (auth.currentUser) {
      const docRef = await addDoc(this.collectionsCollection, {
        ...newCollection,
        userId: auth.currentUser.uid
      });
      return {
        ...newCollection,
        id: docRef.id
      } as Collection;
    } else {
      const collections = this.getLocalCollections();
      const id = `local_${Date.now()}`;
      const collection = { ...newCollection, id } as Collection;
      collections.push(collection);
      this.setLocalCollections(collections);
      return collection;
    }
  }

  async getAllCollections(): Promise<Collection[]> {
    if (auth.currentUser) {
      try {
        const q = query(this.collectionsCollection, where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Collection));
      } catch (error) {
        console.error('Error getting collections:', error);
        return [];
      }
    } else {
      return this.getLocalCollections();
    }
  }

  async getAllSnippets(): Promise<Snippet[]> {
    if (auth.currentUser) {
      try {
        const q = query(this.snippetsCollection, where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Snippet));
      } catch (error) {
        console.error('Error getting snippets:', error);
        return [];
      }
    } else {
      return this.getLocalSnippets();
    }
  }

  async getSnippetById(id: string): Promise<Snippet | null> {
    try {
      // First try to get from local storage for non-authenticated users
      if (!auth.currentUser) {
        const snippets = this.getLocalSnippets();
        const localSnippet = snippets.find(s => s.id === id);
        if (localSnippet) return localSnippet;
      }

      // If not found in local storage or user is authenticated, try Firestore
      const docRef = doc(this.snippetsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Snippet;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting snippet:', error);
      return null;
    }
  }

  async getCollectionById(id: string): Promise<Collection | null> {
    try {
      // Always try Firestore first
      const docRef = doc(this.collectionsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const collection = { id: docSnap.id, ...docSnap.data() } as Collection;
        console.log('Found collection in Firestore:', collection);
        
        // If collection is public, return it
        if (collection.isPublic) {
          return collection;
        }
        
        // If user is authenticated and owns the collection, return it
        if (auth.currentUser && collection.userId === auth.currentUser.uid) {
          return collection;
        }
      } else {
        console.log('Collection document does not exist in Firestore');
        
        // If not found in Firestore, try local storage
        const collections = this.getLocalCollections();
        const localCollection = collections.find(c => c.id === id);
        console.log('Found collection in local storage:', localCollection);
        
        if (localCollection?.isPublic) {
          return localCollection;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting collection:', error);
      return null;
    }
  }

  async updateCollection(collection: Collection): Promise<void> {
    if (auth.currentUser) {
      const docRef = doc(this.collectionsCollection, collection.id);
      const { id, ...collectionData } = collection;
      await updateDoc(docRef, collectionData);
    } else {
      const collections = this.getLocalCollections();
      const index = collections.findIndex(c => c.id === collection.id);
      if (index !== -1) {
        collections[index] = collection;
        this.setLocalCollections(collections);
      }
    }
  }

  async deleteCollection(id: string): Promise<void> {
    const snippets = await this.getSnippetsByCollectionId(id);
    
    if (auth.currentUser) {
      // Delete all snippets in the collection
      await Promise.all(snippets.map(snippet => 
        deleteDoc(doc(this.snippetsCollection, snippet.id))
      ));
      // Delete the collection
      await deleteDoc(doc(this.collectionsCollection, id));
    } else {
      // Delete all snippets in local storage
      const allSnippets = this.getLocalSnippets();
      this.setLocalSnippets(allSnippets.filter(s => s.collectionId !== id));
      // Delete the collection
      const collections = this.getLocalCollections();
      this.setLocalCollections(collections.filter(c => c.id !== id));
    }
  }

  async deleteSnippet(id: string): Promise<void> {
    if (auth.currentUser) {
      await deleteDoc(doc(this.snippetsCollection, id));
    } else {
      const snippets = this.getLocalSnippets();
      this.setLocalSnippets(snippets.filter(s => s.id !== id));
    }
  }

  async getFavorites(): Promise<string[]> {
    if (auth.currentUser) {
      const docRef = doc(this.favoritesCollection, auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data().snippetIds : [];
    } else {
      const favorites = localStorage.getItem('favorites');
      return favorites ? JSON.parse(favorites) : [];
    }
  }

  async toggleFavorite(snippetId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const isFavorite = favorites.includes(snippetId);
    const updatedFavorites = isFavorite
      ? favorites.filter(id => id !== snippetId)
      : [...favorites, snippetId];

    if (auth.currentUser) {
      const docRef = doc(this.favoritesCollection, auth.currentUser.uid);
      await setDoc(docRef, { snippetIds: updatedFavorites }, { merge: true });
    } else {
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
    return !isFavorite;
  }

  async searchSnippets(query: string): Promise<Snippet[]> {
    const snippets = await this.getAllSnippets();
    const searchTerm = query.toLowerCase();
    return snippets.filter(snippet =>
      snippet.title.toLowerCase().includes(searchTerm) ||
      snippet.description.toLowerCase().includes(searchTerm) ||
      snippet.code.toLowerCase().includes(searchTerm) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async getSnippetsByCollectionId(collectionId: string): Promise<Snippet[]> {
    try {
      // Get the collection first to check if it's public
      const collection = await this.getCollectionById(collectionId);
      console.log('Checking collection access:', collection);
      
      if (!collection) {
        console.log('Collection not found');
        return [];
      }

      // For public collections or if user owns it
      if (collection.isPublic || (auth.currentUser && collection.userId === auth.currentUser.uid)) {
        // Create a query for snippets
        const q = query(
          this.snippetsCollection,
          where('collectionId', '==', collectionId)
        );

        console.log('Fetching snippets for collection:', collectionId);
        const querySnapshot = await getDocs(q);
        const snippets = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Raw snippet data:', data);
          return {
            id: doc.id,
            ...data,
            collectionId: collectionId // Ensure collectionId is set
          } as Snippet;
        });
        console.log('Found snippets:', snippets);
        return snippets;
      }

      console.log('No access to collection snippets');
      return [];
    } catch (error) {
      console.error('Error getting snippets:', error);
      return [];
    }
  }

  async getFavoriteSnippets(): Promise<Snippet[]> {
    const favorites = await this.getFavorites();
    const snippets = await Promise.all(
      favorites.map(id => this.getSnippetById(id))
    );
    return snippets.filter((s): s is Snippet => s !== null);
  }

  async isFavorite(snippetId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.includes(snippetId);
  }

  async updateSnippet(snippet: Snippet): Promise<void> {
   
    if (auth.currentUser) {
      const docRef = doc(this.snippetsCollection, snippet.id);
      const { id, ...snippetData } = snippet;
      await updateDoc(docRef, snippetData);

    } else {
      const snippets = this.getLocalSnippets();
      const index = snippets.findIndex(s => s.id === snippet.id);
      if (index !== -1) {
        snippets[index] = snippet;
        this.setLocalSnippets(snippets);
      }
    }
  }

  async moveSnippetToCollection(snippetId: string, collectionId: string | null): Promise<void> {
    const snippet = await this.getSnippetById(snippetId);
    if (!snippet) return;

    if (collectionId) {
      const collection = await this.getCollectionById(collectionId);
      if (!collection) return;
    }

    await this.updateSnippet({
      ...snippet,
      collectionId: collectionId || undefined
    });

    if (auth.currentUser) {
      if (collectionId) {
        const collection = await this.getCollectionById(collectionId);
        if (collection && !collection.snippetIds.includes(snippetId)) {
          await this.updateCollection({
            ...collection,
            snippetIds: [...collection.snippetIds, snippetId]
          });
        }
      } else {
        const collections = await this.getAllCollections();
        for (const collection of collections) {
          if (collection.snippetIds.includes(snippetId)) {
            await this.updateCollection({
              ...collection,
              snippetIds: collection.snippetIds.filter(id => id !== snippetId)
            });
          }
        }
      }
    } else {
      const collections = this.getLocalCollections();
      const updatedCollections = collections.map(collection => {
        if (collectionId && collection.id === collectionId) {
          return {
            ...collection,
            snippetIds: collection.snippetIds.includes(snippetId) 
              ? collection.snippetIds 
              : [...collection.snippetIds, snippetId]
          };
        } else if (collection.snippetIds.includes(snippetId)) {
          return {
            ...collection,
            snippetIds: collection.snippetIds.filter(id => id !== snippetId)
          };
        }
        return collection;
      });
      this.setLocalCollections(updatedCollections);
    }
  }

  async duplicateSnippet(snippetId: string): Promise<Snippet> {
    const snippet = await this.getSnippetById(snippetId);
    if (!snippet) throw new Error('Snippet not found');

    const { id, createdAt, ...snippetData } = snippet;
    return this.createSnippet({
      ...snippetData,
      title: `${snippet.title} (Copy)`,
    });
  }
}

export const snippetService = new SnippetService(); 