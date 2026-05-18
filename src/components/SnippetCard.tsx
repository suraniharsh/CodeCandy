import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Snippet } from '../services/snippetService';

const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate" whileHover={{ y: -2 }}>
      <Link to={`/snippet/${snippet.id}`}>
        <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
          <CardContent className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
                {snippet.title}
              </h3>
              {snippet.isFavorite && (
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 flex-shrink-0 mt-0.5" />
              )}
            </div>

            <p className="text-muted-foreground text-xs line-clamp-2 flex-1">
              {snippet.description || 'No description provided'}
            </p>

            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary" className="text-xs font-mono px-2 py-0">
                {snippet.language}
              </Badge>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Clock className="w-3 h-3" />
                {new Date(snippet.createdAt).toLocaleDateString()}
              </div>
            </div>

            {snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {snippet.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                    {tag}
                  </Badge>
                ))}
                {snippet.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 text-muted-foreground">
                    +{snippet.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
