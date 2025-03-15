# Étape 1: Utiliser l'image officielle de Bun.js
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Étape 2: Installer les dépendances dans un répertoire temporaire
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile --production

# Étape 3: Copier les dépendances et les fichiers de l'application
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Étape 4: Construire l'application React avec Vite
RUN bun run build

# Étape 5: Utiliser une image légère pour servir l'application
FROM nginx:alpine AS release

# Étape 6: Copier les fichiers construits dans le répertoire de Nginx
COPY --from=prerelease /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Étape 7: Exposer le port 80
EXPOSE 80

# Étape 8: Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]