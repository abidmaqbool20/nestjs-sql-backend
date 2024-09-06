import { execSync } from 'child_process';

export default async () => {
  // Example: Run a database migration or seed script
  execSync('npm run seed'); // This runs the seed script before tests

  // Additional setup can be performed here
};