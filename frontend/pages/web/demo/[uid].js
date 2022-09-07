import { useRouter } from 'next/router';
import Quality from '../../../src/devices/Quality'
import Header from '../../../src/components/Header';

export default function Home() {
  const { query, isReady } = useRouter();

  if (!isReady) {
    return <></>
  }
  return (
    <div>
      <Header />

      <main>
       <Quality uid={query.uid} />
      </main>
    </div>
  )
}
