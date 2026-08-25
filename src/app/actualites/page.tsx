import { articles } from '@/data/site';
import ArticleGrid from '@/components/ui/ArticleGrid';

export default function Actualites(){
    return(
        <>
        <div className="mx-auto px-4 py-8">
            <ArticleGrid articles={articles} />
        </div>
        
        
        </>
    )
}