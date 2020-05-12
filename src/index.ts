import { config as dotenv } from 'dotenv';
import Server from './server';

// Load local ENV
dotenv();

const start = async () => {
  try {
    console.log( `Server running @ ${ Server.info.uri }` );
    await Server.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// kick it off
start();