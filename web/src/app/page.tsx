import { headers } from 'next/headers';

function Home() {
  const headersList = headers();
  const session: { username: string } = JSON.parse(headersList.get('session')!);

  return (
    <main>
      <h1>{session.username}</h1>
    </main>
  );
}

export default Home;
