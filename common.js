document.addEventListener('DOMContentLoaded', () => {
  const audioInstructionsDiv = document.getElementById('audio-instructions');
  if (audioInstructionsDiv) {
    audioInstructionsDiv.innerHTML = `
      <h3>Audio Commands:</h3>
      <ul>
        <li><strong>Hello</strong>: Says hello world.</li>
        <li><strong>Change the color to [color]</strong>: Changes background color.</li>
        <li><strong>Navigate to [page]</strong>: Goes to homepage, stocks, or dogs page.</li>
        <li><strong>Load dog breed [breed]</strong>: (On dogs page) Loads info for that breed.</li>
      </ul>
    `;
  }

  const startButton = document.getElementById('micon');
  const stopButton = document.getElementById('micoff');

  if (typeof annyang !== 'undefined' && annyang) {
    if (startButton) {
      startButton.addEventListener('click', () => {
        annyang.start();
        console.log('Voice recognition started');
      });
    }

    if (stopButton) {
      stopButton.addEventListener('click', () => {
        annyang.abort();
        console.log('Voice recognition stopped');
      });
    }
  } else {
    console.warn('Annyang is not available.');
  }
}); `1`