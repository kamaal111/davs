import LoginForm from '@/users/components/login-form';

import styles from './page.module.css';

function Home() {
  return (
    <main className={styles.main}>
      <LoginForm />
    </main>
  );
}

export default Home;
