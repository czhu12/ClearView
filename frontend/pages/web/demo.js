import { useRouter } from 'next/router';
import Header from '../../src/components/Header';
import Devices from "../../src/devices/Devices";

export default function Home() {
  const { query, isReady } = useRouter();

  if (!isReady) {
    return <></>
  }
  return (
    <main>
      <Header />
      <Devices />
    </main>
  )
}
