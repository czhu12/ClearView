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
      <script async src="https://docs.opencv.org/3.4/opencv.js" type="text/javascript"></script>
       <Quality uid={query.uid} />
      </main>
    </div>
  )
}
