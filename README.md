# Offshore Mate - Work Rotation Calendar Generator

![Offshore Mate Banner](public/og-image.png)

Offshore Mate is a modern web application built with Next.js 14 that helps offshore workers manage and visualize their work rotation schedules. Generate beautiful, easy-to-understand calendars for various offshore rotation patterns.

## 🌟 Features

<!-- AUTO-UPDATE:START -->
- **Multiple Rotation Patterns**
  - 14/14 (14 days on, 14 days off)
  - 14/21 (14 days on, 21 days off)
  - 21/21 (21 days on, 21 days off)
  - 28/28 (28 days on, 28 days off)

- **Interactive Calendar**
  - Visual distinction between work days, off days, and transition days
  - Month-by-month view for easy planning
  - Color-coded calendar entries
  - Responsive design for all devices

- **Export Capabilities**
  - Download calendars as high-quality PNG images
  - Perfect for sharing or printing
  - Optimized for various screen sizes
<!-- AUTO-UPDATE:END -->

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- Bun package manager (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/offshore-mate.git
cd offshore-mate
```

2. Install dependencies:
```bash
# Using bun (recommended)
bun install

# Or using npm
npm install
```

3. Start the development server:
```bash
# Using bun
bun dev

# Or using npm
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Using bun
bun run build

# Or using npm
npm run build
```

## 🛠️ Tech Stack

<!-- AUTO-UPDATE:START -->
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** 
  - Radix UI primitives
  - shadcn/ui components
  - Custom components
- **Date Handling:** date-fns
- **Calendar Generation:** Custom implementation
- **Image Export:** html2canvas
- **Icons:** Lucide React
<!-- AUTO-UPDATE:END -->

## 📱 Usage

1. **Select Start Date**
   - Click on the date picker
   - Choose your rotation start date
   - Future dates only

2. **Choose Rotation Pattern**
   - Select from available patterns (14/14, 14/21, 21/21, 28/28)
   - View details about work days and off days

3. **Generate Calendar**
   - Click "Generate Calendar" to create your schedule
   - View the full year calendar with color-coded days

4. **Download/Share**
   - Click the download button to save as PNG
   - Share with colleagues or family

## 🎨 Color Coding

- 🟧 **Orange** - Work Days
- 🟩 **Green** - Off Days
- 🟨 **Pink** - Transition Days (Travel/Changeover)
- ⬜ **Gray** - Days outside rotation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👏 Acknowledgments

- Design inspiration from modern calendar applications
- Offshore workers who provided valuable feedback
- The Next.js and React communities for excellent tools and documentation

## 🔄 Version History

<!-- AUTO-UPDATE:START -->
- **1.0.1** - Current stable release
  - Enhanced download functionality
  - Improved mobile responsiveness
  - Bug fixes and performance improvements

- **1.0.0** - Initial release
  - Basic calendar generation
  - Four rotation patterns
  - Download functionality
<!-- AUTO-UPDATE:END -->

## 📞 Support

For support, please:
- Open an issue on GitHub
- Contact the developer at [developer@email.com](mailto:developer@email.com)
- Visit our [website](https://offshore-mate.vercel.app)

## ⚡ Performance

The application is optimized for:
- Quick calendar generation
- Smooth animations and transitions
- Efficient memory usage
- Fast image exports

Built with ❤️ by Ramūnas Nognys