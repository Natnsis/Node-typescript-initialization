"use client";

import { useState } from "react";

export default function FileHandlingPage() {
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
        className="absolute right-4 top-3.5 z-10 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-all duration-200 hover:bg-indigo-500 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            📁 File Upload with Multer + Streamifier + Cloudinary
          </h1>
          <p className="text-indigo-100 max-w-2xl mx-auto text-lg">
            Memory-efficient, stream-based file uploads — no temporary files,
            full TypeScript support.
          </p>
        </header>

        <div className="p-6 md:p-8 space-y-10">
          {/* Project Structure */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                📁 Project Structure
              </h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 font-mono text-sm text-gray-700 border border-gray-200">
              <pre>{`src/
├── middlewares/
│   └── multer.middleware.ts
├── controllers/
│   └── file.controller.ts
├── routes/
│   └── file.routes.ts`}</pre>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Middleware */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              1. Multer + Streamifier Middleware
            </h2>
            <p className="text-gray-600 mb-4">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                src/middlewares/multer.middleware.ts
              </code>{" "}
              — handles file uploads in memory and converts buffers to streams.
            </p>
            <CodeBlock id="multer-middleware" language="typescript">
              {`import { Request } from 'express';
import multer from 'multer';
import streamifier from 'streamifier';

// Store file in memory (no disk writes)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req: Request, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Convert Buffer → Readable Stream (for Cloudinary)
export const bufferToStream = (buffer: Buffer) => {
  return streamifier.createReadStream(buffer);
};`}
            </CodeBlock>
          </section>

          <hr className="border-gray-200" />

          {/* Controller */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              2. File Upload Controller (Cloudinary)
            </h2>
            <p className="text-gray-600 mb-4">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                src/controllers/file.controller.ts
              </code>{" "}
              — streams file directly to Cloudinary without saving to disk.
            </p>
            <CodeBlock id="file-controller" language="typescript">
              {`import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { bufferToStream } from '../middlewares/multer.middleware';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const stream = bufferToStream(req.file.buffer);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    res.status(200).json({
      message: '✅ Image uploaded successfully!',
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};`}
            </CodeBlock>
          </section>

          <hr className="border-gray-200" />

          {/* Route */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              3. File Upload Route
            </h2>
            <p className="text-gray-600 mb-4">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                src/routes/file.routes.ts
              </code>
            </p>
            <CodeBlock id="file-route" language="typescript">
              {`import { Router } from 'express';
import { uploadImage } from '../controllers/file.controller';
import { upload } from '../middlewares/multer.middleware';

const router = Router();

// POST /api/upload → single image upload
router.post('/upload', upload.single('image'), uploadImage);

export default router;`}
            </CodeBlock>
          </section>

          {/* Usage Tips */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-indigo-600 text-xl">💡</div>
              <div>
                <h3 className="font-bold text-indigo-800 text-lg mb-2">
                  How to Use
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700">
                  <li>
                    Send a{" "}
                    <code className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-sm">
                      POST
                    </code>{" "}
                    request to{" "}
                    <code className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-sm">
                      /api/upload
                    </code>{" "}
                    with form-data key{" "}
                    <code className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-sm">
                      image
                    </code>
                    .
                  </li>
                  <li>
                    Add Cloudinary credentials to your{" "}
                    <code className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-sm">
                      .env
                    </code>{" "}
                    file.
                  </li>
                  <li>
                    Install required packages:
                    <br />
                    <code className="block bg-gray-800 text-green-400 p-2 rounded mt-2 font-mono text-sm">
                      npm install cloudinary streamifier
                      <br />
                      npm install --save-dev @types/multer
                    </code>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t border-gray-200">
            <a
              href="/auth"
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50"
            >
              🔐 JWT Authentication Guide
            </a>
            <a
              href="/setup"
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              ⚙️ Back to Setup Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
