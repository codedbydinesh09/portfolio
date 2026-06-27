import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Custom plugin to handle local file uploads during development
function localUploadPlugin() {
  return {
    name: 'local-upload',
    configureServer(server: any) {
      server.middlewares.use('/api/upload', (req: any, res: any) => {
        if (req.method === 'POST') {
          const fileName = req.headers['x-file-name'];
          if (!fileName) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Missing x-file-name header' }));
          }

          const uploadDir = path.join(process.cwd(), 'public', 'uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          // Decode URI component just in case the filename is URL encoded
          const decodedName = decodeURIComponent(fileName as string);
          // Sanitize filename
          const safeName = decodedName.replace(/[^a-zA-Z0-9._-]/g, '_');
          const finalName = `${Date.now()}_${safeName}`;
          const filePath = path.join(uploadDir, finalName);
          
          const writeStream = fs.createWriteStream(filePath);
          req.pipe(writeStream);
          
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            // Return the public URL that Vite will serve
            res.end(JSON.stringify({ url: `/uploads/${finalName}` }));
          });

          req.on('error', (err: any) => {
            console.error('Upload error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to upload file' }));
          });
        } else if (req.method === 'DELETE') {
          // Add delete support for local files
          let body = '';
          req.on('data', (chunk: any) => body += chunk.toString());
          req.on('end', () => {
            try {
              const { url } = JSON.parse(body);
              if (url && url.startsWith('/uploads/')) {
                const filePath = path.join(process.cwd(), 'public', url);
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                }
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (e) {
              console.error(e);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to delete file' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localUploadPlugin()],
})
