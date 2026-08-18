# Static site — nginx serves HTML, JS, SEO files, and img/
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html 404.html app.js robots.txt sitemap.xml /usr/share/nginx/html/
COPY img/ /usr/share/nginx/html/img/

EXPOSE 80
