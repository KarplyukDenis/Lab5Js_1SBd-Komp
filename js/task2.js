document.addEventListener('DOMContentLoaded', function() {
    const paletteColors = document.querySelectorAll('.color');
    const canvas = document.getElementById('canvas');
  
    let selectedColor = null;
  
    paletteColors.forEach(color => {
      color.addEventListener('click', function() {
        selectedColor = color.style.backgroundColor;
      });
    });
  
    canvas.addEventListener('click', function(event) {
      const square = event.target;
      if (selectedColor && square.classList.contains('square')) {
        square.style.backgroundColor = selectedColor;
      }
    });
  
    for (let i = 0; i < 64; i++) { 
      const square = document.createElement('div');
      square.classList.add('square');
      canvas.appendChild(square);
    }
  });
  