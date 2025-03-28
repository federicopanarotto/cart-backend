import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

const logs = {
  error: '❌ ERRORE:',
  start: '🚨 START:',
  success: '✅ SUCCESSO:',
  folder: '📁 CARTELLA CREATA:',
  file: '📄 FILE CREATO:'
}

const projectStructure = {
  src: {
    api: {
      'routes.ts': 'template/src/api/routes.ts',
    },
    errors: {
      'errors.index.ts': 'template/src/errors/errors.index.ts',
      'generic.error.ts': 'template/src/errors/generic.error.ts',
      'not-found.error.ts': 'template/src/errors/not-found.error.ts',
      'validation.error.ts': 'template/src/errors/validation.error.ts',
    },
    lib: {
      'custom-decorators.ts': 'template/src/lib/custom-decorators.ts',
      'typed-request.interface.ts': 'template/src/lib/typed-request.interface.ts',
      'validation.middleware.ts': 'template/src/lib/validation.middleware.ts',
    },
    'app.ts': 'template/src/app.ts',
    'index.ts': 'template/src/index.ts',
  },
  'tsconfig.json': 'template/tsconfig.js',
};

/**
 * Funzione ricorsiva per creare la struttura del progetto
 */
async function createStructure(basePath: string, structure: Record<string, any>) {
  for (const [name, content] of Object.entries(structure)) {
    const itemPath = path.join(basePath, name);

    if (typeof content === 'object') {
      // Se è un oggetto, è una cartella → creala e continua ricorsivamente
      await fs.mkdir(itemPath, { recursive: true });
      console.log(`${logs.folder} ${itemPath}`);
      await createStructure(itemPath, content);
    } else {
      // Se è una stringa, è un file → crealo con il contenuto specificato
      try {
        const contentFile = await fs.readFile('cli/' + content, 'utf-8');
        await fs.writeFile(itemPath, contentFile);
        console.log(`${logs.file} ${itemPath}`);
      } catch (err) {
        console.error(`${logs.error} Copia file ${content}:`, (err as Error).message);
      }
    }
  }
}

/**
 * Avvia la creazione del progetto
 */
async function createProject(projectName: string) {
  const projectPath = path.join(process.cwd(), projectName);

  try {
    await fs.access(projectPath);
    console.error(`${logs.error} la cartella ${projectName} esiste già! Scegli un altro nome.`);
    return;
  } catch (err) {}

  await fs.mkdir(projectPath, { recursive: true });

  console.log(`${logs.start} Creazione del progetto: ${projectPath}`);
  await createStructure(projectPath, projectStructure);
  console.log(`${logs.success} Struttura del progetto completata!`);
}

/**
 * Prompt per chiedere il nome del progetto
 */
function start() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Nome progetto: ', async (name) => {
    console.log();
    rl.close();
    try {
      await createProject(name);
    } catch (err) {
      console.error(`❌ Errore nella creazione del progetto: ${(err as Error).message}`);
    }
  });
}

start();