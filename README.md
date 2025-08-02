# Futuristic Developer Portfolio

A modern, responsive developer portfolio built with React, Vite, and Tailwind CSS featuring a futuristic design.

## Features

- **Landing Page** - Eye-catching hero section with profile photo and resume download
- **Tech Stack** - Interactive showcase of technologies and tools
- **Medium Articles** - Integration with Medium RSS feed to display latest articles
- **GitHub Projects** - Automated fetching of GitHub repositories with stats
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **Responsive Design** - Optimized for all device sizes
- **Fast Performance** - Powered by Vite for lightning-fast development

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Animations**: CSS animations and transitions

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Customization

### Personal Information
- Update the name and title in `src/components/Landing.jsx`
- Replace the profile image URL with your own photo
- Add your actual resume file to the `public` folder

### Medium Articles
- Replace the sample articles in `src/components/MediumArticles.jsx`
- Integrate with Medium RSS feed: `https://medium.com/feed/@yourusername`

### GitHub Projects
- Update the GitHub API call in `src/components/Projects.jsx`
- Replace `yourusername` with your actual GitHub username

### Social Links
- Update social media links in `src/components/Footer.jsx`
- Add or remove social platforms as needed

## Deployment

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment to any static hosting service.

## License

MIT License - feel free to use this template for your own portfolio!

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# dev-portfolio
