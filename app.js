document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('getRecommendationsButton');
    const moodSelect = document.getElementById('moodSelect');

    if (button) {
        button.addEventListener('click', async () => {
            const mood = moodSelect.value;

            try {
                const recommendations = await getRecommendations(mood);
                document.getElementById('movies').innerText = `Movies: ${recommendations.movies.join(', ')}`;
                document.getElementById('books').innerText = `Books: ${recommendations.books.join(', ')}`;
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        });
    }

    async function getRecommendations(mood) {
        const [movies, books] = await Promise.all([
            fetchMovies(mood),
            fetchBooks(mood)
        ]);
        return { movies, books };
    }

    async function fetchMovies(mood) {
        const genreId = mapMoodToGenre(mood).movie;
        const apiKey = "939b43723b59b3ea5b5490fbf967a7b1"; // Replace with your TMDB API key
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${randomPage}`;

        try {
            const response = await fetch(apiUrl, { headers: { 'Cache-Control': 'no-store' } });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();
            return data.results.map((movie) => movie.title).slice(0, 5);
        } catch (error) {
            console.error("Error fetching movies:", error);
            return ["No movies found"];
        }
    }

    async function fetchBooks(mood) {
        const apiKey = "AIzaSyArb3O8Xq37k68vhUhIswclCb6wS_8ML-E"; // Replace with your Google Books API key
        const query = mapMoodToGenre(mood).book+`&maxResults=5&startIndex=${Math.floor(Math.random()*40)}`;
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5&key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();
            return data.items.map((book) => book.volumeInfo.title).slice(0, 5);
        } catch (error) {
            console.error("Error fetching books:", error);
            return ["No books found"];
        }
    }

    function mapMoodToGenre(mood) {
        const genres = {
            happy: { movie: 35, book: 'happiness' }, // Comedy movies and happiness-related books
            sad: { movie: 18, book: 'sadness' },    // Drama movies and sadness-related books
            excited: { movie: 28, book: 'adventure' }, // Action movies and adventure-related books
            relaxed: { movie: 10749, book: 'relaxation' } // Romance movies and relaxation-related books
        };

        return genres[mood] || { movie: 99, book: 'general' }; // Default to documentaries/general books
    }
});