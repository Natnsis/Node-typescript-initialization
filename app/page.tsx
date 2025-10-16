"use client";

import Link from "next/link";
import { useState } from "react";

export default function SetupGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const CodeBlock = ({
    children,
    id,
    language = "bash",
  }: {
    children: string;
    id: string;
    language?: string;
  }) => (
    <div className="group relative my-6 rounded-xl bg-gray-900 p-5 text-gray-100 shadow-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => copyToClipboard(children, id)}
        className="absolute right-4 top-3.5 z-10 rounded-md bg-gray-700 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-all duration-200 hover:bg-gray-600 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
        aria-label="Copy code"
      >
        {copied === id ? (
          <span className="flex items-center gap-1">
            <span>✅</span> Copied!
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <span>📋</span> Copy
          </span>
        )}
      </button>
      <pre className="overflow-x-auto text-sm leading-relaxed">
        <code className={`language-${language} block`}>{children.trim()}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-center text-white">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            🚀 Node.js + Express + TypeScript + Prisma + ESLint + Prettier
            Starter
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Step-by-step setup guide. Copy, paste, run — you’re ready in
            minutes.
          </p>
        </header>

        <div className="p-6 md:p-8 space-y-10">
          <main className="space-y-10">
            {/* SECTION 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-gray-700 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  1. Initialize Project & Install Core Dependencies
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Create project folder and initialize Node.js:
              </p>
              <CodeBlock id="init-project">
                {`mkdir my-express-app
cd my-express-app
npm init -y`}
              </CodeBlock>

              <p className="text-gray-600 mb-4">
                Install Express, TypeScript, and dev tools:
              </p>
              <CodeBlock id="install-core">
                {`npm install express cors dotenv
npm install --save-dev typescript ts-node @types/express @types/node @types/cors nodemon`}
              </CodeBlock>

              <p className="text-gray-600 mb-4">Install Prisma:</p>
              <CodeBlock id="install-prisma">
                {`npm install prisma --save-dev
npm install @prisma/client`}
              </CodeBlock>
            </section>

            <hr className="border-gray-200" />

            {/* SECTION 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-gray-700 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  2. Initialize TypeScript & Prisma
                </h2>
              </div>
              <p className="text-gray-600 mb-4">Generate TypeScript config:</p>
              <CodeBlock id="init-ts" language="bash">
                {`npx tsc --init`}
              </CodeBlock>

              <p className="text-gray-600 mb-4">
                Initialize Prisma (creates{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                  prisma/
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                  .env
                </code>
                ):
              </p>
              <CodeBlock id="init-prisma" language="bash">
                {`npx prisma init`}
              </CodeBlock>

              <p className="text-gray-600 mb-4">
                Update{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                  prisma/schema.prisma
                </code>{" "}
                with this starter model:
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

              <p className="text-gray-600 mb-4">Run your first migration:</p>
              <CodeBlock id="migrate-dev" language="bash">
                {`npx prisma migrate dev --name init`}
              </CodeBlock>
            </section>

            <hr className="border-gray-200" />

            {/* SECTION 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-gray-700 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  3. Configure TypeScript — Update{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                    tsconfig.json
                  </code>
                </h2>
              </div>
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

            <hr className="border-gray-200" />

            {/* SECTION 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-gray-700 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  4. Create Express Server —{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                    src/server.ts
                  </code>
                </h2>
              </div>
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

            <hr className="border-gray-200" />

            {/* SECTION 5 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-gray-700 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  5. Add Scripts to{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                    package.json
                  </code>
                </h2>
              </div>
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

            <hr className="border-gray-200" />

            {/* SECTION 6 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-gray-700 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  6. Setup ESLint + Prettier
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                Create{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                  .eslintrc.json
                </code>
                :
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

              <p className="text-gray-600 mb-4">
                Create{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                  .prettierrc.json
                </code>
                :
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

            <hr className="border-gray-200" />

            {/* SECTION 7 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-gray-700 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  7. Run Your Project
                </h2>
              </div>
              <p className="text-gray-600 mb-4">Start dev server:</p>
              <CodeBlock id="run-dev">{`npm run dev`}</CodeBlock>

              <p className="text-gray-600 mb-4">
                Open Prisma Studio (GUI database viewer):
              </p>
              <CodeBlock id="prisma-studio">{`npm run prisma:studio`}</CodeBlock>

              <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <strong className="text-green-800 font-bold">
                  ✅ You now have a full modern stack:
                </strong>
                <ul className="mt-3 list-disc pl-5 space-y-1 text-green-700">
                  <li>TypeScript + Express backend</li>
                  <li>Prisma ORM with SQLite (or your DB)</li>
                  <li>ESLint + Prettier for code quality</li>
                  <li>Auto-restart with nodemon</li>
                  <li>Prisma Studio for visual DB management</li>
                </ul>
              </div>
            </section>

            {/* FOOTER TIP */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <strong className="text-blue-800 font-bold">💡 Pro Tip:</strong>{" "}
              Always add{" "}
              <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-sm">
                .env
              </code>{" "}
              to{" "}
              <code className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-sm">
                .gitignore
              </code>
              . Use environment variables for secrets. Generate Prisma Client
              after schema changes:
              <CodeBlock id="generate-client" language="bash">
                {`npx prisma generate`}
              </CodeBlock>
            </div>
          </main>

          {/* Navigation */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/file-handling"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
            >
              📁 File Handling Guide
            </Link>
            <Link
              href="/auth"
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50"
            >
              🔐 JWT Authentication Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
