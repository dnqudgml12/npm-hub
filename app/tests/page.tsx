import Background from '@/components/client/Background';
import Markdown from './Markdown';

export default function Page({ params: { query } }: { params: { query: string } }) {
  const decodedQuery = decodeURIComponent(query);
  return (
    <main className="min-h-screen relative">
      <Background />
      <div className="container mx-auto  py-8 relative z-10">
        <Markdown />
      </div>
    </main>
  );
}
