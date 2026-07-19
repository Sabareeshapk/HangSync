export default function HangmanDrawing({ lives }) {
  return (
    <div className="flex justify-center">
      <pre className="text-xl font-mono leading-5 text-white">
        {getDrawing(lives)}
      </pre>
    </div>
  );
}

function getDrawing(lives) {
  switch (lives) {
    case 6:
      return `
 +---+
 |   |
     |
     |
     |
     |
=========`;

    case 5:
      return `
 +---+
 |   |
 O   |
     |
     |
     |
=========`;

    case 4:
      return `
 +---+
 |   |
 O   |
 |   |
     |
     |
=========`;

    case 3:
      return `
 +---+
 |   |
 O   |
/|   |
     |
     |
=========`;

    case 2:
      return `
 +---+
 |   |
 O   |
/|\\  |
     |
     |
=========`;

    case 1:
      return `
 +---+
 |   |
 O   |
/|\\  |
/    |
     |
=========`;

    default:
      return `
 +---+
 |   |
 O   |
/|\\  |
/ \\  |
     |
=========`;
  }
}