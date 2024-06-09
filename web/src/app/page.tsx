import { headers } from 'next/headers';

import styles from './page.module.css';

function Home() {
  const headersList = headers();
  const session: { username: string } = JSON.parse(headersList.get('session')!);

  return (
    <main className={styles.main}>
      <h1>{session.username}</h1>
    </main>
  );
}

export default Home;
