# Image Dither

A web application that allows you to upload images and apply a Floyd-Steinberg dithering effect to them. Built with React 18, TypeScript, and Material-UI.

## Features

- Image upload with preview
- Real-time dithering effect application
- Side-by-side comparison of original and dithered images
- Modern, responsive UI with Material-UI components

## Prerequisites

- Node.js 20 or later
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web-dither
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Use

1. Click the "Upload Image" button to select an image from your computer
2. The application will display the original image alongside the dithered version
3. The dithering effect is applied automatically using the Floyd-Steinberg algorithm

## Technologies Used

- React 18
- TypeScript
- Material-UI
- Rollup (bundler)
- CSS Modules 