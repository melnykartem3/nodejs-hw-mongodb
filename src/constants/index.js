import path from 'node:path';

export const sortOrderList = ['asc', 'desc'];

export const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000;
export const REFRESH_TOKEN_LIFETIME = 30 * 24 * 3600 * 1000;

export const TEMPLATES_DIR = path.resolve('src', 'templates');
export const TEMP_UPLOAD_DIR = path.resolve('src', 'temp');
export const PUBLIC_DIR = path.resolve('src', 'public');
export const PUBLIC_PHOTOS_DIR = path.resolve('src', 'public', 'photos');

export const SWAGGER_PATH = path.resolve('docs', 'swagger.json');
