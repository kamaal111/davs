import LoginForm from '@/users/components/login-form';

import styles from './page.module.sass';

function Login() {
  return (
    <main className={styles.main}>
      <LoginForm />
    </main>
  );
}

export default Login;
