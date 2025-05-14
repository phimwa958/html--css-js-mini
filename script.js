        // Add hover effect
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const x = e.pageX - card.offsetLeft;
                const y = e.pageY - card.offsetTop;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${(y - card.offsetHeight/2) / 15}deg)
                    rotateY(${-(x - card.offsetWidth/2) / 15}deg)
                    translateY(-10px)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-10px)';
            });
        });