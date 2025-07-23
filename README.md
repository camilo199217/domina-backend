# 🛠️ Pavas API – Prueba Técnica Backend

Este proyecto es una API RESTful construida con **Node.js**, **TypeScript**, **TypeORM** y **Routing Controllers**, diseñada como parte de una prueba técnica de Pavas.

## 🚀 Funcionalidad

La API permite:

- Crear, listar, actualizar y eliminar **categorías**
- Crear, listar, actualizar y eliminar **productos**
- Cada producto pertenece a una única categoría
- El nombre de cada categoría es **único**
- El nombre de cada producto es **único dentro de su categoría**

## 📚 Tecnologías utilizadas

- Node.js + TypeScript
- Express + Routing Controllers
- TypeORM (MySQL)
- class-validator / class-transformer
- Swagger para documentación
- Docker + Docker Compose

---

## 🧰 Requisitos

- Docker y Docker Compose
- Node.js `>=18`
- Yarn (recomendado)

---

## ⚙️ Instalación

```bash
git clone https://github.com/tu-usuario/pavas-backend.git
cd pavas-backend

cp .env
yarn
```
