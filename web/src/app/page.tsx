import { Button, Flex, Text } from '@radix-ui/themes';

import styles from './page.module.css';

function Home() {
  return (
    <main className={styles.main}>
      <Flex direction="column" gap="2">
        <Text>Hello from Radix Themes :)</Text>
        <Button>Let's go</Button>
      </Flex>
    </main>
  );
}

export default Home;
