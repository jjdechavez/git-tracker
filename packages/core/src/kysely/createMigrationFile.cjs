const path = require("path");
const fs = require("fs");

/**
 * @param {string} name migration filename
 */
function createMigrationFile(name) {
  console.log(__dirname)
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  const fileName = `${timestamp}_${name}.ts`;
  const filePath = path.join(__dirname, '/migrations/', fileName);

  const fileContent = `import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}`;

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('Error creating file:', err);
    } else {
      console.log(`File ${fileName} created successfully at ${filePath}`);
    }
  });
}

// Example usage: tsx createMigrationFile.ts MigrationName
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a name for the migration.');
} else {
  createMigrationFile(migrationName);
}
