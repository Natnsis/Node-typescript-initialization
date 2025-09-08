"use client";

import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

// Install required package:
// npm install react-copy-to-clipboard

export default function SetupGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const copySuccess = (id: string) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Reusable Code Block with Copy Button
  const CodeBlock = ({
    children,
    id,
    language = "bash",
  }: {
    children: string;
    id: string;
    language?: string;
  }) => (
    <div className="group relative my-4 rounded-lg bg-gray-900 p-5 text-gray-100 shadow-md">
      <CopyToClipboard text={children} onCopy={() => copySuccess(id)}>
        <button
          className="absolute right-4 top-4 rounded bg-gray-700 px-3 py-1.5 text-sm font-medium text-white opacity-0 transition-opacity hover:bg-gray-600 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied === id ? "✅ Copied!" : "📋 Copy"}
        </button>
      </CopyToClipboard>
      <pre className={`overflow-x-auto text-sm`}>
        <code className="language-bash">{children.trim()}</code>
      </pre>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 text-gray-800">
      <header className="mb-10 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900">
          🚀 Node.js + Express + TypeScript + Prisma + ESLint + Prettier Starter
        </h1>
        <p className="text-lg text-gray-600">
          Step-by-step setup guide. Copy, paste, run — you’re ready in minutes.
        </p>
      </header>

      <main className="space-y-12">
        {/* SECTION 1 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            1. Initialize Project & Install Core Dependencies
          </h2>
          <p className="mb-3">Create project folder and initialize Node.js:</p>
          <CodeBlock id="init-project">
            {`mkdir my-express-app
cd my-express-app
npm init -y`}
          </CodeBlock>

          <p className="mb-3">Install Express, TypeScript, and dev tools:</p>
          <CodeBlock id="install-core">
            {`npm install express cors dotenv
npm install --save-dev typescript ts-node @types/express @types/node @types/cors nodemon`}
          </CodeBlock>

          <p className="mb-3">Install Prisma:</p>
          <CodeBlock id="install-prisma">
            {`npm install prisma --save-dev
npm install @prisma/client`}
          </CodeBlock>
        </section>

        {/* SECTION 2 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            2. Initialize TypeScript & Prisma
          </h2>
          <p className="mb-3">Generate TypeScript config:</p>
          <CodeBlock id="init-ts" language="bash">
            {`npx tsc --init`}
          </CodeBlock>

          <p className="mb-3">
            Initialize Prisma (creates <code>prisma/</code> and{" "}
            <code>.env</code>):
          </p>
          <CodeBlock id="init-prisma" language="bash">
            {`npx prisma init`}
          </CodeBlock>

          <p className="mb-3">
            Update <code>prisma/schema.prisma</code> with this starter model:
          </p>
          <CodeBlock id="schema-prisma" language="prisma">
            {`// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String?
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}`}
          </CodeBlock>

          <p className="mb-3">Run your first migration:</p>
          <CodeBlock id="migrate-dev" language="bash">
            {`npx prisma migrate dev --name init`}
          </CodeBlock>
        </section>

        {/* SECTION 3 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            3. Configure TypeScript — Update <code>tsconfig.json</code>
          </h2>
          <CodeBlock id="tsconfig" language="json">
            {`{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "lib": ["es2021"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": false,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`}
          </CodeBlock>
        </section>

        {/* SECTION 4 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            4. Create Express Server — <code>src/server.ts</code>
          </h2>
          <CodeBlock id="server-ts" language="typescript">
            {`import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: "✅ Server running with TypeScript + Prisma!" });
});

// GET /users
app.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ include: { posts: true } });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`🚀 Server ready at http://localhost:\${PORT}\`);
});`}
          </CodeBlock>
        </section>

        {/* SECTION 5 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            5. Add Scripts to <code>package.json</code>
          </h2>
          <CodeBlock id="package-json" language="json">
            {`{
  "name": "my-express-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.9.1",
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "@types/cors": "^2.8.13",
    "nodemon": "^3.0.1",
    "prisma": "^5.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "prettier": "^3.0.0"
  }
}`}
          </CodeBlock>
        </section>

        {/* SECTION 6 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            6. Setup ESLint + Prettier
          </h2>
          <p className="mb-3">
            Create <code>.eslintrc.json</code>:
          </p>
          <CodeBlock id="eslintrc" language="json">
            {`{
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "semi": true,
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 80,
        "tabWidth": 2
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": "warn"
  }
}`}
          </CodeBlock>

          <p className="mb-3">
            Create <code>.prettierrc.json</code>:
          </p>
          <CodeBlock id="prettierrc" language="json">
            {`{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}`}
          </CodeBlock>
        </section>

        {/* SECTION 7 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            7. Run Your Project
          </h2>
          <p className="mb-3">Start dev server:</p>
          <CodeBlock id="run-dev">{`npm run dev`}</CodeBlock>

          <p className="mb-3">Open Prisma Studio (GUI database viewer):</p>
          <CodeBlock id="prisma-studio">{`npm run prisma:studio`}</CodeBlock>

          <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-800">
            <strong>✅ You now have a full modern stack:</strong>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>TypeScript + Express backend</li>
              <li>Prisma ORM with SQLite (or your DB)</li>
              <li>ESLint + Prettier for code quality</li>
              <li>Auto-restart with nodemon</li>
              <li>Prisma Studio for visual DB management</li>
            </ul>
          </div>
        </section>

        {/* FOOTER TIP */}
        <div className="rounded-lg bg-blue-50 p-5 text-blue-800">
          <strong>💡 Pro Tip:</strong> Always add <code>.env</code> to{" "}
          <code>.gitignore</code>. Use environment variables for secrets.
          Generate Prisma Client after schema changes:
          <CodeBlock id="generate-client" language="bash">
            {`npx prisma generate`}
          </CodeBlock>
        </div>
      </main>
    </div>
  );
}
