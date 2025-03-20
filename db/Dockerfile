# Utiliser l'image officielle de PostgreSQL
FROM postgres:13

# Définir les variables d'environnement pour PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=ybDjiKA-Wc-uwthT
ENV POSTGRES_DB=kapuut-database

# Copier le script SQL dans le conteneur
COPY init.sql /docker-entrypoint-initdb.d/

# Exposer le port PostgreSQL
EXPOSE 5432