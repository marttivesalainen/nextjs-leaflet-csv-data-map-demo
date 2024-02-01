import dynamic from "next/dynamic";


const Map = dynamic(() => import("../map/Map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <main>
      <Map />
    </main>
  );
}
