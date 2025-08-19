const fs = require('fs');
const path = require('path');

const logos = [
  'fifa',
  'uefa-champions-league',
  'premier-league',
  'la-liga',
  'bundesliga',
  'serie-a',
  'ligue-1',
  'uefa-europa-league'
];

const logoTexts = {
  'fifa': { main: 'FIFA', sub: 'WORLD FOOTBALL' },
  'uefa-champions-league': { main: 'UEFA', sub: 'CHAMPIONS LEAGUE' },
  'premier-league': { main: 'PREMIER', sub: 'LEAGUE' },
  'la-liga': { main: 'LA LIGA', sub: 'SPAIN' },
  'bundesliga': { main: 'BUNDESLIGA', sub: 'GERMANY' },
  'serie-a': { main: 'SERIE A', sub: 'ITALY' },
  'ligue-1': { main: 'LIGUE 1', sub: 'FRANCE' },
  'uefa-europa-league': { main: 'UEFA', sub: 'EUROPA LEAGUE' }
};

function createSVG(logoName, color) {
  const text = logoTexts[logoName];
  const mainSize = text.main.length > 8 ? 14 : 16;
  const subSize = 10;
  
  return `<svg width="128" height="80" viewBox="0 0 128 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="80" fill="transparent"/>
  <text x="64" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="${mainSize}" font-weight="bold" fill="${color}">${text.main}</text>
  <text x="64" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="${subSize}" fill="${color}">${text.sub}</text>
  <circle cx="64" cy="70" r="2" fill="${color}"/>
</svg>`;
}

// Create logos directory if it doesn't exist
const logosDir = path.join(__dirname, '../public/images/logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Generate all logo files
logos.forEach(logo => {
  // Black version for light mode
  const blackSVG = createSVG(logo, 'black');
  fs.writeFileSync(path.join(logosDir, `${logo}-black.svg`), blackSVG);
  
  // White version for dark mode
  const whiteSVG = createSVG(logo, 'white');
  fs.writeFileSync(path.join(logosDir, `${logo}-white.svg`), whiteSVG);
  
  console.log(`Created ${logo}-black.svg and ${logo}-white.svg`);
});

console.log('All logo files created successfully!');
