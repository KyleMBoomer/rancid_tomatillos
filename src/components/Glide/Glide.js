import { useEffect, useRef } from 'react';
import Glide from '@glidejs/glide';
import MovieCards from '../MovieCards/MovieCard';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import './Glide.css';

function GlideComponent({ movies = [], handleMovieClick }) {
    const glideRef = useRef(null);
    const glideInstanceRef = useRef(null);

    useEffect(() => {
        if (glideRef.current && !glideInstanceRef.current) {
            glideInstanceRef.current = new Glide(glideRef.current, {
                type: 'carousel',
                perView: 3,
                gap: 8,
            });
            glideInstanceRef.current.mount();
        }

        return () => {
            if (glideInstanceRef.current) {
                glideInstanceRef.current.destroy();
                glideInstanceRef.current = null;
            }
        };
    }, [movies]);

    return (
        <div className="glide" ref={glideRef}>
            <div className="glide__track" data-glide-el="track">
                <ul className="glide__slides">
                    {movies.map(movie => (
                        <li className="glide__slide" key={movie.id}>
                            <MovieCards movie={movie} onClick={() => handleMovieClick(movie)} />
                            <div>{movie.title}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="glide__arrows" data-glide-el="controls">
                <button className="glide__arrow glide__arrow--left" data-glide-dir="<">‹</button>
                <button className="glide__arrow glide__arrow--right" data-glide-dir=">">›</button>
            </div>
        </div>
    );
}

export default GlideComponent;
