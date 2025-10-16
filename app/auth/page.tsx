"use client";

import { useState } from "react";

export default function AuthPage() {
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
    language = "typescript",
  }: {
    children: string;
    id: string;
    language?: string;
  }) => (
    <div className="group relative my-6 rounded-xl bg-gray-900 p-5 text-gray-100 shadow-lg border border-gray-800 overflow-hidden">
      <button
        onClick={() => copyToClipboard(children, id)}
        className="absolute right-4 top-3.5 z-10 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-all duration-200 hover:bg-emerald-500 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
      <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center text-white">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            🔐 JWT Authentication System
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
            Secure your Express API with JWT middleware — login, protected
            routes, and clean architecture.
          </p>
        </header>

        <div className="p-6 md:p-8 space-y-10">
          {/* Project Structure */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                📁 Project Structure
              </h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 font-mono text-sm text-gray-700 border border-gray-200">
              <pre>{`src/
├── middlewares/
│   └── jwt.middleware.ts
├── controllers/
│   └── auth.controller.ts
├── routes/
│   └── auth.routes.ts`}</pre>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* JWT Middleware */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              1. JWT Authentication Middleware
            </h2>
            <p className="text-gray-600 mb-4">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                src/middlewares/jwt.middleware.ts
              </code>
            </p>
            <CodeBlock id="jwt-middleware" language="typescript">
              {`import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user; // Attach decoded payload to request
    next();
  });
};`}
            </CodeBlock>
          </section>

          <hr className="border-gray-200" />

          {/* Auth Controller */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              2. Auth Controller (Login + Protected Route)
            </h2>
            <p className="text-gray-600 mb-4">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                src/controllers/auth.controller.ts
              </code>
            </p>
            <CodeBlock id="auth-controller" language="typescript">
              {`import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// ⚠️ In production, use Prisma or a real DB
const users = [
  { id: 1, email: 'user@example.com', password: 'password123' },
];

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: '✅ Login successful',
    token,
    user: { id: user.id, email: user.email },
  });
};

export const getProfile = (req: Request, res: Response) => {
  // req.user is attached by authenticateToken middleware
  res.json({
    message: '✅ Protected route accessed!',
    user: req.user,
  });
};`}
            </CodeBlock>
          </section>

          <hr className="border-gray-200" />

          {/* Auth Routes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              3. Auth Routes
            </h2>
            <p className="text-gray-600 mb-4">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                src/routes/auth.routes.ts
              </code>
            </p>
            <CodeBlock id="auth-routes" language="typescript">
              {`import { Router } from 'express';
import { login, getProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/jwt.middleware';

const router = Router();

// Public route
router.post('/login', login);

// Protected route
router.get('/profile', authenticateToken, getProfile);

export default router;`}
            </CodeBlock>
          </section>

          {/* Usage Tips */}
          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-emerald-600 text-xl">💡</div>
              <div>
                <h3 className="font-bold text-emerald-800 text-lg mb-2">
                  How to Use
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-emerald-700">
                  <li>
                    Send a{" "}
                    <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-sm">
                      POST
                    </code>{" "}
                    request to{" "}
                    <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-sm">
                      /api/auth/login
                    </code>{" "}
                    with:
                    <br />
                    <code className="block bg-gray-800 text-emerald-300 p-2 rounded mt-1 font-mono text-sm">
                      {`{ "email": "user@example.com", "password": "password123" }`}
                    </code>
                  </li>
                  <li>
                    For protected routes (e.g.,{" "}
                    <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-sm">
                      /api/auth/profile
                    </code>
                    ), include:
                    <br />
                    <code className="block bg-gray-800 text-emerald-300 p-2 rounded mt-1 font-mono text-sm">
                      Authorization: Bearer &lt;your-jwt-token&gt;
                    </code>
                  </li>
                  <li>
                    Install required packages:
                    <br />
                    <code className="block bg-gray-800 text-green-400 p-2 rounded mt-1 font-mono text-sm">
                      npm install jsonwebtoken
                      <br />
                      npm install --save-dev @types/jsonwebtoken
                    </code>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t border-gray-200">
            <a
              href="/setup"
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              ⚙️ Setup Guide
            </a>
            <a
              href="/file-handling"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
            >
              📁 File Handling Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
