import cors from 'cors';

const cors_config = {
    // Allowed front-end access
    origin: [
        'http://localhost:5173',
        'http://localhost:8001',
    ],
    // Allowed methods
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
    // Allowed headers
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    // For session/cookie
    credentials: true,
    // Expose headers for client to read
    exposedHeaders: ['Content-Type', 'Set-Cookie'],
}

export const cors_rule = cors(cors_config);
