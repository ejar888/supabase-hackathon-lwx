<br />
<div align="center">
  <a href="https://github.com/ejar888/supabase-hackathon-lwx" style="background: black; color: white;">
    <img src="next-pwa/public/logo.svg" alt="Logo" width="50" height="50" style="color=white;">
  </a>

  <h1 align="center" style="border-bottom: 0;">The Attendace App</h1>

  <p align="center">
    Attendance app with face recognition features.
    <br />
  </p>
</div>

## About the project

Submission for Supabase Launch Week X Hackathon.

## Built with

- [Supabase](https://supabase.com/)

- [Next.js](https://nextjs.org/)

- [TensorFlow.js](https://github.com/tensorflow/tfjs-models)

- [@xenova/transformers](https://www.npmjs.com/package/@xenova/transformers)

- [Mantine](https://mantine.dev/)

- [React Webcam](https://www.npmjs.com/package/react-webcam)

- [@ducanh2912/next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa)


## Running locally

- Clone the repo
- Install dependencies
- Make sure docker is running and start supabase locally
```sh
npm run supabase:start
```
- Apply migration
```sh
npm run supabase:migration:up
```
- Change directory to `/next-pwa` and install dependencies
```sh
cd next-pwa
npm i
```
- Set up `.env` by copying `.env.example` and modifying accordingly
```sh
cp .env.example .env
```
- Start frontend
```sh
npm run dev
```
