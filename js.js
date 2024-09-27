document.addEventListener('DOMContentLoaded', () => {
    let movies = []; // Declare the movies variable

    const lista = document.getElementById('lista');
    const btnSearch = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');
    const offcanvasElement = document.getElementById('offcanvasTop');
    const offcanvasBody = document.querySelector('.offcanvas-body');
    const offcanvasGenres = document.querySelector('.offcanvas-genres');
    const yearPeli = document.getElementById('yearPeli');
    const runtimePeli = document.getElementById('runtimePeli');
    const budgetPeli = document.getElementById('budgetPeli');
    const revenuePeli = document.getElementById('revenuePeli');

    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            movies = data; // Store the movies data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    function displayMovies(movies) {
        lista.innerHTML = ''; // Clear previous list
        movies.forEach(movie => {
            const divPeli = document.createElement('div');
            divPeli.className = "divPeli";
            divPeli.setAttribute('data-tooltip', "Click para ver más información");
            divPeli.style.cursor = "pointer"; // Make it clear it's clickable


            const divTexto = document.createElement('div')
            divTexto.className = "divTexto"
            divPeli.appendChild(divTexto);

            const titlePeli = document.createElement('li'); // Use span instead of li
            titlePeli.textContent = movie.title;
            titlePeli.className = "titlePeli";
            divTexto.appendChild(titlePeli);

            const tagPeli = document.createElement('li'); // Use span instead of li
            tagPeli.textContent = movie.tagline;
            tagPeli.className = "tagPeli";
            divTexto.appendChild(tagPeli);

            const divStars = document.createElement('div');
            divStars.className = "divStars";
            divPeli.appendChild(divStars); // Append stars div

            const votesPelis = Number(movie.vote_average);

            function percentageOfTen(votesPelis) {
                return (votesPelis / 10) * 100;
            }

            function starsOutOfFive(percentage) {
                return Math.round((percentage / 100) * 5);
            }

            const percentage = percentageOfTen(votesPelis);
            const outOfFive = starsOutOfFive(percentage); // Calculate stars

            function createStars() {
                const spanStars = document.createElement('span');
                spanStars.className = 'fa fa-star checked'; // Filled star
                divStars.appendChild(spanStars);
            }

            function createNOStars() {
                const spanNOStars = document.createElement('span');
                spanNOStars.className = 'fa fa-star'; // Empty star (not filled)
                spanNOStars.style.color = 'white';
                divStars.appendChild(spanNOStars);
            }

            // Repeat for the number of stars
            repeatFunction(createStars, outOfFive); // Filled stars
            repeatFunction(createNOStars, (5 - outOfFive)); // Empty stars

            // Add click event listener to divPeli
            divPeli.addEventListener('click', function () {
                // Clear previous content
                offcanvasBody.innerHTML = ''; // Clear previous content
                offcanvasGenres.innerHTML = ''; // Clear previous genres

                // Update offcanvas title and body with movie details
                document.querySelector('.offcanvas-title').textContent = movie.title;
                offcanvasBody.textContent = movie.overview;

                // Create a string of genres
                const genres = movie.genres.map(genre => genre.name).join(', ');
                const genreElement = document.createElement('p');
                genreElement.textContent = `${genres}`;

                // Append genres to the offcanvas genres div
                offcanvasGenres.appendChild(genreElement);

                // Show the offcanvas
                const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
                offcanvas.show();

                // Create a Date object from release_date
                const releaseDate = new Date(movie.release_date);
                const releaseYear = releaseDate.getFullYear();

                yearPeli.textContent = "Year: " + releaseYear;
                runtimePeli.textContent = "Runtime: " + movie.runtime + " mins";
                budgetPeli.textContent = "Budget: $" + movie.budget;
                revenuePeli.textContent = "Revenue: $" + movie.revenue;
            });

            lista.appendChild(divPeli);
        });
    }

    function repeatFunction(fn, times) {
        for (let i = 0; i < times; i++) {
            fn(); // Call the function
        }
    }

    btnSearch.addEventListener('click', function() {
        const searchTerm = inputBuscar.value.toLowerCase();
        const filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm)
        );
        if (searchTerm !== ''){
        displayMovies(filteredMovies); // Display filtered movies
        }else{
            alert("Barra de búsquedas vacía");
            
        }
    });

    // Reset offcanvas content when it is hidden
    offcanvasElement.addEventListener('hidden.bs.offcanvas', function () {
        offcanvasBody.innerHTML = '';
        offcanvasGenres.innerHTML = '';
    });
});