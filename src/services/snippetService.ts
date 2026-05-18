import { supabase } from '../config/supabase';

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
  isPublic: boolean;
  favoritesCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  userId?: string;
  isPublic: boolean;
}

type SnippetRow = {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  created_at: string;
  collection_id: string | null;
  user_id: string | null;
  is_public: boolean;
  favorites_count: number;
};

type CollectionRow = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  user_id: string | null;
  is_public: boolean;
};

function rowToSnippet(row: SnippetRow, isFavorite = false): Snippet {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    code: row.code,
    language: row.language,
    tags: row.tags,
    createdAt: new Date(row.created_at).getTime(),
    collectionId: row.collection_id ?? undefined,
    userId: row.user_id ?? undefined,
    isFavorite,
    isPublic: row.is_public,
    favoritesCount: row.favorites_count,
  };
}

function rowToCollection(row: CollectionRow): Collection {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: new Date(row.created_at).getTime(),
    userId: row.user_id ?? undefined,
    isPublic: row.is_public,
  };
}

class SnippetService {
  private getLocalCollections(): Collection[] {
    const data = localStorage.getItem('collections');
    return data ? JSON.parse(data) : [];
  }

  private setLocalCollections(collections: Collection[]) {
    localStorage.setItem('collections', JSON.stringify(collections));
  }

  private getLocalSnippets(): Snippet[] {
    const data = localStorage.getItem('snippets');
    return data ? JSON.parse(data) : [];
  }

  private setLocalSnippets(snippets: Snippet[]) {
    localStorage.setItem('snippets', JSON.stringify(snippets));
  }

  private async currentUserId(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user.id ?? null;
  }

  async createSnippet(data: Omit<Snippet, 'id' | 'createdAt' | 'favoritesCount'>): Promise<Snippet> {
    const uid = await this.currentUserId();

    if (uid) {
      const { data: row, error } = await supabase
        .from('snippets')
        .insert({
          user_id: uid,
          collection_id: data.collectionId ?? null,
          title: data.title,
          description: data.description,
          code: data.code,
          language: data.language,
          tags: data.tags,
          is_public: data.isPublic ?? false,
        })
        .select()
        .single();
      if (error) throw error;
      return rowToSnippet(row as SnippetRow);
    } else {
      const snippets = this.getLocalSnippets();
      const snippet: Snippet = {
        ...data,
        id: `local_${Date.now()}`,
        createdAt: Date.now(),
        favoritesCount: 0,
      };
      snippets.push(snippet);
      this.setLocalSnippets(snippets);
      return snippet;
    }
  }

  async createCollection(data: Omit<Collection, 'id' | 'createdAt'>): Promise<Collection> {
    const uid = await this.currentUserId();

    if (uid) {
      const { data: row, error } = await supabase
        .from('collections')
        .insert({
          user_id: uid,
          name: data.name,
          description: data.description,
          is_public: data.isPublic ?? false,
        })
        .select()
        .single();
      if (error) throw error;
      return rowToCollection(row as CollectionRow);
    } else {
      const collections = this.getLocalCollections();
      const col: Collection = { ...data, id: `local_${Date.now()}`, createdAt: Date.now() };
      collections.push(col);
      this.setLocalCollections(collections);
      return col;
    }
  }

  async getAllCollections(): Promise<Collection[]> {
    const uid = await this.currentUserId();
    if (!uid) return this.getLocalCollections();

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as CollectionRow[]).map(rowToCollection);
  }

  async getAllSnippets(): Promise<Snippet[]> {
    const uid = await this.currentUserId();
    if (!uid) return this.getLocalSnippets();

    const [snippetsRes, favoritesRes] = await Promise.all([
      supabase.from('snippets').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('favorites').select('snippet_id').eq('user_id', uid),
    ]);
    if (snippetsRes.error) throw snippetsRes.error;
    const favoriteIds = new Set((favoritesRes.data ?? []).map((f: { snippet_id: string }) => f.snippet_id));
    return (snippetsRes.data as SnippetRow[]).map(row => rowToSnippet(row, favoriteIds.has(row.id)));
  }

  async getSnippetById(id: string): Promise<Snippet | null> {
    const uid = await this.currentUserId();

    if (!uid) {
      const local = this.getLocalSnippets().find(s => s.id === id);
      if (local) return local;
    }

    const { data, error } = await supabase.from('snippets').select('*').eq('id', id).single();
    if (error || !data) return null;

    let isFav = false;
    if (uid) {
      const { data: fav } = await supabase
        .from('favorites')
        .select('snippet_id')
        .eq('user_id', uid)
        .eq('snippet_id', id)
        .maybeSingle();
      isFav = !!fav;
    }
    return rowToSnippet(data as SnippetRow, isFav);
  }

  async getCollectionById(id: string): Promise<Collection | null> {
    const uid = await this.currentUserId();

    if (!uid) {
      const local = this.getLocalCollections().find(c => c.id === id);
      return local?.isPublic ? local : null;
    }

    const { data, error } = await supabase.from('collections').select('*').eq('id', id).single();
    if (error || !data) return null;
    const col = rowToCollection(data as CollectionRow);
    if (col.isPublic || col.userId === uid) return col;
    return null;
  }

  async updateCollection(collection: Collection): Promise<void> {
    const uid = await this.currentUserId();
    if (!uid) {
      const all = this.getLocalCollections();
      const idx = all.findIndex(c => c.id === collection.id);
      if (idx !== -1) { all[idx] = collection; this.setLocalCollections(all); }
      return;
    }
    const { error } = await supabase
      .from('collections')
      .update({ name: collection.name, description: collection.description, is_public: collection.isPublic })
      .eq('id', collection.id);
    if (error) throw error;
  }

  async deleteCollection(id: string): Promise<void> {
    const uid = await this.currentUserId();
    if (!uid) {
      this.setLocalSnippets(this.getLocalSnippets().filter(s => s.collectionId !== id));
      this.setLocalCollections(this.getLocalCollections().filter(c => c.id !== id));
      return;
    }
    // snippets with on delete set null — delete collection only; snippets stay, unlinked
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) throw error;
  }

  async deleteSnippet(id: string): Promise<void> {
    const uid = await this.currentUserId();
    if (!uid) {
      this.setLocalSnippets(this.getLocalSnippets().filter(s => s.id !== id));
      return;
    }
    const { error } = await supabase.from('snippets').delete().eq('id', id);
    if (error) throw error;
  }

  async getFavorites(): Promise<string[]> {
    const uid = await this.currentUserId();
    if (!uid) {
      const data = localStorage.getItem('favorites');
      return data ? JSON.parse(data) : [];
    }
    const { data, error } = await supabase.from('favorites').select('snippet_id').eq('user_id', uid);
    if (error) throw error;
    return (data ?? []).map((f: { snippet_id: string }) => f.snippet_id);
  }

  async toggleFavorite(snippetId: string): Promise<boolean> {
    const uid = await this.currentUserId();

    if (!uid) {
      const favs: string[] = JSON.parse(localStorage.getItem('favorites') ?? '[]');
      const isFav = favs.includes(snippetId);
      localStorage.setItem('favorites', JSON.stringify(
        isFav ? favs.filter(id => id !== snippetId) : [...favs, snippetId]
      ));
      return !isFav;
    }

    const { data: existing } = await supabase
      .from('favorites')
      .select('snippet_id')
      .eq('user_id', uid)
      .eq('snippet_id', snippetId)
      .maybeSingle();

    if (existing) {
      await supabase.from('favorites').delete().eq('user_id', uid).eq('snippet_id', snippetId);
      return false;
    } else {
      await supabase.from('favorites').insert({ user_id: uid, snippet_id: snippetId });
      return true;
    }
  }

  async isFavorite(snippetId: string): Promise<boolean> {
    const uid = await this.currentUserId();
    if (!uid) {
      const favs: string[] = JSON.parse(localStorage.getItem('favorites') ?? '[]');
      return favs.includes(snippetId);
    }
    const { data } = await supabase
      .from('favorites')
      .select('snippet_id')
      .eq('user_id', uid)
      .eq('snippet_id', snippetId)
      .maybeSingle();
    return !!data;
  }

  async searchSnippets(term: string): Promise<Snippet[]> {
    const uid = await this.currentUserId();
    if (!uid) {
      const q = term.toLowerCase();
      return this.getLocalSnippets().filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    // Use Postgres full-text search via ilike for simplicity
    const { data, error } = await supabase
      .from('snippets')
      .select('*')
      .eq('user_id', uid)
      .or(`title.ilike.%${term}%,description.ilike.%${term}%,code.ilike.%${term}%`);
    if (error) throw error;
    return (data as SnippetRow[]).map(row => rowToSnippet(row));
  }

  async getSnippetsByCollectionId(collectionId: string): Promise<Snippet[]> {
    const col = await this.getCollectionById(collectionId);
    if (!col) return [];

    const uid = await this.currentUserId();
    if (!uid) return this.getLocalSnippets().filter(s => s.collectionId === collectionId);

    const { data, error } = await supabase
      .from('snippets')
      .select('*')
      .eq('collection_id', collectionId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as SnippetRow[]).map(row => rowToSnippet(row));
  }

  async getFavoriteSnippets(): Promise<Snippet[]> {
    const uid = await this.currentUserId();
    if (!uid) {
      const favs: string[] = JSON.parse(localStorage.getItem('favorites') ?? '[]');
      return this.getLocalSnippets().filter(s => favs.includes(s.id));
    }
    const { data, error } = await supabase
      .from('snippets')
      .select('*, favorites!inner(user_id)')
      .eq('favorites.user_id', uid);
    if (error) throw error;
    return (data as SnippetRow[]).map(row => rowToSnippet(row, true));
  }

  async updateSnippet(snippet: Snippet): Promise<void> {
    const uid = await this.currentUserId();
    if (!uid) {
      const all = this.getLocalSnippets();
      const idx = all.findIndex(s => s.id === snippet.id);
      if (idx !== -1) { all[idx] = snippet; this.setLocalSnippets(all); }
      return;
    }
    const { error } = await supabase
      .from('snippets')
      .update({
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags,
        collection_id: snippet.collectionId ?? null,
        is_public: snippet.isPublic,
      })
      .eq('id', snippet.id);
    if (error) throw error;
  }

  async moveSnippetToCollection(snippetId: string, collectionId: string | null): Promise<void> {
    const snippet = await this.getSnippetById(snippetId);
    if (!snippet) return;
    await this.updateSnippet({ ...snippet, collectionId: collectionId ?? undefined });
  }

  async duplicateSnippet(snippetId: string): Promise<Snippet> {
    const snippet = await this.getSnippetById(snippetId);
    if (!snippet) throw new Error('Snippet not found');
    const { id: _id, createdAt: _ts, favoritesCount: _fc, ...rest } = snippet;
    return this.createSnippet({ ...rest, title: `${snippet.title} (Copy)`, isFavorite: false });
  }
}

export const snippetService = new SnippetService(); 